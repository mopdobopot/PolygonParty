/**
 * @author Lomovtsev Pavel
 * Date: 11.06.2014
 * Time: 18:41
 */
var DebugDrawing = {
    c: null,

    example1: function() {
        Drawing.clearCanvas(undefined, 720, 500);
        var v = [];
        v.push(new Point(50, 50));
        v.push(new Point(360, 200));
        v.push(new Point(670, 50));
        v.push(new Point(670, 450));
        v.push(new Point(50, 450));
        Drawing.drawPolygon(v, this.c, 720, 500, false);
        this.c.beginPath();
        this.c.moveTo(50, 50);
        this.c.lineTo(360, 200);
        this.c.lineTo(670, 50);
        this.c.closePath();
        this.c.fillStyle = "#FFEFD5";
        this.c.strokeStyle = "#FFF5EE";
        this.c.fill();
    },
    example2: function() {
        Drawing.clearCanvas(undefined, 720, 500);
        var v = [];
        var x = 50, y = 50;
        v.push(new Point(x, y));
        for (x = 100; x < 670; x += 62) {
            y += y === 50 ? 50 : -50;
            v.push(new Point(x, y));
        }
        v.push(new Point(670, 50));
        v.push(new Point(670, 250));
        v.push(new Point(370, 350));
        v.push(new Point(400, 450));
        v.push(new Point(50, 450));
        Drawing.drawPolygon(v, this.c, 720, 500, false);
        this.c.beginPath();
        this.c.moveTo(50, 50);
        for (x = 100; x < 670; x += 62) {
            y += y === 50 ? 50 : -50;
            this.c.lineTo(x, y);
        }
        this.c.closePath();
        this.c.fillStyle = "#FFEFD5";
        this.c.strokeStyle = "#FFF5EE";
        this.c.fill();

        this.c.beginPath();
        this.c.moveTo(670, 250);
        this.c.lineTo(370, 350);
        this.c.lineTo(400, 450);
        this.c.closePath();
        this.c.fillStyle = "#FFEFD5";
        this.c.strokeStyle = "#FFF5EE";
        this.c.fill();
    },
    example3: function() {
        Drawing.clearCanvas(undefined, 720, 500);
        var v = [];
        v.push(new Point(50, 50));
        v.push(new Point(300, 350));
        v.push(new Point(550, 350));
        v.push(new Point(550, 50));
        v.push(new Point(670, 50));
        v.push(new Point(670, 450));
        v.push(new Point(180, 450));
        Drawing.drawPolygon(v, this.c, 720, 500, false);

        var A = new Point(380, 180);
        Drawing.drawPoint(A, "#000", 2);
        var B1 = new Point(255, 295);
        var B2 = new Point(380, 350);
        var B3 = new Point(550, 180);
        var s1 = new Segment(A, B1);
        var s2 = new Segment(A, B2);
        var s3 = new Segment(A, B3);
        Drawing.drawSegment(s1, "#aaa");
        Drawing.drawSegment(s2, "#aaa");
        Drawing.drawSegment(s3, "#aaa");

        this.c.font = "bold 20px PTSerif";
        this.c.fillText("A", A.x - 10, A.y - 10);
        this.c.fillText("B1", B1.x - 20, B1.y + 20);
        this.c.fillText("B2", B2.x + 5, B2.y + 20);
        this.c.fillText("B3", B3.x + 10, B3.y + 5);
        this.c.moveTo(A.x, A.y);
        this.c.arc(A.x, A.y, 10, 0, Math.PI * 3 / 4, false);
        this.c.stroke();
    },
    example4: function() {
        Drawing.clearCanvas(undefined, 720, 500);
        var v = [];
        var A = new Point(360, 150);
        var B = new Point(500, 150);
        var C = new Point(500, 350);
        var D = new Point(260, 350);
        var E = new Point(260, 250);
        v.push(A);
        v.push(B);
        v.push(C);
        v.push(D);
        v.push(E);
        Drawing.drawPolygon(v, this.c, 720, 500, false);

        var a1 = new Beam(A, new Vector(0, -1));
        var a2 = new Beam(A, new Vector(-1, -1));
        var b1 = new Beam(B, new Vector(0, -1));
        var b2 = new Beam(B, new Vector(1, 0));
        var c1 = new Beam(C, new Vector(1, 0));
        var c2 = new Beam(C, new Vector(0, 1));
        var d1 = new Beam(D, new Vector(0, 1));
        var d2 = new Beam(D, new Vector(-1, 0));
        var e1 = new Beam(E, new Vector(-1, 0));
        var e2 = new Beam(E, new Vector(-1, -1));
        var color = "#adadad";
        Drawing.drawBeam(a1, color);
        Drawing.drawBeam(a2, color);
        Drawing.drawBeam(b1, color);
        Drawing.drawBeam(b2, color);
        Drawing.drawBeam(c1, color);
        Drawing.drawBeam(c2, color);
        Drawing.drawBeam(d1, color);
        Drawing.drawBeam(d2, color);
        Drawing.drawBeam(e1, color);
        Drawing.drawBeam(e2, color);
    },
    example5: function() {
        Drawing.clearCanvas(undefined, 720, 500);
        var v = [];
        var A = new Point(100, 100);
        var B = new Point(300, 100);
        var C = new Point(200, 200);
        var D = new Point(300, 300);
        var E = new Point(100, 300);
        v.push(A);
        v.push(B);
        v.push(C);
        v.push(D);
        v.push(E);
        Drawing.drawPolygon(v, this.c, 720, 500, false);

        var a1 = new Beam(A, new Vector(0, -1));
        var a2 = new Beam(A, new Vector(-1, 0));
        var b1 = new Beam(B, new Vector(0, -1));
        var b2 = new Beam(B, new Vector(1, 1));
        var d1 = new Beam(D, new Vector(1, -1));
        var d2 = new Beam(D, new Vector(0, 1));
        var e1 = new Beam(E, new Vector(0, 1));
        var e2 = new Beam(E, new Vector(-1, 0));
        var color = "#adadad";
        Drawing.drawBeam(a1, color);
        Drawing.drawBeam(a2, color);
        Drawing.drawBeam(b1, color);
        Drawing.drawBeam(b2, color);
        Drawing.drawBeam(d1, color);
        Drawing.drawBeam(d2, color);
        Drawing.drawBeam(e1, color);
        Drawing.drawBeam(e2, color);

        this.c.font = "bold 20px PTSerif";
        this.c.fillText("A", A.x - 25, A.y + 5);
        this.c.fillText("B", B.x + 10, B.y + 5);
        this.c.fillText("C", C.x + 10, C.y + 5);
        this.c.fillText("D", D.x + 10, D.y + 5);
        this.c.fillText("E", E.x - 25, E.y + 5);

        var O = new Point(400, 200);
        Drawing.drawPoint(O, "#000", 1);
        this.c.fillText("O", O.x - 10, O.y + 25);
    },
    example6: function() {
        Drawing.clearCanvas(undefined, 720, 500);
        var f = new Point(310, 300);
        var p1 = new Point(0, 330);
        var p2 = new Point(400, 330);
        var p3 = new Point(450, 150);
        var l1 = new Line(p1, p2);
        var l2 = new Line(p2, p3);
        Drawing.drawPoint(f, "#bff", 3);
        Drawing.drawLine(l1, "#777");
        Drawing.drawLine(l2, "#777");
        Drawing.drawParabola(new Parabola(f, l1), "#999");
        Drawing.drawParabola(new Parabola(f, l2), "#999");
    },
    example7: function() {
        Drawing.clearCanvas(undefined, 720, 500);
        var f1 = new Point(310, 300);
        var f2 = new Point(410, 180);
        var p1 = new Point(0, 330);
        var p2 = new Point(400, 330);
        var l = new Line(p1, p2);
        Drawing.drawPoint(f1, "#bff", 1);
        Drawing.drawPoint(f2, "#bff", 1);
        Drawing.drawLine(l, "#777");
        Drawing.drawParabola(new Parabola(f1, l), "#999");
        Drawing.drawParabola(new Parabola(f2, l), "#999");
    }
};