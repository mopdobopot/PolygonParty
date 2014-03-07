/**
 * @Author Lomovtsev Pavel
 * Date: 11.10.13
 * Time: 20:28
 */

var Test = (function() {

    var eps = 0.001;

    var compareNumbers = function(a, b) {
            if (Math.abs(a - b) < eps) {
                console.log("compared right");
                return true;
            }
            else {
                console.error("expected " + a + ", found " + b + ", test failed");
                return false;
            }
        },
        comparePoints = function(p1, p2) {
            if (Math.abs(p1.x - p2.x) < eps &&
                Math.abs(p1.y - p2.y) < eps) {
                console.log("compared right");
                return true;
            }
            else {
                console.error("expected " + p1 + ", found " + p2 + ", test failed");
                return false;
            }
        },
        logResult = function(success) {
            if (success) {
                console.log("success\n");
                return true;
            }
            else {
                console.error("failure\n");
                return false;
            }
        };

    return {

        testAll: function() {
            if (
                this.testDist() &&
                this.testGetTriangleSquare() &&
                this.testGetSquare() &&
                this.testDistToSegment() &&
                this.testGetLinesIntersection() &&
                this.testIsPointOnSegment() &&
                this.testIsPointInPolygon()
            ) {
                console.log("------------------------SUCCESS------------------------");
                return true;
            }
            else {
                console.error("------------------------FAILURE------------------------");
                return false;
            }
        },

        /* Geometry */

        testDist: function() {
            console.log("\nTestDist");
            if (
                compareNumbers(3, Geometry.dist({x: 0, y: 0}, {x: 3, y: 0})) &&
                compareNumbers(1, Geometry.dist({x: 0, y: 0}, {x: 0, y: 1})) &&
                compareNumbers(0, Geometry.dist({x: 0, y: 0}, {x: 0, y: 0})) &&
                compareNumbers(Math.sqrt(13), Geometry.dist({x: 0, y: 0}, {x: 2, y: 3}))
            ) {
                console.log("success\n");
                return true;
            }
            else {
                console.error("failure\n");
                return false;
            }
        },

        testGetTriangleSquare: function() {
            console.log("\nTestGetTriangleSquare");
            var success = true;
            var p1 = {x: 0, y: 0},
                p2 = {x: 0, y: 2},
                p3 = {x: 2, y: 0};
            if (!compareNumbers(2, Geometry.getTriangleSquare(p1, p2, p3)))
                success = false;
            p1 = {x: 2, y: -3};
            p2 = {x: 8, y: -3};
            p3 = {x: 4, y: -1};
            if (!compareNumbers(6, Geometry.getTriangleSquare(p1, p2, p3)))
                success = false;
            return logResult(success);
        },

        /* BasePolygon */

        testGetSquare: function() {
            console.log("\nTestGetSquare");
            var success = true,
                bp = BasePolygon;
            bp.dropVertexes();
            bp.addVertex({x: 1, y: 1});
            bp.addVertex({x: -1, y: 1});
            bp.addVertex({x: -1, y: -1});
            bp.addVertex({x: 1, y: -1});
            if (!compareNumbers(4, bp.getSquare()))
                success = false;
            bp.dropVertexes();
            bp.addVertex({x: 7, y: 0});
            bp.addVertex({x: 5, y: 2});
            bp.addVertex({x: 2, y: 2});
            bp.addVertex({x: 0, y: 0});
            if (!compareNumbers(10, bp.getSquare()))
                success = false;
            bp.dropVertexes();
            bp.addVertex({x: 0, y: 1});
            bp.addVertex({x: -1, y: 0});
            bp.addVertex({x: -1, y: -3});
            bp.addVertex({x: 0, y: -2});
            bp.addVertex({x: 1, y: -2});
            bp.addVertex({x: 2, y: -1});
            bp.addVertex({x: 2, y: 2});
            bp.addVertex({x: 1, y: 1});
            if (!compareNumbers(9, bp.getSquare()))
                success = false;
            Geometry.shiftPolygon(bp.vertexes, Math.random() * 10000, Math.random() * 10000);
            if (!compareNumbers(9, bp.getSquare()))
                success = false;
            return logResult(success);
        },

        testDistToSegment: function() {
            console.log("\nTestDistToSegment");
            var success = true,
                p = {x: 0, y: 0},
                segA = {x: 0, y: 1},
                segB = {x: 1, y: 0};
            if (!compareNumbers(Geometry.distToSegment(p, segA, segB), Math.sqrt(2) / 2)) {
                success = false;
            }
            segA.x = 1;
            segA.y = 1;
            segB.x = 1;
            segB.y = -1;
            if (!compareNumbers(Geometry.distToSegment(p, segA, segB), 1)) {
                success = false;
            }
            segA.x = 1;
            segA.y = 1;
            segB.x = 2;
            segB.y = 2;
            if (!compareNumbers(Geometry.distToSegment(p, segA, segB), Math.sqrt(2))) {
                success = false;
            }
            segA.x = 1;
            segA.y = 1;
            segB.x = 3;
            segB.y = 2;
            if (!compareNumbers(Geometry.distToSegment(p, segA, segB), Math.sqrt(2))) {
                success = false;
            }
            var tmp = segA;
            segA = segB;
            segB = tmp;
            if (!compareNumbers(Geometry.distToSegment(p, segA, segB), Math.sqrt(2))) {
                success = false;
            }
            return logResult(success);
        },

        testGetLinesIntersection: function() {
            console.log("\nTestGetLinesIntersection");
            var success = true,
                l1 = {a: 0, b: 1, c: -1},
                l2 = {a: -1, b: 1, c: 0};
            if (!comparePoints(Geometry.getLinesIntersection(l1, l2), {x: 1, y: 1})) {
                success = false;
            }
            //Совпадающие
            l1 = l2;
            if (Geometry.getLinesIntersection(l1, l2)) {
                success = false;
            }
            //Параллельные
            l1 = {a: -1, b: 1, c: 1};
            if (Geometry.getLinesIntersection(l1, l2)) {
                success = false;
            }
            return logResult(success);
        },

        testIsPointOnSegment: function() {
            console.log("\nTestIsPointOnSegment");
            var success = true,
                p = {x: 0, y: 0},
                segA = {x: 0, y: 1},
                segB = {x: 1, y: 0};
            if (Geometry.isPointOnSegment(p, segA, segB)) {
                success = false;
            }
            segA = {x: -1, y: -1};
            segB = {x: 1, y: 1};
            if (!Geometry.isPointOnSegment(p, segA, segB)) {
                success = false;
            }
            segA = {x: 0, y: 0};
            if (!Geometry.isPointOnSegment(p, segA, segB)) {
                success = false;
            }
            p = {x: 2, y: -1};
            segA = {x: -100, y: -1};
            segB = {x: 2, y: 1};
            if (Geometry.isPointOnSegment(p, segA, segB)) {
                success = false;
            }
            return logResult(success);
        },

        testIsPointInPolygon: function() {
            console.log("\nTestIsPointInPolygon");
            var success = true,
                p = {x: 0, y: 0},
                vertexes = [
                    {x: -2, y: 0},
                    {x: 0, y: 2},
                    {x: 2, y: 0},
                    {x: 0, y: -2}
                ];
            if (!Geometry.isPointInPolygon(p, vertexes)) {
                success = false;
            }
            return logResult(success);
        }
    }
})();
