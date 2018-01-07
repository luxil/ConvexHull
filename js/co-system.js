//global for coordinate system

var coSystem= makeCoSystem();
function makeCoSystem() {

    var element;
    var selector;
    var svg;

    //variables for a flexible coordinate system
    var minX;
    var minY;
    var maxX;
    var maxY;
    //variable to check whether there should be a negative and postive x-axis
    var bPositiveAndNegativeXAxis;
    //variable to check whether there should be a negative and postive y-axis
    var bPositiveAndNegativeYAxis;

    var points;
    var sample;

    var radius = 5;


    function init(sl) {
        element = $(sl);
        selector = sl;
    }

    function loadPointsGraph(txtString){
        //$('#status').text(txtString);
        var arr = txtString.split(" ");
        points = [];

        maxX = -2147483648;
        maxY = -2147483648;
        minX = 2147483647;
        minY = 2147483647;
        for (var i = 0; i<arr.length; i+=2){
            var point = {x: arr[i], y: arr[i+1], onBoundary: false}
            points.push(point);
            maxX = Math.max(maxX, arr[i]);
            maxY = Math.max(maxY, arr[i+1]);
            minX = Math.min(minX, arr[i]);
            minY = Math.min(minY, arr[i+1]);
        }

        createCanvas(updateGraph);
    }

    function createCanvas(cb) {
        var canvasElement = $("<div/>");
        var width = 0;
        var height = 0;

        bPositiveAndNegativeXAxis = (maxX*minX < 0);
        bPositiveAndNegativeYAxis = (maxY*minY < 0);

        if(bPositiveAndNegativeXAxis)   width = maxX + Math.abs(minX);
        else                            width = Math.abs(maxX + minX);


        if(bPositiveAndNegativeYAxis)   height = maxY + Math.abs(minY);
        else                            height = Math.abs(maxY + minY);


        var relWidth = window.innerWidth ? window.innerWidth : $(window).width();
        var relHeight = window.innerHeight ? window.innerHeight : $(window).height();
        $('#status').text(relWidth);

        svg = d3.select(selector).append("svg")
            .attr("id", "svg")
            .attr("width", relWidth/4*3)
            .attr("height", relHeight/4*3)
        ;
        
        var borderPath = svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", relWidth/4*3)
            .attr("height", relHeight/4*3)
            .style("stroke", "#373737")
            .style("fill", "none")
            .style("stroke-width", 1)
        ;

        sample = svg.selectAll(".sample-node");
        cb();

        return canvasElement;
    }
    
    function updateGraph() {
        sample = sample.data(points);
        sample.enter().append("circle")
            .attr("class", "sample-node")
            .attr("r", radius)
            .attr("transform", function(d) {
                var x;
                var y;
                if(bPositiveAndNegativeXAxis)   x = parseInt(d.x) + Math.abs(minX);
                else                            x = d.x;
                if(bPositiveAndNegativeYAxis)   y = parseInt(d.y) + Math.abs(minY);
                else                            y = d.y;

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


    var scaleX = d3.scale.linear()
        .domain([10, 130])
        .range([0, 960]);


    return {
        init: function (selector) {
            init(selector);
        },
        loadPointsGraph: function (txtString) {
            loadPointsGraph(txtString);
        }
    }
}
