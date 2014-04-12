/**
 * @author Lomovtsev Pavel
 * Date: 11.04.2014
 * Time: 22:09
 */
var TestPoint = {

    /* Шаблон теста (Ctrl+C Ctrl+V)
        test: function() {
            var testName = "test()";
            try {
                if (2 != 2)
                    throw new Error("Сообщение об ошибке");
                this.logSuccess(testName);
            } catch (whatsWrong) {
                this.logFailure(testName, whatsWrong);
            }
        }
     */

    equalsToPoint: function() {
        var testName = "equalsToPoint()",
            p1, p2;
        try {
            p1 = new Point(3, 17);
            p2 = new Point(2, -7.6);
            if (p1.equalsToPoint(p2))
                throw new Error("разные точки совпадают");

            p2 = new Point(3, 17);
            if (!p1.equalsToPoint(p2))
                throw new Error("одинаковые точки не совпадают");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    distToPoint: function() {
        var testName = "distToPoint()",
            p1, p2;
        try {
            p1 = new Point(0, 0);
            p2 = new Point(0, 0);
            if (p1.distToPoint(p2) - 0 >= eps)
                throw new Error("расстояние между одинаковыми точками — ненулевое");

            p2 = new Point(-1, -1);
            if (!this.assertEquals(p1.distToPoint(p2), Math.sqrt(2)))
                throw new Error("расстояние дробное");

            p1 = new Point(-1, 0);
            p2 = new Point(-1, 777);
            if (!this.assertEquals(p1.distToPoint(p2), 777))
                throw new Error("расстояние целое");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    distToLine: function() {
        var testName = "distToLine()",
            p, line, anotherLine;
        try {
            p = new Point(0, 0);
            line = new Line(p, new Point(1, 4));
            if (!this.assertEquals(p.distToLine(line), 0))
                throw new Error("точка лежит на прямой");

            line = new Line(new Point(1, 1), new Point(1, -1));
            if (!this.assertEquals(p.distToLine(line), 1))
                throw new Error("расстояние целое");

            line = new Line(new Point(2, 0), new Point(1, -1));
            if (!this.assertEquals(p.distToLine(line), Math.sqrt(2)))
                throw new Error("расстояние дробное, 1 тест");

            anotherLine = new Line(new Point(1, -1), new Point(2, 0));
            if (!this.assertEquals(p.distToLine(line), p.distToLine(anotherLine)))
                throw new Error("расстояние дробное, 2 тест (прямая задана точками в обратном порядке)");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    distToSegment: function() {
        var testName = "distToSegment()",
            p1, p2, p3, seg;
        try {
            p1 = new Point(1, 1);
            p2 = new Point(3, 2);
            seg = new Segment(p1, p2);
            p3 = new Point(2, 1.5);
            if (!this.assertEquals(p3.distToSegment(seg), 0))
                throw new Error("точка лежит на отрезке");

            p3 = p1;
            if (!this.assertEquals(p3.distToSegment(seg), 0))
                throw new Error("точка совпадает с одним из концов отрезка");

            p3 = new Point(-1, 0);
            if (!this.assertEquals(p3.distToSegment(seg), Math.sqrt(5)))
                throw new Error("точка лежит на прямой, содержащей отрезок");

            p3 = new Point(-1, -1);
            if (!this.assertEquals(p3.distToSegment(seg), 2 * Math.sqrt(2)))
                throw new Error("точка лежит \"сбоку\" от отрезка");

            p3 = new Point(2, 4);
            if (!this.assertEquals(p3.distToSegment(seg), Math.sqrt(5)))
                throw new Error("точка лежит в \"полосе\" отрезка, расстояние проходит через конец отрезка");

            p1 = new Point(-1, -1);
            p2 = new Point(1, 1);
            seg = new Segment(p1, p2);
            p3 = new Point(-1, -1);
            if (!this.assertEquals(p3.distToSegment(seg), Math.sqrt(2)))
                throw new Error("точка лежит в \"полосе\" отрезка");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    all: function() {
        console.log("\nTestPoint...");
        for (t in TestPoint) {
            if (TestPoint.hasOwnProperty(t) && t != "all") {
                TestPoint[t]();
            }
        }
    }
};

TestPoint.__proto__ = BaseTest;
