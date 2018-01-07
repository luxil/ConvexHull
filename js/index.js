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
    coSystem.loadPointsGraph(txtString);
}





