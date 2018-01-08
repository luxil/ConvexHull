/***
 * idea of the graham scan algorithm
 * inspiration from:
 * http://www.inf.fh-flensburg.de/lang/algorithmen/geo/graham.htm
 * http://brian3kb.github.io/graham_scan_js/
 * https://en.wikipedia.org/wiki/Graham_scan
 *
 * GRAHAM_SCAN(arr)       //array: Array of Points
 1. Find p0 in arr with minimum y-coordinate (and minimum x-coordinate if there are ties).
 2. Substract p0 from every point of arr (p0 should be the zero point)
 3. Sort the remaining points of arr (that is, Q − {p0}) by angle in counterclockwise order with respect to p0
 4.
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
    var stack;

    function start(data) {
        points = data.points;
        indexOfLowestY();
        points = arrSortedByAngle();
        calculateConvexHullStack();
        console.log(calculateAreaOfPolygon(stack));

    }

    //Find p0 in array with minimum y-coordinate (and minimum x-coordinate if there are ties).
    function indexOfLowestY() {
        p0 = points[0];
        for (var i = 1; i < points.length; i++) {
            var index = p0.index;
            if (i===145)
                console.log("");
            if (p0.y === points[i].y) {
                if (p0.x > points[i].x)
                    p0 = points[i];
            }
            else if (p0.y > points[i].y) {
                p0 = points[i];
            }
        }
        console.log(p0);
        return p0;
    }

    /**
     * Sort the remaining points of arr (that is, Q − {p0}) by angle in counterclockwise
     * order with respect to p0
     * if two points have the same angle to p0 then sort by distance
     */
    function arrSortedByAngle() {
        var reformattedArray = points.map(function (obj) {
            //Substract p0 from every point of arr (p0 should be the zero point)
            //and save to the variables tempX and tempY
            var tempX = obj.x - p0.x;
            var tempY = obj.y - p0.y;
            return {
                index: obj.index,
                x: obj.x,
                y: obj.y,
                angle: getAngle(tempX, tempY),
                sqDist: getSquareDistance(tempX, tempY)
            };
        });
        reformattedArray.sort(function (a, b) {
            if (a.angle > b.angle)
                return 1;
            else if (a.angle === b.angle) {
                if (a.sqDist > b.sqDist)
                    return 1;
                else
                    return 0;
            }
            return -1;
        });
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
    function getSquareDistance(x, y) {
        return x * x + y * y;
    }

    /**
     TOP [S] = 0                ▷ Lines 3-6 initialize the stack to contain, from bottom to top, first three points.
     PUSH (p0, S)
     PUSH (p1, S)
     PUSH (p2, S)
     for i = 3 to m             ▷ Perform test for each point p3, ..., pm.
     do while the angle between NEXT_TO_TOP[S], TOP[S], and pi makes a non-left turn  ▷ remove if not a vertex
     do POP(S)
     PUSH (S, pi)
     return S
     */
    function calculateConvexHullStack() {
        stack = [points[0], points[1], points[2]];

        for (var i = 3; i < points.length; i++) {
            var p_i = points[i];
            while (ccw(stack[stack.length - 2], stack[stack.length - 1], p_i) <= 0) {
                stack.pop();
            }
            stack.push(p_i);
        }

        coSystem.drawConvexHull(stack);
    }

    function ccw(p1, p2, p3) {
        return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x)
    }

    function calculateAreaOfPolygon(arr) {
        if (arr== null) return 0.0;     // test whether the array is empty
        var n = arr.length;             // number vertices of the Polygon
        if (n < 3) return 0.0;          // the Polygon should have at least three points
        var area = 0.0;

        for (var i = 0; i < n; i++) {                // Schleife zwecks Summenbildung
            area += (arr[i].y + arr[(i+1) % n].y) * (arr[i].x - arr[(i+1) % n].x);
        }

        return (Math.abs(area / 2.0));                    // Flaecheninhalt zurueckliefern
    }

    return {
        start: function (data) {
            start(data);
        }
    }
}