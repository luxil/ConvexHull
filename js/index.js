/**
 */


$(function() {
    init();
});

function init(){
    fileLoader.init('#fileLoader', loadCoSystem);
    coSystem.init('#coSystem');
}

function loadCoSystem(txtString) {
    console.log("test");
    $('#status').text(txtString);
}





