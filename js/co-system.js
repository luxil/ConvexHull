//global for coordinate system

var coSystem= makeCoSystem();
function makeCoSystem() {

    var element;
    var element2;
    var callback;
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
    var scaleX;
    var scaleY;

    //different svgLayers to place circles on top (over the lines)
    var svgLayer1;
    var svgLayer2;

    function init(sl, cb) {
        element = $(sl);
        callback = cb;
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

        var index = 0;
        for (var i = 0; i<arr.length-1; i+=2){
            var point = {index: index, x: parseInt(arr[i]), y: parseInt(arr[i+1]), onBoundary: false};
            points.push(point);
            maxX = Math.max(maxX, arr[i]);
            maxY = Math.max(maxY, arr[i+1]);
            minX = Math.min(minX, arr[i]);
            minY = Math.min(minY, arr[i+1]);
            index++;
        }

        createCanvas();
    }

    function createCanvas() {
        //variable to check whether there should be a negative and postive x-axis
        var bPositiveAndNegativeXAxis = (maxX*minX < 0);
        //variable to check whether there should be a negative and postive y-axis
        var bPositiveAndNegativeYAxis = (maxY*minY < 0);
        var relWidth = (window.innerWidth ? window.innerWidth : $(window).width())/10*9;
        var relHeight = (window.innerHeight ? window.innerHeight : $(window).height())/10*9;
        var rectLength = Math.min(relHeight, relWidth);
        var bord = rectLength*0.1;

        var xRange = (bPositiveAndNegativeXAxis ? maxX + Math.abs(minX) : Math.abs(maxX - minX));
        var yRange = (bPositiveAndNegativeYAxis ? maxY + Math.abs(minY) : Math.abs(maxY - minY));
        var maxRange = Math.max(xRange, yRange);
        scaleX = d3.scale.linear().domain([minX, minX+maxRange]).range([bord, rectLength-bord]);
        scaleY = d3.scale.linear().domain([minY, minY+maxRange]).range([bord, rectLength-bord]);
		
        $(selector).empty();

		var dropdiv = $('<div/>', {
            id: 'areaInfo',
			text: 'TEST'
        }).appendTo(element);
		
        svg = d3.select(selector).append("svg")
            .attr("id", "svg")
            .attr("viewBox", "0 0 " + (scaleX(maxX)+bord) + " " + (scaleY(maxY)+bord))
        ;

        svgLayer1 = svg.append('g');
        svgLayer2 = svg.append('g');

        sample = svgLayer2.selectAll(".sample-node");
        sample = sample.data(points);

        sample.enter().append("circle")
            .attr("class", "sample-node")
            .attr("r", radius+"%")
            .attr("transform", function(d) {
                var x=scaleX(parseInt(d.x));
                var y=scaleY(maxY)+bord - scaleY(parseInt(d.y));

                return "translate(" + x + "," + y + ")"
            })
            .attr("id", function (d,i) {return "c_"+i;})
            .style("fill", function(d) {
                if (d.onBoundary === false)     return "#000000";
                else                            return "#ff0000";
            })
            .style("cursor", "pointer");
        sample.exit().remove();

        var data = {
            points: points,
            minY: minY
        };

        callback(data);

    }

    function drawLineWithIndex(i1, i2) {
        svgLayer1
            .append('line')
            .attr({
                x1: d3.transform(d3.select("#c_"+i1.toString()).attr("transform")).translate[0],
                y1: d3.transform(d3.select("#c_"+i1.toString()).attr("transform")).translate[1],
                x2: d3.transform(d3.select("#c_"+i2.toString()).attr("transform")).translate[0],
                y2: d3.transform(d3.select("#c_"+i2.toString()).attr("transform")).translate[1],
                stroke: '#000'
            });
    }

    function markPointWithIndex(index) {
        d3.select("#c_" + index)
            .attr({r: radius*1.4+"%"})
            .style("fill", "red");
        ;
        svg.select("#nodes").selectAll(".node");
    }

    function selectPointWithIndex(index) {
        d3.select("#c_" + index)
            .attr({r: radius*1.4+"%"})
            .style("fill", "yellow");
        ;
        svg.select("#nodes").selectAll(".node");
    }

    function drawConvexHull(stack, _area) {
        for (var i = 0; i < stack.length-1; i++){
            drawLineWithIndex(stack[i].index, stack[i+1].index);
        }
        drawLineWithIndex(stack[stack.length-1].index, stack[0].index);

        for (var i = 0; i < stack.length-1; i++){
            setTimeout(function(y) {
                markPointWithIndex(stack[y].index);
                selectPointWithIndex(stack[y+1].index);
            }, i*500, i);
        }
		
		$('#areaInfo').text(_area);
		
    }

    return {
        init: function (selector, callback) {
            init(selector, callback);
        },
        loadPointsGraph: function (txtString, element) {
            loadPointsGraph(txtString, element);
        },
        drawConvexHull: function (stack, _area) {
            drawConvexHull(stack, _area);
        }
    }
}
