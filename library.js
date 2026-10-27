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

// 1b. Tabs: the ME folder is the first tab, every folder
//     inside ME gets its own tab (e.g. "PHP")
var tabs = ['ME'];
names.forEach(function (name) {
    var slash = name.indexOf('/');
    if (slash > 0) {
        var folder = name.slice(0, slash);
        if (tabs.indexOf(folder) === -1) {
            tabs.push(folder);
        }
    }
});
var currentTab = 'ME';              // the tab we are looking at

// the files that belong to the open tab
function tabNames() {
    return names.filter(function (name) {
        if (currentTab === 'ME') {
            return name.indexOf('/') === -1;             // top level = ME
        }
        return name.indexOf(currentTab + '/') === 0;     // inside that folder
    });
}

// what a tab is called: the ME folder itself is shown as "HTML"
function tabLabel(tab) {
    return tab === 'ME' ? 'HTML' : tab;
}

// "PHP/hello.php" -> "hello.php" (the folder is already the tab name)
function baseName(name) {
    return name.split('/').pop();
}

// 2. Settings for the file list
var PER_PAGE = 8;                // how many files on one page
var currentPage = 1;             // the page we are on now
var selectedName = names[0];     // the file open in the viewer

var list = document.getElementById('fileList');
var pageBar = document.getElementById('pageBar');
var countEl = document.getElementById('fileCount');

// the search box (added at the top of the file list)
var searchBox = document.getElementById('searchBox');
var query = '';                     // what the user has typed, lower case

countEl.textContent = '(' + tabNames().length + ')';

// file names of the open tab that match what was typed (empty search = all)
function searchResults() {
    var files = tabNames();
    if (!query) {
        return files;
    }
    return files.filter(function (name) {
        return name.toLowerCase().indexOf(query) !== -1;
    });
}

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

    var files = tabNames();              // everything in the open tab
    var matches = searchResults();

    // (13) normally, (3/13) while searching - counts are per tab
    countEl.textContent = query
        ? '(' + matches.length + '/' + files.length + ')'
        : '(' + files.length + ')';

    // nothing to show - a message instead of an empty box
    if (matches.length === 0) {
        var empty = document.createElement('li');
        empty.className = 'no-results';
        empty.textContent = query
            ? 'No file matches "' + searchBox.value.trim() + '"'
            : 'This folder is empty';
        list.appendChild(empty);
        pageBar.style.display = 'none';
        return;
    }

    // a search shows every match at once, without page buttons
    var pageNames = query
        ? matches
        : matches.slice((currentPage - 1) * PER_PAGE, (currentPage - 1) * PER_PAGE + PER_PAGE);

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
        nameSpan.textContent = baseName(name);    // file name only, no folder

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
        dl.title = 'Download ' + baseName(name);
        dl.setAttribute('aria-label', 'Download ' + baseName(name));
        dl.addEventListener('click', function () {
            downloadFile(name);
        });

        li.appendChild(btn);
        li.appendChild(dl);
        list.appendChild(li);
    });

    // page buttons stay hidden while a search is running
    if (query) {
        pageBar.style.display = 'none';
    } else {
        renderPages();
    }
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
    a.download = name.split('/').pop();   // only the file name, not the folder
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 2000);
}

// 4. Draw the page buttons (only if the files overflow)
function renderPages() {
    var total = Math.ceil(tabNames().length / PER_PAGE);

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

// 4c. Search box: the list filters while you type
function applySearch() {
    query = searchBox.value.trim().toLowerCase();
    currentPage = 1;                 // always start from the top again
    renderList();
}

searchBox.addEventListener('input', applySearch);      // typing
searchBox.addEventListener('search', applySearch);     // the little "x" / Escape

// Enter opens the first match, Escape clears the box
searchBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        var first = searchResults()[0];
        if (first) {
            selectedName = first;
            showFile(first);
            renderList();
        }
    }

    if (e.key === 'Escape') {
        searchBox.value = '';
        applySearch();
        searchBox.focus();
    }
});

