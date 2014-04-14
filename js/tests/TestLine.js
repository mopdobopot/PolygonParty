/**
 * @author Lomovtsev Pavel
 * Date: 14.04.2014
 * Time: 21:20
 */
var TestLine = {
    getIntersectionWithLine: function() {
        var testName = "getIntersectionWithLine()",
            l1, l2, p1, p2, p3, p4, res;
        try {
            p1 = new Point(0, 0);
            p2 = G.getRandPoint(0, 100);
            p3 = G.getRandPoint(0, 100);
            l1 = new Line(p1, p2);
            l2 = new Line(p1, p3);
            res = l1.getIntersectionWithLine(l2);
            if (res === Infinity)
                throw new Error("несовпадающие прямые совпадают");
            if (res === null)
                throw new Error("пересекающиеся прямые параллельны");
            if (!p1.equalsToPoint(l1.getIntersectionWithLine(l2)))
                throw new Error("неверно вычислена точка пересечения");

            p2 = new Point(1, 0);
            p3 = new Point(3, 1);
            p4 = new Point(178, 1);
            l1 = new Line(p1, p2);
            l2 = new Line(p3, p4);
            res = l1.getIntersectionWithLine(l2);
            if (res === Infinity)
                throw new Error("несовпадающие прямые совпадают");
            if (res != null)
                throw new Error("параллельные прямые пересекаются");

            p2 = new Point(2, 1);
            p3 = new Point(-2, -1);
            p4 = new Point(-4, -2);
            l1 = new Line(p1, p2);
            l2 = new Line(p3, p4);
            res = l1.getIntersectionWithLine(l2);
            if (res != Infinity)
                throw new Error("совпадающие прямые не совпадают");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    getIntersectionWithBeam: function() {
        var testName = "getIntersectionWithBeam()",
            l, b, p1, p2, p3, v, res;
        try {
            p1 = new Point(0, 0);
            p2 = new Point(1, 1);
            p3 = new Point(1, 0);
            v = new Vector(100500, 0);
            l = new Line(p1, p2);
            b = new Beam(p3, v);
            res = l.getIntersectionWithBeam(b);
            if (res != null)
                throw new Error("луч не пересекает прямую, но пересечение найдено");

            v = v.getMulOnScalar(-1);
            b = new Beam(p3, v);
            res = l.getIntersectionWithBeam(b);
            if (Type.isBeam(res))
                throw new Error("луч пересекает прямую в точке, но найдено пересечение по лучу");
            if (!res.equalsToPoint(p1))
                throw new Error("точка пересечения вычислена неверно");

            v = new Vector(1, 1);
            b = new Beam(p3, v);
            res = l.getIntersectionWithBeam(b);
            if (res != null)
                throw new Error("луч и прямая не пересекаются, но пересечение найдено");

            p3 = new Point(-10, -10);
            b = new Beam(p3, v);
            res = l.getIntersectionWithBeam(b);
            if (!Type.isBeam(res))
                throw new Error("луч и прямая пересекаются по лучу, но найдено другое пересечение");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    getIntersectionWithSegment: function() {
        var testName = "getIntersectionWithSegment()",
            p1, p2, p3, p4, l, seg, res;
        try {
            p1 = new Point(0, 0);
            p2 = new Point(2, 1);
            p3 = new Point(2, 1);
            p4 = new Point(1, -10);
            l = new Line(p1, p2);
            seg = new Segment(p3, p4);
            res = l.getIntersectionWithSegment(seg);
            if (!Type.isPoint(res))
                throw new Error("пересечение совпадает с концом отрезка, но найдено другое пересечение");
            if (!res.equalsToPoint(p2))
                throw new Error("точка пересечения вычислена неверно");

            p3 = new Point(1, -1);
            p4 = new Point(-1, 1);
            seg = new Segment(p3, p4);
            res = l.getIntersectionWithSegment(seg);
            if (!Type.isPoint(res))
                throw new Error("пересечение — точка на отрезке, но найдено другое пересечение");
            if (!res.equalsToPoint(p1))
                throw new Error("точка пересечения вычислена неверно");

            p3 = new Point(4, 2);
            p4 = new Point(-2, -1);
            seg = new Segment(p3, p4);
            res = l.getIntersectionWithSegment(seg);
            if (!Type.isSegment(res))
                throw new Error("отрезок и прямая пересекаются по отрезку, но найдено другое пересечение");
            if ((!res.a.equalsToPoint(p3) || !res.b.equalsToPoint(p4)) &&
                (!res.b.equalsToPoint(p3) || !res.a.equalsToPoint(p4)))
                throw new Error("отрезок пересечения вычислен неверно");

            p3 = new Point(1, 0);
            p4 = new Point(3, 1);
            seg = new Segment(p3, p4);
            res = l.getIntersectionWithSegment(seg);
            if (res != null)
                throw new Error("отрезок и прямая не пересекаются, но пересечение найдено");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    all: function() {
        console.log("\nTestLine...");
        for (t in TestLine) {
            if (TestLine.hasOwnProperty(t) && t != "all") {
                TestLine[t]();
            }
        }
    }
};
TestLine.__proto__ = BaseTest;