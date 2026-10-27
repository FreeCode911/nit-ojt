/* =========================================
   library.js - shows the files and copies them
   The code of each file comes from snippets.js
   ========================================= */

// 1. Get the file names and put index.html first
var names = Object.keys(FILES);
names.sort(function (a, b) {
    if (a === 'index.html') return -1;   // index first
    if (b === 'index.html') return 1;
    return a.localeCompare(b);
});

// 2. Build the clickable file list
var list = document.getElementById('fileList');
document.getElementById('fileCount').textContent = '(' + names.length + ')';

names.forEach(function (name) {
    var li = document.createElement('li');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'file-btn';
    btn.textContent = name;

    btn.addEventListener('click', function () {
        showFile(name, btn);
    });

    li.appendChild(btn);
    list.appendChild(li);
});

// 3. Show one file in the viewer
var codeEl = document.getElementById('code');
var nameEl = document.getElementById('fileName');
var infoEl = document.getElementById('fileInfo');
var copyBtn = document.getElementById('copyBtn');

function showFile(name, btn) {
    // highlight the selected button
    var all = document.querySelectorAll('.file-btn');
    for (var i = 0; i < all.length; i++) {
        all[i].classList.remove('active');
    }
    btn.classList.add('active');

    // show the code (textContent keeps it as plain text, so it is safe)
    var text = FILES[name];
    codeEl.textContent = text;
    nameEl.textContent = name;
    infoEl.textContent = text.split('\n').length + ' lines';
    copyBtn.textContent = 'Copy';
}

// 4. Copy button
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

// 5. Open the first file on load
showFile(names[0], list.querySelector('.file-btn'));