// 4d. Folder tabs above the list (ME / PHP / ...)
var tabBar = document.getElementById('tabBar');

function renderTabs() {
    tabBar.innerHTML = '';

    tabs.forEach(function (tab) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'tab-btn' + (tab === currentTab ? ' active' : '');
        b.textContent = tabLabel(tab);
        b.setAttribute('aria-pressed', tab === currentTab ? 'true' : 'false');
        b.addEventListener('click', function () {
            currentTab = tab;
            currentPage = 1;
            query = searchBox.value.trim().toLowerCase();

            // open the first file of that tab if the current one is elsewhere
            var files = tabNames();
            if (files.length && files.indexOf(selectedName) === -1) {
                selectedName = files[0];
                showFile(selectedName);
            }

            renderTabs();
            renderList();
        });
        tabBar.appendChild(b);
    });
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
    nameEl.textContent = baseName(name);      // file name only, no folder
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

    // PHP: a browser cannot run PHP by itself - openPreview() asks the
    // server for the real output. This is the fallback when there is no server.
    if (ext === 'php') {
        return phpNote(name, 'A browser cannot run PHP by itself &mdash; it needs a server.');
    }

    // HTML: the file itself, with its CSS inlined
    return inlineAssets(text);
}

// ---------- PHP preview: show the REAL output ----------

// Same small head (styles) for the three PHP pages below
function phpHead() {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
        '<style>' +
        // dark chrome, matching the library site
        'body{margin:0;font-family:Segoe UI,Arial,sans-serif;background:#0b1526;color:#dce8f8;}' +
        '.bar{background:#08131f;color:#9fd0ff;font-size:11px;font-weight:700;' +
        'letter-spacing:.16em;text-transform:uppercase;padding:9px 16px;}' +
        '.wrap{max-width:880px;margin:0 auto;padding:14px 16px 20px;}' +
        // the row that says what happened
        '.status{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:12px;color:#8fb3d9;}' +
        '.pill{padding:4px 11px;border-radius:999px;font-weight:700;font-size:11px;}' +
        '.good{background:rgba(34,197,94,.16);border:1px solid rgba(34,197,94,.45);color:#4ade80;}' +
        '.bad{background:rgba(255,159,67,.14);border:1px solid rgba(255,159,67,.45);color:#ffb26b;}' +
        '.wait{background:rgba(77,171,247,.14);border:1px solid rgba(77,171,247,.45);color:#7dc4ff;}' +
        '.url{font-family:Consolas,monospace;color:#7ea6d4;}' +
        // the white area = how the page looks in a real browser
        '.page{margin-top:12px;background:#fff;color:#141b2b;border-radius:10px;' +
        'padding:26px 28px;min-height:280px;box-sizing:border-box;overflow:auto;' +
        'box-shadow:0 14px 34px rgba(0,0,0,.38);font-size:16px;line-height:1.65;}' +
        '.text{white-space:pre-wrap;word-break:break-word;margin:0;}' +
        'h1{margin:0 0 8px;font-size:17px;color:#0f172a;}' +
        'p{margin:0 0 12px;line-height:1.6;}' +
        'a{color:#2563eb;}' +
        '</style></head><body>';
}

// Shown for the second or two while we wait for the server
function phpLoading(name) {
    return phpHead() +
        '<div class="bar">PHP preview</div>' +
        '<div class="wrap">' +
        '<div class="status"><span class="pill wait">RUNNING</span>' +
        'asking the server to run <span class="url">ME/' + esc(name) + '</span>&hellip;</div>' +
        '<div class="page"><p>Working&hellip;</p></div>' +
        '</div></body></html>';
}

