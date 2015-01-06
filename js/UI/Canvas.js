/**
 * Created by mopdobopot on 04.01.2015.
 */

function Canvas() {

    var tryToFindVertex = function(v, vertexes) {
        var w;
        for (var i = 0; i < vertexes.length; i++) {
            w = vertexes[i];
            if (Math.abs(w.x - v.x) <= Config.vertexRadius &&
                Math.abs(w.y - v.y) <= Config.vertexRadius) {
                return i;
            }
        }
        return false;
    };
    var clone = function(obj) {
        return $.extend(true, {}, obj); //Глубокое клонирование
    };

    return {

        $container: undefined,
        $elem: undefined,
        canvasId: undefined,
        coordinateSystemCanvasId: undefined,
        width: undefined,
        height: undefined,
        HTMLElem: undefined,
        context: undefined,
        clickedVertex: undefined,

        init: function($container, canvasId, coordinateSystemCanvasId, width, height) {
            this.$container = $container;
            this.$container.append(
                "<canvas id=" + canvasId + " width=" + width + " height=" + height + "></canvas>" +
                "<canvas id=" + coordinateSystemCanvasId + ">Ваш браузер не поддерживает canvas</canvas>"
            );
            this.$elem = $('#' + canvasId);
            var _this = this;
            this.$elem.mousedown(function(e) {
                if (CurState.polygon === undefined) return;
                _this.$elem.css('cursor', 'default');
                var i = tryToFindVertex({x: e.offsetX, y: e.offsetY}, CurState.vertexes);
                if (i || i === 0) {
                    CurState.vertexes[i].isClicked = true;
                    CurState.clickedVertex = clone(CurState.vertexes[i]);
                    CurState.clickedVertex.index = i;
                    _this.redraw();
                }
            });
            this.$elem.mouseup(function() {
                if (CurState.polygon === undefined) return;
                for (var i = 0; i < CurState.vertexes.length; i++) {
                    CurState.vertexes[i].isClicked = undefined;
                }
                CurState.clickedVertex = undefined;
                _this.redraw();
            });
            this.$elem.mousemove(function(e) {
                if (CurState.polygon === undefined) return;
                if (CurState.clickedVertex) {
                    CurState.clickedVertex.x = e.offsetX;
                    CurState.clickedVertex.y = e.offsetY;
                    CurState.vertexes[CurState.clickedVertex.index] = clone(CurState.clickedVertex);
                    _this.redraw();
                }
                else {
                    var i = tryToFindVertex({x: e.offsetX, y: e.offsetY}, CurState.vertexes);
                    (i || i === 0) ? _this.$elem.css('cursor', 'pointer') : _this.$elem.css('cursor', 'default');
                }
            });
            this.canvasId = canvasId;
            this.coordinateSystemCanvasId = coordinateSystemCanvasId;
            this.width = width;
            this.height = height;
            this.HTMLElem = document.getElementById(this.canvasId);
            this.context = this.HTMLElem.getContext("2d");
            Drawing.c = this.context;
            DebugDrawing.c = this.context;

            //Рисуем координатную сетку
            var csCanvas = document.getElementById(this.coordinateSystemCanvasId);
            csCanvas.width = width;
            csCanvas.height = height;
            Drawing.drawCoordinateSystem(csCanvas.getContext("2d"), width, height);

            return this;
        },

        redraw: function() {
            Drawing.drawPolygon(
                CurState.vertexes,
                Drawing.c,
                this.width, this.height,
                CurState.checkbox_showVertexNumbers.isChecked()
            );
            CurState.polygon.vertexes = CurState.vertexes;
            CurState.polygon.type = "Не определён";
            CurState.infoTable.update(CurState.polygon);
        }
    }
}