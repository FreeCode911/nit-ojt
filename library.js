/* =========================================
   library.js - shows the files and copies them
   The code of each file comes from snippets.js
   ========================================= */

// 1. File names, index.html first
var names = Object.keys(FILES);
names.sort(function (a, b) {
    if (a === 'index.html') return -1;   // index first
    if (b === 'index.html') return 1;
    return a.localeCompare(b);
});

// 2. Settings for the file list
var PER_PAGE = 8;                // how many files on one page
var currentPage = 1;             // the page we are on now
var selectedName = names[0];     // the file open in the viewer

var list = document.getElementById('fileList');
var pageBar = document.getElementById('pageBar');
document.getElementById('fileCount').textContent = '(' + names.length + ')';

// extension of a file name, e.g. "index.html" -> "html"
function extOf(name) {
    var i = name.lastIndexOf('.');
    return i > 0 ? name.slice(i + 1).toLowerCase() : 'file';
}

// 3. Draw the file buttons of the current page
function renderList() {
    list.innerHTML = '';

    var start = (currentPage - 1) * PER_PAGE;
    var pageNames = names.slice(start, start + PER_PAGE);

    pageNames.forEach(function (name) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'file-btn';
        if (name === selectedName) {
            btn.classList.add('active');
        }

        var nameSpan = document.createElement('span');
        nameSpan.className = 'f-name';
        nameSpan.textContent = name;

        var ext = document.createElement('span');
        ext.className = 'type-badge ext-' + extOf(name);
        ext.textContent = extOf(name);

        btn.appendChild(nameSpan);
        btn.appendChild(ext);

        btn.addEventListener('click', function () {
            selectedName = name;
            showFile(name);
            renderList();
        });

        li.appendChild(btn);
        list.appendChild(li);
    });

    renderPages();
}

// 4. Draw the page buttons (only if the files overflow)
function renderPages() {
    var total = Math.ceil(names.length / PER_PAGE);

    pageBar.innerHTML = '';
    pageBar.style.display = total > 1 ? 'flex' : 'none';   // one page = no buttons

    for (var i = 1; i <= total; i++) {
        (function (page) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'page-btn' + (page === currentPage ? ' current' : '');
            b.textContent = page;
            b.addEventListener('click', function () {
                currentPage = page;
                renderList();
            });
            pageBar.appendChild(b);
        })(i);
    }
}

// 5. Show one file in the viewer
var codeEl = document.getElementById('code');
var nameEl = document.getElementById('fileName');
var infoEl = document.getElementById('fileInfo');
var typeEl = document.getElementById('fileType');
var copyBtn = document.getElementById('copyBtn');

function showFile(name) {
    // show the code (textContent keeps it as plain text, so it is safe)
    var text = FILES[name];
    codeEl.textContent = text;
    nameEl.textContent = name;
    infoEl.textContent = text.split('\n').length + ' lines';

    // badge in the toolbar (HTML / CSS / JS)
    typeEl.className = 'type-badge ext-' + extOf(name);
    typeEl.textContent = extOf(name);

    copyBtn.textContent = 'Copy';
}

// 6. Copy button
copyBtn.addEventListener('click', function () {
    var text = codeEl.textContent;

    copyText(text).then(function () {
        copyBtn.textContent = 'Copied!';
        setTimeout(function () {
            copyBtn.textContent = 'Copy';
        }, 1600);
    }).catch(function () {
        copyBtn.textContent = 'Press Ctrl+C';
        selectCode();
    });
});

// Copy helper: new API first, old method as fallback
function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).catch(function () {
            return copyWithTextarea(text);   // if the new API fails, try the old way
        });
    }

    return copyWithTextarea(text);
}

// Old copy method: select the text in a hidden box and copy it
function copyWithTextarea(text) {
    return new Promise(function (resolve, reject) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('copy failed'));
    });
}

// Select all the code so the user can copy manually with Ctrl+C
function selectCode() {
    var range = document.createRange();
    range.selectNodeContents(codeEl);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

// 7. Start: show the first file, draw the list
showFile(selectedName);
renderList();
