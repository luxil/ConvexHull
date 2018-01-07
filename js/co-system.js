//global for coordinate system

var coSystem= makeCoSystem();
function makeCoSystem() {

    var element;
    var selector;
    var svg;

    var width;
    var height;
    var points;




    function init(sl) {
        element = $(sl);
        selector = sl;
    }

    function loadPointsGraph(txtString){
        //$('#status').text(txtString);
        var arr = txtString.split(" ");
        points = [];

        width = 0;
        height = 0;
        for (var i = 0; i<arr.length; i+=2){
            points.push([arr[i], arr[i+1]]);
            width = Math.max(width, arr[i]);
            height = Math.max(height, arr[i+1]);
        }
        $('#status').text(width);
        createCanvas();
    }

    function createCanvas() {
        var canvasElement = $("<div/>");
        svg = d3.select(selector).append("svg")
            .attr("id", "svg")
            .attr("width", width+40)
            .attr("height", height+40)
        ;

        //Create the Scale we will use for the Axis
        var axisScale = d3.scale.linear().domain([0, width]).range([0, width]);
        var yAxisScale = d3.scale.linear().domain([0, height]).range([0, height]);

        // Create the Axis
        var xAxis = d3.svg.axis()
            .scale(axisScale)
            .tickValues([50,100,150,200])
            .tickSize(10, 0)
        ;

        var yAxis = d3.svg.axis()
            .orient("right")
            .scale(yAxisScale)
            .tickValues([50,100,150,200])
            .tickSize(10, 0)
        ;

        //Create an SVG group Element for the Axis elements and call the xAxis function
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll(".tick")
            .style("stroke", "black")
            .selectAll(".tick text")
            .style("text-anchor", "start")
            .attr("x", -13)
            .attr("y", 15)
            .attr("font-size", "12")

        ;

        //Create an SVG group Element for the Axis elements and call the xyxis function
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + height + ",0)")
            .call(yAxis)
            .selectAll(".tick")
            .style("stroke", "black")
            .selectAll(".tick text")
            .style("text-anchor", "start")
            .attr("x", 13)
            .attr("y", -5)
            .attr("font-size", "12")
        ;


        var borderPath = svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("stroke", "#373737")
            .style("fill", "none")
            .style("stroke-width", 1)
        ;

        return canvasElement;
    }

    return {
        init: function (selector) {
            init(selector);
        },
        loadPointsGraph: function (txtString) {
            loadPointsGraph(txtString);
        }
    }
}
