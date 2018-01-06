//global for coordinate system

var coSystem= makeCoSystem();
function makeCoSystem() {

    var element;
    var svg;

    function init(selector) {
        element = $(selector);

        svg = d3.select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    }

    return {
        init: function (selector) {
            init(selector);
        }
    }
}
