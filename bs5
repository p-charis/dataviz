(function(window, currentScript) {

// CloudTables Bootstrap loader
if (! window.__ct_datasets) {
    window.__ct_datasets = [];
}

var insertScript = currentScript;

// Best effort for IE. Edge and everything else support currentScript
if (! insertScript) {
    var scripts = document.getElementsByTagName('script');
    insertScript = scripts[ scripts.length - 1 ];
}

// Insert point can be overridden and might not be the script
var insertPoint = insertScript;

if (''.length !== 0) {
    var el = document.querySelector('[data-ct-insert=""]');

    if (el) {
        insertPoint = el;
    }
    else {
        console.error('CloudTables: Insert point "" not found (no element with `data-ct-insert` attribute set to that value).');
    }
}

// Attribute can be on the insert point (if there is one), or the host script tag
function getAttribute(name) {
    // InsertPoint might be the same as insertScript!
    if (insertPoint) {
        var attr = insertPoint.getAttribute('data-' + name);

        if (attr) {
            return attr;
        }
    }

    return insertScript.getAttribute('data-' + name);
}

var accessToken = getAttribute('token');
var apiKey = getAttribute('apiKey');
var clientId = getAttribute('clientId');
var clientName = getAttribute('clientName');
var condition = getAttribute('condition');
var duration = getAttribute('duration');
var insertToken = getAttribute('insert');
var role = getAttribute('role');


if (! accessToken && ! apiKey) {
    console.error('CloudTables: No security access token detected. Please specify the `data-token` attribute');

    var p = document.createElement('p');
    p.innerHTML = 'Sorry - unable to show CloudTable (error code: NOTOKEN). Please contact your system administrator to resolve this issue.';
    p.className = 'cloudtables-error';

    insertPoint.parentNode.insertBefore(p, insertPoint);

    return;
}

window.__ct_datasets.push({
    accessToken: accessToken,
    apiKey: apiKey,
    clientId: clientId,
    clientName: clientName,
    condition: condition,
    datasetId: 'a53ffc96-7326-11ec-8a89-0b82dfc73f11',
    duration: duration,
    insertPoint: insertToken ? insertToken : insertPoint,
    language: '',
    loadUrl: 'https://m8haxjspcw.cloudtables.io',
    requiredLibs: {"dt":"101.0.18","date":"101.0.0","e":"101.0.11","jq":"3.3.1","moment":"2.18.1","pickr":"1.8.2","r":"101.0.4","sl":"101.0.2","so":"4.0.2","sp":"101.0.4","trumbowyg":"2.20.0"},
    role: role,
    stylingLibs: {"bm":"0.9.3","bs":"3.3.7","bs4":"4.6.0","bs5":"5.1.3","dt":"101.0.18","ju":"1.12.1","se":"2.4.1","zf":"6.4.3","_action":"bs5"},
    viewType: 'table'
});

if (window.__ct_boostrap_requested) {
    // If already requested, then it will either run as part of the queue, or if the queue has
    // already been run, run it again.
    if (window.__ct_bootstrap) {
        window.__ct_bootstrap.run();
    }
}
else {
    window.__ct_boostrap_requested = true;

    var n = document.createElement( 'script' );
    n.setAttribute( 'src', 'https://m8haxjspcw.cloudtables.io/js/ct-edge-bootstrap.js?_=edge-1641587210575' );
    n.async = false;

    document.head.appendChild( n );
}

})(window, document.currentScript);