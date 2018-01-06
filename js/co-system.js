//global for coordinate system

var coSystem = makeCoSystem();
function makeCoSystem() {
    var element;

    function init(selector) {
        test = selector;
        element = $(selector);
        element.append(createHeader());
        element.append(createDragDropDiv());
    }

    function createHeader() {
        var header = $('<div/>');
        $('<h1/>', {
                text: 'Convex Hull Demo'
        }).appendTo(header);

        $('<div/>', {
            id: 'status',
            text: 'Upload a file'
        }).appendTo(header);

        return header;
    }
    
    function createDragDropDiv() {
        var divCon = $('<div/>');

        var dropdiv = $('<div/>', {
            id: 'drop'
        }).appendTo(divCon);

        $('<span/>', {
            class: 'glyphicon glyphicon-cloud-upload cloud',
            text: 'Drop file here or click to browse',
            id: 'browse'
        }).appendTo(dropdiv);

        $('<input/>', {
            id: 'fileBox',
            type: 'file'
        }).appendTo(divCon);

        $('<div/>', {
            class: 'msg-drop'
        }).appendTo(dropdiv);

        $('<div/>', {
            id: 'list'
        }).appendTo(divCon);
        return divCon;
    }

    //code for drag and drop
    //https://www.htmlgoodies.com/html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html
    $(window).load(function(){
        $('#drop').click(function(){
            $('#fileBox').trigger('click');
        });
    });

    if (window.FileReader) {
        var drop;
        addEventHandler(window, 'load', function () {
            var status = document.getElementById('status');
            drop = document.getElementById('drop');

            function cancel(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;
            }

            // Tells the browser that we *can* drop on this target
            addEventHandler(drop, 'dragover', cancel);
            addEventHandler(drop, 'dragenter', cancel);

            addEventHandler(drop, 'drop', function (e) {
                e = e || window.event; // get window.event if e argument missing (in IE)
                if (e.preventDefault) {
                    e.preventDefault();
                } // stops the browser from redirecting off to the file

                var dt = e.dataTransfer;
                console.log(dt.files[0].name);
                var files = dt.files;
            });

        });
    } else {
        document.getElementById('status').innerHTML = 'Your browser does not support the HTML5 FileReader.';
    }


    function addEventHandler(obj, evt, handler) {
        if (obj.addEventListener) {
            // W3C method
            obj.addEventListener(evt, handler, false);
        } else if (obj.attachEvent) {
            // IE method.
            obj.attachEvent('on' + evt, handler);
        } else {
            // Old school method.
            obj['on' + evt] = handler;
        }
    }

    return {
        init: function (selector) {
            return init(selector)
        }
    }
}


