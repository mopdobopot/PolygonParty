/**
 * @author Lomovtsev Pavel
 * Date: 11.06.2014
 * Time: 18:41
 */
var DebugDrawing = {
    c: null,

    drawLine: function(line, color) {
        if (Config.debugDrawing) {
            Drawing.drawLine(this.c, line, color);
        }
    },
    drawBeam: function(beam) {
        if (Config.debugDrawing) {
            Drawing.drawBeam(this.c, beam);
        }
    },
    drawPoint: function(point, color, r) {
        if (Config.debugDrawing) {
            Drawing.drawPoint(this.c, point, color, r);
        }
    },
    drawSegment: function(segment, color) {
        if (Config.debugDrawing) {
            Drawing.drawSegment(this.c, segment, color);
        }
    },
    draw: function(shape, color) {
        if (Config.debugDrawing) {
            if (Type.isLine(shape)) {
                this.drawLine(shape, color);
            }
            else if (Type.isBeam(shape)) {
                this.drawBeam(shape);
            }
            else if (Type.isParabola(shape)) {
                Drawing.drawParabola(this.c, shape);
            }
        }
    },
    example1: function() {
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
    }
};