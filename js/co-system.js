//global for coordinate system

var coSystem= makeCoSystem();
function makeCoSystem() {

    var element;
    var element2;
    var selector;
    var svg;

    //variables for a flexible coordinate system
    var minX;
    var minY;
    var maxX;
    var maxY;
    var xRange = 0;
    var yRange = 0;
    //variable to check whether there should be a negative and postive x-axis
    var bPositiveAndNegativeXAxis;
    //variable to check whether there should be a negative and postive y-axis
    var bPositiveAndNegativeYAxis;
    var relWidth;
    var relHeight;

    const MIN = -2147483648;
    const MAX = 2147483647;

    var points;
    var sample;

    var radius = 5;


    function init(sl) {
        element = $(sl);
        selector = sl;
    }

    function loadPointsGraph(txtString, el){
        element2 = el;
        el.hide();

        // var arr = txtString.split(/\n| \n|\n |\\s+/);
        var arr = txtString.split(/\s+/);
        ///(?:\n| )+/
        // (?:,| )+/
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

        createCanvas(updateGraph);
    }

    function createCanvas(cb) {
        // var canvasElement = $("<div/>");

        bPositiveAndNegativeXAxis = (maxX*minX < 0);
        bPositiveAndNegativeYAxis = (maxY*minY < 0);

        if(bPositiveAndNegativeXAxis)   xRange = maxX + Math.abs(minX);
        else                            xRange = Math.abs(maxX - minX);

        if(bPositiveAndNegativeYAxis)   yRange = maxY + Math.abs(minY);
        else                            yRange = Math.abs(maxY - minY);


        relWidth = (window.innerWidth ? window.innerWidth : $(window).width())/10*9;
        relHeight = (window.innerHeight ? window.innerHeight : $(window).height())/10*9;
        $('#status').text(relWidth);

        $(selector).empty();
        svg = d3.select(selector).append("svg")
            .attr("id", "svg")
            .attr("width", relHeight)
            .attr("height", relHeight)
        ;
        
        var borderPath = svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", relHeight)
            .attr("height", relHeight)
            .style("stroke", "#373737")
            .style("fill", "none")
            .style("stroke-width", 1)
        ;

        sample = svg.selectAll(".sample-node");
        cb();
    }

    function updateGraph() {
        sample = sample.data(points);

        var min = Math.min(minX, minY);
        var max;
        var maxRange = Math.max(xRange, yRange);



        var scaleX = d3.scale.linear()
            .domain([minX, minX+maxRange])
            .range([20, relHeight-20]);

        var scaleY = d3.scale.linear()
            .domain([minY, minY+maxRange])
            .range([20, relHeight-20]);

        sample.enter().append("circle")
            .attr("class", "sample-node")
            .attr("r", radius)
            .attr("transform", function(d) {
                var x;
                var y;
                if(bPositiveAndNegativeXAxis)   x = scaleX(parseInt(d.x));
                else                            x = scaleX(parseInt(d.x));
                if(bPositiveAndNegativeYAxis)   y = scaleY(parseInt(d.y));
                else                            y = scaleY(parseInt(d.y));

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
