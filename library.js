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

// make text safe to show inside the preview page
function esc(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// 3. Draw the file buttons of the current page
function renderList() {
    list.innerHTML = '';

    var start = (currentPage - 1) * PER_PAGE;
    var pageNames = names.slice(start, start + PER_PAGE);

    pageNames.forEach(function (name) {
        var li = document.createElement('li');
        li.className = 'file-row';

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

        // small download button for this file
        var dl = document.createElement('button');
        dl.type = 'button';
        dl.className = 'dl-btn';
        dl.textContent = '\u2B07';            // down arrow
        dl.title = 'Download ' + name;
        dl.setAttribute('aria-label', 'Download ' + name);
        dl.addEventListener('click', function () {
            downloadFile(name);
        });

        li.appendChild(btn);
        li.appendChild(dl);
        list.appendChild(li);
    });

    renderPages();
}

// 4b. Download one file (saves it to the computer)
function downloadFile(name) {
    var ext = extOf(name);
    var types = {
        html: 'text/html',
        htm: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        json: 'application/json',
        md: 'text/markdown',
        txt: 'text/plain',
        php: 'text/plain'          // PHP is saved as plain text
    };
    var blob = new Blob([FILES[name]], { type: (types[ext] || 'text/plain') + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = name;                 // file name in the save dialog
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 2000);
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
    // back to the code view when a new file is opened
    closePreview();

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

// 5b. Live preview: run the file inside an iframe
var previewBtn = document.getElementById('previewBtn');
var previewPane = document.getElementById('previewPane');
var previewFrame = document.getElementById('previewFrame');
var codeBox = document.getElementById('codeBox');
var previewOpen = false;

// Put the file's own CSS inside the page, so the links to
// style.css / style2.css also work in the preview
function inlineAssets(html) {
    html = html.replace(/<link[^>]*href=["']([^"']+\.css)["'][^>]*>/gi, function (tag, href) {
        var key = href.split('/').pop();
        return FILES[key] ? '<style>\n' + FILES[key] + '\n</style>' : tag;
    });

    html = html.replace(/<script[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/gi, function (tag, src) {
        var key = src.split('/').pop();
        return FILES[key] ? '<script>\n' + FILES[key] + '\n<\/script>' : tag;
    });

    return html;
}

// Build the page that the preview shows
function buildDoc(name) {
    var text = FILES[name];
    var ext = extOf(name);

    // CSS: show a small sample page wearing that stylesheet
    if (ext === 'css') {
        return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
            '<style>' + text + '</style></head><body>' +
            '<h1>Heading 1</h1><h2>Heading 2</h2>' +
            '<p>This paragraph shows the text style of the file.</p>' +
            '<a href="#">A link</a> &nbsp; <button>A button</button>' +
            '<hr>' +
            '<ul><li>First list item</li><li>Second list item</li></ul>' +
            '<div>A plain div box</div>' +
            '</body></html>';
    }

    // JS: a small page that runs the script
    if (ext === 'js') {
        return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' +
            '<h1>JS preview</h1><div id="out"></div>' +
            '<scr' + 'ipt>' + text + '</scr' + 'ipt></body></html>';
    }

    // PHP: a browser cannot run PHP, so show a short note
    if (ext === 'php') {
        return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>' +
            '<body style="font-family: Segoe UI, Arial, sans-serif; padding: 24px; color: #1b2333;">' +
            '<h1 style="margin-top: 0;">PHP file: ' + esc(name) + '</h1>' +
            '<p>This is a PHP file. It needs a server (for example XAMPP) to run &mdash; ' +
            'a browser cannot run PHP by itself.</p>' +
            '<p>Open the <b>Code</b> view to read it, or press <b>Download</b> to save it.</p>' +
            '<pre style="background:#0d1526;color:#d8e5f7;padding:14px;border-radius:8px;overflow:auto;">' +
            esc(text) + '</pre>' +
            '</body></html>';
    }

    // HTML: the file itself, with its CSS inlined
    return inlineAssets(text);
}

function openPreview(name) {
    previewFrame.srcdoc = buildDoc(name);
    previewPane.hidden = false;
    codeBox.hidden = true;
    previewBtn.textContent = 'Back to code';
    previewOpen = true;
}

function closePreview() {
    previewPane.hidden = true;
    previewFrame.srcdoc = '';
    codeBox.hidden = false;
    previewBtn.textContent = 'Preview';
    previewOpen = false;
}

previewBtn.addEventListener('click', function () {
    if (previewOpen) {
        closePreview();
    } else {
        openPreview(selectedName);
    }
});

// toolbar Download button saves the file that is open now
document.getElementById('downloadBtn').addEventListener('click', function () {
    downloadFile(selectedName);
});

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
