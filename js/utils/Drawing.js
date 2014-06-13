/**
 * @Author Lomovtsev Pavel
 * Date: 04.10.13
 * Time: 23:43
 */
var Drawing = (function() {

    var drawGrid = function(context, w, h, color) {
            context.beginPath();
            for (var x = 20.5; x < w; x += 20) {
                context.moveTo(x, 0);
                context.lineTo(x, h);
            }
            for (var y = 0.5; y < h; y += 20) {
                context.moveTo(0, y);
                context.lineTo(w, y);
            }
            context.strokeStyle = color;
            context.stroke();
        },
        drawAxis = function(context, w, h, color) {
            var drawHorizontalAxis = function(c) {
                    c.moveTo(10, 10);
                    c.lineTo(w - 10 , 10);
                    c.lineTo(w - 15, 5);
                    c.moveTo(w - 10, 10);
                    c.lineTo(w - 15, 15);
                },
                drawVerticalAxis = function(c) {
                    c.moveTo(10, 10);
                    c.lineTo(10, h - 10);
                    c.lineTo(5, h - 15);
                    c.moveTo(10, h - 10);
                    c.lineTo(15, h - 15);
                };
            context.beginPath();
            drawHorizontalAxis(context);
            drawVerticalAxis(context);
            context.strokeStyle = color;
            context.stroke();
        },
        drawLine = function(context, color, start, finish) {
            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(finish.x, finish.y);
            context.stroke();
            drawPoint(context, color, finish);
        },
        drawPoint = function(context, color, point, r) {
            context.strokeStyle = color;
            context.beginPath();
            if (!r) {
                r = point.isClicked ? Config.clickedVertexRadius : Config.vertexRadius;
            }
            context.arc(point.x, point.y, r, 0, 2 * Math.PI, false);
            context.closePath();
            context.fill();
        },
        drawPointNumber = function(context, p, n) {
            context.font = "bold 10px sans-serif";
            context.fillText(n, p.x + 5, p.y + 5);
        },
        drawAnimateLine = function(context, color, start, finish) {
            context.strokeStyle = color;
            var lineLength = start.distToPoint(finish),
                offsetVector = {
                x: (finish.x - start.x) / lineLength,
                y: (finish.y - start.y) / lineLength
                },
                interval = setInterval(function() {
                    context.beginPath();
                    context.moveTo(start.x, start.y);
                    start = start.getSum(offsetVector);
                    context.lineTo(start.x, start.y);
                    context.stroke();
                    drawPoint(context, color, finish);
                    var distToFinish = start.distToPoint(finish);
                    if (distToFinish < 1) clearInterval(interval);
                }, 100 / Config.animatedDrawingSpeed);
        };

    return {

        c: null, //Контекст

        drawCoordinateSystem: function(context, width, height) {
            drawGrid(context, width, height, Config.gridColor);
            drawAxis(context, width, height, Config.axisColor);
        },

        clearCanvas: function(context, width, height) {
            context.clearRect(0, 0, width, height);
            $('#infoTable').html("");
        },

        drawPolygon: function(vertexes, context, width, height, isVertexNumberNeeded) {
            this.clearCanvas(context, width, height);
            var l = vertexes.length,
                color = Config.polygonColor;
            for (var i = 0; i < l - 1; i++) {
                Config.animatedDrawing ? drawAnimateLine(context, color, vertexes[i], vertexes[i + 1])
                                       : drawLine(context, color, vertexes[i], vertexes[i + 1]);
                if (isVertexNumberNeeded) {
                    drawPointNumber(context, vertexes[i], i);
                }
            }
            Config.animatedDrawing ? drawAnimateLine(context, color, vertexes[l - 1], vertexes[0])
                                   : drawLine(context, color, vertexes[l - 1], vertexes[0]);
            if (isVertexNumberNeeded) {
                drawPointNumber(context, vertexes[l - 1], l - 1);
            }
        },

        drawLine: function(context, line, color) {
            context.strokeStyle = color;
            context.beginPath();
            var v = line.getDirectingVector().getMulOnScalar(1000);
            var p1 = line.getPointOn().getShiftedByVector(v);
            var p2 = line.getPointOn().getShiftedByVector(v.getMulOnScalar(-1));
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.stroke();
        },

        drawBeam: function(context, beam) {
            context.strokeStyle = "#a33";
            context.beginPath();
            var v = beam.getDirectingVector().getMulOnScalar(1000);
            var p1 = beam.point;
            var p2 = beam.point.getShiftedByVector(v);
            context.moveTo(p1.x, p1.y);
            drawPoint(context, "#a33", p1, Config.vertexRadius);
            context.lineTo(p2.x, p2.y);
            context.stroke();
        },

        drawSegment: function(context, segment, color) {
            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(segment.a.x, segment.a.y);
            context.lineTo(segment.b.x, segment.b.y);
            context.stroke();
        },

        drawPoint: function(context, point, color, r) {
            drawPoint(context, color, point, r);
        },

        drawParabola: function(context, parabola, color) {
            context.strokeStyle = color;
            var shift = new Vector(parabola.vertex, parabola.focus).getMulOnScalar(100);
            var x0 = parabola.vertex.getShiftedByVector(shift).x;
            //Найдётся хотя бы 1 решение, берём первое
            var y0 = parabola.getYByX(x0).root1;
            var p1 = new Point(x0, y0);
            var l = new Line(p1, p1.getShiftedByVector(parabola.directrix.getDirectingVector()));
            var intersec = G.getIntersection(parabola, l);
            if (intersec.p[0].equalsToPoint(p1)) {
                var p2 = intersec.p[1];
            }
            else {
                p2 = intersec.p[0];
            }
            var tangent = parabola.getTangentInPoint(p1);
            var controlPoint = G.getIntersection(tangent, parabola.axis);
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.quadraticCurveTo(controlPoint.x, controlPoint.y, p2.x, p2.y);
            context.stroke();
        }
    }
})();