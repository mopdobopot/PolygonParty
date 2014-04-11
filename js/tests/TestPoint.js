/**
 * @author Lomovtsev Pavel
 * Date: 11.04.2014
 * Time: 22:09
 */
var TestPoint = (function() {

    /* Шаблон теста (Ctrl+C Ctrl+V)
        test: function() {
            var testName = "test()";
            try {

                if (2 != 2)
                    throw new Error("Сообщение об ошибке");

                logSuccess(testName);
            } catch (whatsWrong) {
                logFailure(testName + ", " + whatsWrong);
            }
        }
     */

    var eps = 0.0000001,
        logFailure = function(msg) {
            console.error("FAILURE:\t" + msg);
        },
        logSuccess = function(msg) {
            console.log("SUCCESS:\t" + msg);
        };

    return {
        equalsToPoint: function() {
            var testName = "Point.equalsToPoint()",
                p1, p2;
            try {

                p1 = new Point(3, 17);
                p2 = new Point(2, -7.6);
                if (p1.equalsToPoint(p2))
                    throw new Error("разные точки совпадают");

                p2 = new Point(3, 17);
                if (!p1.equalsToPoint(p2))
                    throw new Error("одинаковые точки не совпадают");

                logSuccess(testName);
            } catch (whatsWrong) {
                logFailure(testName + ", " + whatsWrong);
            }
        },
        distToPoint: function() {
            var testName = "Point.distToPoint()",
                p1, p2;
            try {
                p1 = new Point(0, 0);
                p2 = new Point(0, 0);
                if (p1.distToPoint(p2) - 0 >= eps)
                    throw new Error("расстояние между одинаковыми точками — ненулевое");

                p2 = new Point(-1, -1);
                if (p1.distToPoint(p2) - Math.sqrt(2) >= eps)
                    throw new Error("расстояние дробное");

                p1 = new Point(-1, 0);
                p2 = new Point(-1, 777);
                if (p1.distToPoint(p2) - 777 >= eps)
                    throw new Error("расстояние целое");

                logSuccess(testName);
            } catch (whatsWrong) {
                logFailure(testName + ", " + whatsWrong);
            }
        },
        distToLine: function() {
            var testName = "Point.distToLine()",
                p, line, anotherLine;
            try {

                p = new Point(0, 0);
                line = new Line(p, new Point(1, 4));
                if (p.distToLine(line) >= eps)
                    throw new Error("точка лежит на прямой");

                line = new Line(new Point(1, 1), new Point(1, -1));
                if (p.distToLine(line) - 1 >= eps)
                    throw new Error("расстояние целое");

                line = new Line(new Point(2, 0), new Point(1, -1));
                if (p.distToLine(line) - Math.sqrt(2) >= eps)
                    throw new Error("расстояние дробное, 1 тест");

                anotherLine = new Line(new Point(1, -1), new Point(2, 0));
                if (p.distToLine(line) - p.distToLine(anotherLine) >= eps)
                    throw new Error("расстояние дробное, 2 тест (прямая задана точками в обратном порядке)");

                logSuccess(testName);
            } catch (whatsWrong) {
                logFailure(testName + ", " + whatsWrong);
            }
        },
        distToSegment: function() {
            var testName = "Point.distToSegment()",
                p1, p2, p3, seg;
            try {

                p1 = new Point(1, 1);
                p2 = new Point(3, 2);
                seg = new Segment(p1, p2);
                p3 = new Point(2, 1.5);
                if (p3.distToSegment(seg) >= eps)
                    throw new Error("точка лежит на отрезке");

                p3 = p1;
                if (p3.distToSegment(seg) >= eps)
                    throw new Error("точка совпадает с одним из концов отрезка");

                p3 = new Point(-1, 0);
                if (p3.distToSegment(seg) - Math.sqrt(5) >= eps)
                    throw new Error("точка лежит на прямой, содержащей отрезок");

                p3 = new Point(-1, -1);
                if (p3.distToSegment(seg) - 2 * Math.sqrt(2)  >= eps)
                    throw new Error("точка лежит \"сбоку\" от отрезка");

                p3 = new Point(2, 4);
                if (p3.distToSegment(seg) - Math.sqrt(5) >= eps)
                    throw new Error("точка лежит в \"полосе\" отрезка, расстояние проходит через конец отрезка");

                p1 = new Point(-1, -1);
                p2 = new Point(1, 1);
                seg = new Segment(p1, p2);
                p3 = new Point(-1, -1);
                if (p3.distToSegment(seg) - Math.sqrt(2) >= eps)
                    throw new Error("точка лежит в \"полосе\" отрезка");

                logSuccess(testName);
            } catch (whatsWrong) {
                logFailure(testName + ", " + whatsWrong);
            }
        },
        all: function() {
            for (t in TestPoint) {
                if (TestPoint.hasOwnProperty(t) && t != "all") {
                    TestPoint[t]();
                }
            }
        }
    }
})();