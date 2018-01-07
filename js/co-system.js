//global for coordinate system

var coSystem= makeCoSystem();
function makeCoSystem() {

    var element;
    var element2;
    var selector;
    var svg;

    const MIN = -2147483648;
    const MAX = 2147483647;
    const radius = 0.6;

    var points;
    var sample;

    //variables for a flexible coordinate system
    var minX;
    var minY;
    var maxX;
    var maxY;
    //variable to check whether there should be a negative and postive x-axis
    var bPositiveAndNegativeXAxis;
    //variable to check whether there should be a negative and postive y-axis
    var bPositiveAndNegativeYAxis;
    var rectLength;
    var maxRange;

    function init(sl) {
        element = $(sl);
        selector = sl;
    }

    function loadPointsGraph(txtString, el){
        element2 = el;
        el.hide();
        var arr = txtString.split(/\s+/);
        points = [];

        maxX = MIN;
        maxY = MIN;
        minX = MAX;
        minY = MAX;

        for (var i = 0; i<arr.length-1; i+=2){
            var point = {x: arr[i], y: arr[i+1], onBoundary: false};
            points.push(point);
            maxX = Math.max(maxX, arr[i]);
            maxY = Math.max(maxY, arr[i+1]);
            minX = Math.min(minX, arr[i]);
            minY = Math.min(minY, arr[i+1]);
        }

        createCanvas();
    }

    function createCanvas(cb) {
        var relWidth = (window.innerWidth ? window.innerWidth : $(window).width())/10*9;
        var relHeight = (window.innerHeight ? window.innerHeight : $(window).height())/10*9;
        rectLength = Math.min(relHeight, relWidth);

        bPositiveAndNegativeXAxis = (maxX*minX < 0);
        bPositiveAndNegativeYAxis = (maxY*minY < 0);

        var xRange = 0;
        var yRange = 0;
        if(bPositiveAndNegativeXAxis)   xRange = maxX + Math.abs(minX);
        else                            xRange = Math.abs(maxX - minX);

        if(bPositiveAndNegativeYAxis)   yRange = maxY + Math.abs(minY);
        else                            yRange = Math.abs(maxY - minY);
        maxRange = Math.max(xRange, yRange);

        var bord = rectLength*0.1;


        var scaleX = d3.scale.linear()
            .domain([minX, minX+maxRange])
            .range([bord, rectLength-bord]);

        var scaleY = d3.scale.linear()
            .domain([minY, minY+maxRange])
            .range([bord, rectLength-bord]);


        $(selector).empty();
        svg = d3.select(selector).append("svg")
            .attr("id", "svg")
            .attr("viewBox", "0 0 " + (scaleX(maxX)+bord) + " " + (scaleY(maxY)+bord))
        ;

        sample = svg.selectAll(".sample-node");
        sample = sample.data(points);

        sample.enter().append("circle")
            .attr("class", "sample-node")
            .attr("r", radius+"%")
            .attr("transform", function(d) {
                var x=scaleX(parseInt(d.x));
                var y=scaleY(maxY)+bord - scaleY(parseInt(d.y));

                return "translate(" + x + "," + y + ")"
            })
            .attr("id", function (d,i) {
                return "c_"+i;
            })
            .style("fill", function(d) {
                if (d.onBoundary === false)     return "#000000";
                else                            return "#ff0000";
            })
            .style("cursor", "pointer");
        sample.exit().remove();
        cb();
    }

    return {
        init: function (selector) {
            init(selector);
        },
        loadPointsGraph: function (txtString, element) {
            loadPointsGraph(txtString, element);
        }
    }
}
