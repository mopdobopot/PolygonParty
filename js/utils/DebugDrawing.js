/**
 * @author Lomovtsev Pavel
 * Date: 11.06.2014
 * Time: 18:41
 */
var DebugDrawing = {
    c: null,

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
    },
    example3: function() {
        var v = [];
        var x = 50, y = 50;
        v.push(new Point(x, y));
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
    }
};