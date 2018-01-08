/***
 * idea of the graham scan algorithm
 * inspiration from:
 * http://www.inf.fh-flensburg.de/lang/algorithmen/geo/graham.htm
 * and
 * http://brian3kb.github.io/graham_scan_js/
 * GRAHAM_SCAN(arr)       //array: Array of Points
 *
 *
 Find p0 in arr with minimum y-coordinate (and minimum x-coordinate if there are ties).
 Substract p0 from every point of arr (p0 should be the zero point)
 Sort the remaining points of arr (that is, Q − {p0}) by angle in counterclockwise order with respect to p0

 TOP [S] = 0                ▷ Lines 3-6 initialize the stack to contain, from bottom to top, first three points.
 PUSH (p0, S)
 PUSH (p1, S)
 PUSH (p2, S)
 for i = 3 to m             ▷ Perform test for each point p3, ..., pm.
 do while the angle between NEXT_TO_TOP[S], TOP[S], and pi makes a non-left turn  ▷ remove if not a vertex
 do POP(S)
 PUSH (S, pi)
 return S
 *
 */



var grahamScanAlgorithm = makeGrahamScanAlgorithm();

function makeGrahamScanAlgorithm() {
    var points;
    var p0;

    function start(data) {
        points = data.points;
        points = arrSortedByAngle();
        getVertices();
        
    }

    //Find p0 in array with minimum y-coordinate (and minimum x-coordinate if there are ties).
    function indexOfLowestY() {
        p0 = points[0];
        for(var i = 1; i < points.length; i++){
            if(p0.y > points[i].y){
                p0.y = points[i].y;
            } else if(p0.y === points[i].y){
                if(p0.x > points[i].x)
                    p0.x = points[i].x;
            }
        }
        console.log(p0);
        return p0;

        // var indicesSorted = new Array(points.length);
        // for (var i = 0; i < points.length; ++i) indicesSorted[i] = i;
        // indicesSorted.sort(function (a, b) { return points[a].x < points[b].x ? -1 : points[a].x > points[b].x ? 1 : a < b ? -1 : 1; });
        // indicesSorted.sort(function (a, b) { return points[a].y < points[b].y ? -1 : points[a].y > points[b].y ? 1 : a < b ? -1 : 1; });
        // return indicesSorted[0];
    }

    //Sort the remaining points of arr (that is, Q − {p0}) by angle in counterclockwise
    //order with respect to p0
    //if two points have the same angle to p0 then sort by distance
    function arrSortedByAngle() {
        var reformattedArray = points.map(function(obj){
            //Substract p0 from every point of arr (p0 should be the zero point)
            //and save to the variables tempX and tempY
            var tempX = obj.x-p0.x;
            var tempY = obj.y-p0.y;
            return {
                index : obj.index,
                x: obj.x,
                y: obj.y,
                angle: getAngle(tempX, tempY),
                sqDist: getSquareDistance(tempX, tempY)
            };
        });
        reformattedArray.sort(function(a, b) {
            if (a.angle > b.angle)
                return 1;
            else if (a.angle === b.angle){
                if (a.sqDist > b.sqDist)
                    return 1;
                else
                    return 0;
            }
            return -1;
        });
        //console.log(reformattedArray);
        return reformattedArray;

    }

    //calculate angle p0 with the x-axis
    function getAngle(x, y) {
        var angle;
        if (x > 0 && y > 0)
            angle = Math.atan(y / x);
        else if (x === 0 && y > 0)
            angle = Math.PI / 2;
        else if (x < 0 && y > 0)
            angle = Math.atan(-x / y) + Math.PI / 2;
        else if (x < 0 && y === 0)
            angle = Math.PI;
        else if (x < 0 && y < 0)
            angle = Math.atan(y / x) + Math.PI;
        else if (x === 0 && y < 0)
            angle = Math.PI / 2 + Math.PI;
        else if (x > 0 && y < 0)
            angle = Math.atan(-x / y) + Math.PI / 2 + Math.PI;
        else angle = 0;
        return angle;
    }

    //get the square of the distance because it is faster to calculate
    function getSquareDistance(x, y){
        return x*x+y*y;
    }
    
    function getVertices() {
        
    }

    return {
        start: function (data) {
            start(data);
        }
    }
}