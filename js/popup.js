var tablink;
var styles = {};

chrome.tabs.getSelected(null, function(tab) {
    tablink = tab.url;
});

$(function() {
    var saved_css = '';

    chrome.storage.sync.get("css_injector", function(data) {
        if (data.css_injector) {
            styles = data.css_injector;
        }
        $('.gl-saved-css-js').val(JSON.stringify(data.css_injector));


        try {
            console.log(data.css_injector)

            $.each(data.css_injector, function(URL, OBJ) {
                $('.gl-saved-css-js-div').append("<strong>Saved Values</strong>");
                $('.gl-saved-css-js-div').append("<br />");
                $('.gl-saved-css-js-div').append("<br />");
                $('.gl-saved-css-js-div').append("<strong>URL: </strong>");
                $('.gl-saved-css-js-div').append(URL);
                $('.gl-saved-css-js-div').append("<br />");
                $('.gl-saved-css-js-div').append("<strong>CSS: </strong>");
                $('.gl-saved-css-js-div').append(OBJ.css);
                $('.gl-saved-css-js-div').append("<br />");
                $('.gl-saved-css-js-div').append("<strong>JS: </strong>");
                $('.gl-saved-css-js-div').append(OBJ.js);
                $('.gl-saved-css-js-div').append("<br />");
                $('.gl-saved-css-js-div').append("<hr />");

            })
            $('#z_style_editor').val(data.css_injector[tablink].css);
            $('#z_style_editor').html(data.css_injector[tablink].css);


            $('#z_js_editor').val(data.css_injector[tablink].js);
            $('#z_js_editor').html(data.css_injector[tablink].js);


            saved_css = data.css_injector[tablink].css;

        } catch (ex) {
            domin_name = getHostName(tablink);
            try {
                $('#z_style_editor').val(data.css_injector[domin_name].css);
                $('#z_style_editor').html(data.css_injector[domin_name].css);


                $('#z_js_editor').val(data.css_injector[domin_name].js);
                $('#z_js_editor').html(data.css_injector[domin_name].js);


                saved_css = data.css_injector[domin_name].css;
            } catch (ex) {

            }


        }
        editor = CodeMirror.fromTextArea(document.getElementById("z_style_editor"), {
            extraKeys: {
                "Ctrl-Space": "autocomplete"
            },
            lineNumbers: true,
            autofocus: true,
        });

        editor1 = CodeMirror.fromTextArea(document.getElementById("z_js_editor"), {
            extraKeys: {
                "Ctrl-Space": "autocomplete"
            },
            lineNumbers: true,
            //       autofocus: true,
        });
    });

    $('#view-gl-saved-css-js').on('click', function() {
        $('.gl-saved-css-js').toggle();
        $('.gl-saved-css-js-div').toggle();
    })

    $('#remove_style').on('click', removeStyle);
    $('#remove_js').on('click', removeJs);
    $('#format_code').on('click', function() {
        formated = formatCode(editor.getValue());
        editor.setValue(formated);
    });

    $('#z_css_injection').on('submit', addPageStyle);
    $('#z_js_injection').on('submit', addPageJs);

});

removeStyle = function() {
    $('#z_style_editor').val('');
    styles[tablink]['css'] = '';
    try {
        domin_name = getHostName(tablink);
        styles[domin_name]['css'] = '';
    } catch (ex) {

    }


    saveStylesToStorage(styles, 'css')
}

removeJs = function() {
    $('#z_js_editor').val('');
    styles[tablink]['js'] = '';
    saveStylesToStorage(styles, 'js')
}

formatCode = function(code) {
    var tab = 2,
        space = '';
    tab = (/^\d+$/.test(tab) ? parseInt(tab) : 4);
    code = code.split('{').join(' {\n    ')
        .split(';').join(';\n    ')
        .split(',').join(', ')
        .split('    }').join('}\n')
        .replace(/\}(.+)/g, '}\n$1')
        .replace(/\n    ([^:]+):/g, '\n    $1: ')
        .replace(/([A-z0-9\)])}/g, '$1;\n}');
    if (tab != 4) {
        for (; tab != 0; tab--) {
            space += ' ';
        }
        code = code.replace(/\n    /g, '\n' + space);
    }
    return code;
}


function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
}



addPageStyle = function() {
    // Cancel the form submit
    event.preventDefault();
    var z_style_editor = $('#z_style_editor').val();
    try {
        z_style_editor = editor.getValue();
    } catch (ex) {
        console.log(ex)
    }
    //z_style_editor = formatCode(z_style_editor);

    // styles[tablink] = {
    //     css: z_style_editor
    // };
    domin_name = getHostName(tablink);

    try {
        styles[tablink]['css'] = z_style_editor;

    } catch (ex) {
        console.error(ex);
        styles[tablink] = {};
        styles[tablink]['css'] = z_style_editor;
    }

    var apply_on_domain = $('#apply_on_domain:checkbox:checked').length > 0;

    if (apply_on_domain) {

        try {

            styles[domin_name]['css'] = z_style_editor;

        } catch (ex) {
            console.error(ex);
            styles[domin_name] = {};
            styles[domin_name]['css'] = z_style_editor;
        }

    }
    console.log(styles);
    saveStylesToStorage(styles, 'css')
}


addPageJs = function() {

    event.preventDefault();

    var z_js_editor = $('#z_js_editor').val();

    try {
        z_js_editor = editor1.getValue();
    } catch (ex) {
        console.log(ex)
    }
    try {
        styles[tablink]['js'] = z_js_editor;

    } catch (ex) {
        console.error(ex);
        styles[tablink] = {};
        styles[tablink]['js'] = z_js_editor;
    }

    saveStylesToStorage(styles, 'js')
}

saveStylesToStorage = function(s, eid) {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "saveStylesToStorageLiveUpate" });
    });



    chrome.storage.sync.set({
        'css_injector': s
    }, function() {
        $("#msg" + eid).html('Saved. Reload Page')
        $("#msg" + eid).show().delay(2000).fadeOut();
    });
}