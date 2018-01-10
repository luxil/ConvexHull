/**
 */


$(function() {
    init();
});

function init(){
    fileLoader.init('#fileLoader', csLoadCoSystem);
    coSystem.init('#coSystem', gsaStartAlgorithm);
    grahamScanAlgorithm.init(csDrawConvexHull);
}

function csLoadCoSystem(txtString, element) {
    coSystem.loadPointsGraph(txtString, element);
}

function gsaStartAlgorithm(data) {
    grahamScanAlgorithm.start(data);
}

function csDrawConvexHull(stack, area){
    coSystem.drawConvexHull(stack, area);
}





