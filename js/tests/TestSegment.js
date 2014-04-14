/**
 * @author Lomovtsev Pavel
 * Date: 12.04.2014
 * Time: 20:24
 */
var TestSegment = {

    getIntersectionWithBeam: function() {
        var testName = "getIntersectionWithBeam()",
            p1, p2, p3, v, b, seg, res;
        try {
            p1 = new Point(0, 0);
            p2 = new Point(-1, 1);
            p3 = new Point(-1, -10);
            v = new Vector(1, 1);
            b = new Beam(p1, v);
            seg = new Segment(p2, p3);
            res = seg.getIntersectionWithBeam(b);
            if (res != null)
                throw new Error("отрезок не пересекает луч, но пересечение найдено");

            p1 = new Point(0, 0);
            p2 = new Point(-1, 1);
            p3 = new Point(-1, -10);
            v = new Vector(-1, -1);
            b = new Beam(p1, v);
            seg = new Segment(p2, p3);
            res = seg.getIntersectionWithBeam(b);
            if (!Type.isPoint(res))
                throw new Error("отрезок и луч пересекаются в точке, но найдено другое пересечение");
            if (!res.equalsToPoint(new Point(-1, -1)))
                throw new Error("пересечение в точке найдено неверно");

            p1 = new Point(0, 0);
            p2 = new Point(-1, -1);
            p3 = new Point(-125, -125);
            v = new Vector(1, 1);
            b = new Beam(p1, v);
            seg = new Segment(p2, p3);
            res = seg.getIntersectionWithBeam(b);
            if (res != null)
                throw new Error("отрезок не пересекает луч (хотя они лежат на одной прямой), но пересечение найдено");

            p1 = new Point(0, 0);
            p2 = new Point(-1, -1);
            p3 = new Point(1, 1);
            v = new Vector(1, 1);
            b = new Beam(p1, v);
            seg = new Segment(p2, p3);
            res = seg.getIntersectionWithBeam(b);
            if (!Type.isSegment(res))
                throw new Error("отрезок и луч пересекаются по отрезку, но найдено другое пересечение");
            if ((!res.a.equalsToPoint(p1) || !res.b.equalsToPoint(p3)) &&
                (!res.b.equalsToPoint(p1) || !res.a.equalsToPoint(p3)))
                throw new Error("пересечение по отрезку найдено неверно");

            p1 = new Point(0, 0);
            p2 = new Point(1, 1);
            p3 = new Point(2, 2);
            v = new Vector(1, 1);
            b = new Beam(p1, v);
            seg = new Segment(p2, p3);
            res = seg.getIntersectionWithBeam(b);
            if (!Type.isSegment(res))
                throw new Error("луч содержит отрезок, но найдено другое пересечение");
            if ((!res.a.equalsToPoint(p2) || !res.b.equalsToPoint(p3)) &&
                (!res.b.equalsToPoint(p2) || !res.a.equalsToPoint(p3)))
                throw new Error("луч содержит отрезок, но пересечение найдено неверно");

            p1 = new Point(0, 0);
            p2 = new Point(1, 1);
            p3 = new Point(2, -5);
            v = new Vector(1, 1);
            b = new Beam(p1, v);
            seg = new Segment(p2, p3);
            res = seg.getIntersectionWithBeam(b);
            if (!Type.isPoint(res))
                throw new Error("вершина отрезка лежит на луче, но найдено другое пересечение");
            if (!res.equalsToPoint(p2))
                throw new Error("вершина отрезка лежит на луче, но пересечение найдено неверно");
            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    },
    all: function() {
        console.log("\nTestSegment...");
        for (t in TestSegment) {
            if (TestSegment.hasOwnProperty(t) && t != "all") {
                TestSegment[t]();
            }
        }
    }
};

TestSegment.__proto__ = BaseTest;