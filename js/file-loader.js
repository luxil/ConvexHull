//global for coordinate system

var fileLoader = makeFileLoader();
function makeFileLoader() {
    var element;
    var callback;
    var header;

    function init(selector, cb) {
        callback = cb;
        element = $(selector);
        element.append(createHeader());
        element.append(createDragDropDiv(loadDragAndDropFunctions));
    }

    function createHeader() {
        header = $('<div/>',{
            id: "header"
        });
        $('<h1/>', {
                text: 'Convex Hull Demo'
        }).appendTo(header);

        $('<div/>', {
            id: 'status',
            text: 'Put file into the browser'
        }).appendTo(header);

        return header;
    }
    
    function createDragDropDiv(cb) {
        var divCon = $('<div/>');

        var dropdiv = $('<div/>', {
            id: 'drop'
        }).appendTo(divCon);

        // $('<span/>', {
        //     class: 'glyphicon glyphicon-cloud-upload cloud',
        //     id: 'browse'
        // }).appendTo(dropdiv);

        // $('<input/>', {
        //     id: 'fileBox',
        //     type: 'file'
        // }).appendTo(divCon);

        $('<div/>', {
            class: 'msg-drop'
        }).appendTo(dropdiv);


        loadDragAndDropFunctions();

        return divCon;
    }
    
    function loadDragAndDropFunctions() {
        //code for drag and drop
        //https://www.htmlgoodies.com/html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html
        // $(window).load(function(){
        //     // $('#drop').click(function(){
        //     //     $('#fileBox').trigger('click');
        //     // });
        // });

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
                    var file = dt.files[0];
                    var fileDisplayArea = document.getElementById('status');
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        fileDisplayArea.innerText = typeof(reader.result);
                        callback(reader.result, header);
                    }

                    reader.readAsText(file);
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

        function readTextFile(file) {
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        var allText = rawFile.responseText;
                        alert(allText);
                    }
                }
            }
            rawFile.send(null);
        }
    }


    return {
        init: function (selector, callback) {
            return init(selector, callback)
        }
    }
}