// Shown when we cannot show a real output (no server, or server has no PHP)
function phpNote(name, reason) {
    return phpHead() +
        '<div class="bar">PHP preview</div>' +
        '<div class="wrap">' +
        '<div class="status"><span class="pill bad">NO SERVER</span>' + reason + '</div>' +
        '<div class="page">' +
        '<h1>' + esc(baseName(name)) + '</h1>' +
        '<p>Open <b>http://nit.gt.tc/</b> and press <b>Preview</b> there &mdash; ' +
        'the server really runs this file, so you will see its output.</p>' +
        '<p>For now, here is the code:</p>' +
        '<pre style="margin:0;background:#08131f;color:#d8e5f7;padding:16px;' +
        'border-radius:8px;overflow:auto;font-family:Consolas,monospace;font-size:14px;">' +
        esc(FILES[name]) + '</pre>' +
        '</div></div></body></html>';
}

// Shown with the output the server sent back
function phpResult(name, out) {
    // one status row for every result: green tick + which file + how much came back
    var status = '<div class="status">' +
        '<span class="pill good">&#10003; EXECUTED ON THE SERVER</span>' +
        '<span class="url">ME/' + esc(name) + '</span>' +
        '<span>' + new Blob([out]).size + ' bytes</span></div>';

    // an empty result - say so instead of showing a blank page
    if (!out || !out.trim()) {
        return phpHead() +
            '<div class="bar">Real output &mdash; PHP executed on the server</div>' +
            '<div class="wrap">' + status +
            '<div class="page"><h1>' + esc(baseName(name)) + '</h1>' +
            '<p>The file ran without any error, but it printed nothing.</p></div>' +
            '</div></body></html>';
    }

    // a complete HTML page - show it exactly as the server sent it
    if (/<\s*(html|!doctype)/i.test(out)) {
        return out;
    }

    // contains tags -> render it; plain text -> keep the line breaks, stay safe
    var body = /<[a-z][^>]*>/i.test(out) ? out : '<div class="text">' + esc(out) + '</div>';

    return phpHead() +
        '<div class="bar">Real output &mdash; PHP executed on the server</div>' +
        '<div class="wrap">' + status +
        '<div class="page">' + body + '</div>' +
        '</div></body></html>';
}

// Ask the server for the executed file (only works when the site is hosted)
function runPhp(name) {
    // 1. opened the file directly -> there is no server at all
    if (location.protocol !== 'http:' && location.protocol !== 'https:') {
        return Promise.resolve(phpNote(name,
            'You are looking at the file directly, so there is no server to run it.'));
    }

    // encode each folder/file part on its own: ME/PHP/hello.php stays readable
    var path = 'ME/' + name.split('/').map(encodeURIComponent).join('/');

    return fetch(path, { cache: 'no-store' })
        .then(function (res) {
            if (!res.ok) {
                throw new Error('HTTP ' + res.status);
            }
            return res.text();
        })
        .then(function (out) {
            // 2. the server sent the source back -> it has no PHP installed
            if (/^\s*<\?php/i.test(out) || /^\s*<\?=/i.test(out)) {
                return phpNote(name, 'This server does not run PHP, so it only sent the file back unchanged.');
            }
            return phpResult(name, out);
        })
        .catch(function () {
            return phpNote(name, 'There is no server here, or the file could not be found.');
        });
}

function openPreview(name) {
    previewPane.hidden = false;
    codeBox.hidden = true;
    previewBtn.textContent = 'Back to code';
    previewOpen = true;

    // PHP: the server really runs it - wait a moment for the output
    if (extOf(name) === 'php') {
        previewFrame.srcdoc = phpLoading(name);
        runPhp(name).then(function (doc) {
            // only swap the page if this file is still the one being previewed
            if (previewOpen && selectedName === name) {
                previewFrame.srcdoc = doc;
            }
        });
        return;
    }

    previewFrame.srcdoc = buildDoc(name);
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

// 7. Start: show the first file, draw the tabs and the list
renderTabs();
showFile(selectedName);
renderList();
