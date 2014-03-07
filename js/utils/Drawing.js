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
    };

    var drawAxis = function(context, w, h, color) {
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
    };

    var drawLine = function(context, color, start, finish) {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(finish.x, finish.y);
        context.stroke();
        drawPoint(context, color, finish);
    };

    var drawPoint = function(context, color, point, r) {
        context.strokeStyle = color;
        context.beginPath();
        if (!r) {
            r = point.isClicked ? Config.clickedVertexRadius : Config.vertexRadius;
        }
        context.arc(point.x, point.y, r, 0, 2 * Math.PI, false);
        context.closePath();
        context.fill();
    };

    var drawPointNumber = function(context, p, n) {
        context.font = "bold 10px sans-serif";
        context.fillText(n, p.x + 5, p.y + 5);
    };

    var drawAnimateLine = function(context, color, start, finish) {
        var lineLength = Geometry.dist(start, finish);
        var offsetVector = {
            x: (finish.x - start.x) / lineLength,
            y: (finish.y - start.y) / lineLength
        };
        context.strokeStyle = color;

        var interval = setInterval(function() {
            context.beginPath();
            context.moveTo(start.x, start.y);
            start = Geometry.vectorSum(start, offsetVector);
            context.lineTo(start.x, start.y);
            context.stroke();
            drawPoint(context, color, finish);

            var distToFinish = Geometry.dist(start, finish);
            if (distToFinish < 1) clearInterval(interval);
        }, 100 / Config.animatedDrawingSpeed);
    };

    return {

        drawCoordinateSystem: function(context, width, height) {
            drawGrid(context, width, height, Config.gridColor);
            drawAxis(context, width, height, Config.axisColor);
        },

        clearCanvas: function(context, width, height) {
            context.clearRect(0, 0, width, height);
            $('#infoTable').html("");
            //this.drawCoordinateSystem(context, width, height);
        },

        drawPolygon: function(vertexes, context, width, height, isVertexNumberNeeded) {
            this.clearCanvas(context, width, height);
            //this.drawCoordinateSystem(context, width, height);
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
        }
    }
})();