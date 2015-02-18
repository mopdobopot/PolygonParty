/**
 * @Author Lomovtsev Pavel
 * Date: 11.10.13
 * Time: 22:49
 */
var StarPolygon = (function() {

    var swap = function(array, i, j) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        },
        sortFunc = function(a, b) {
            if (a.alpha === b.alpha)
                return 0;
            if (a.alpha < b.alpha)
                return -1;
            else
                return 1;
        },
        findAverage = function(array) {
            var size = array.length,
                sumX = 0,
                sumY = 0;
            for (var i = 0; i < size; i++) {
                sumX += array[i].x;
                sumY += array[i].y;
            }
            return new Point(sumX / size, sumY / size);
        },
        tryStretch = function(i, j, k, phi, vertexes) {
            var p1 = vertexes[i],
                p2 = vertexes[j],
                p3 = vertexes[k],
                l = vertexes.length,
                v1 = new Vector(p2, p1),
                v2 = new Vector(p2, p3),
                alpha = v1.getAlpha(v2);
            if (alpha < phi - Config.stretchingEps) {
                if (Config.debugConsole) {
                    console.log("вершина " + j);
                    console.log("старый угол: " + alpha);
                }
                vertexes[j] = stretchVertex(p1, p2, p3, phi);
                if (j === 0) {
                    tryStretch(l - 2, l - 1, 0, phi, vertexes);
                }
                else if (j === 1) {
                    tryStretch(l - 1, 0, 1, phi, vertexes);
                }
                else {
                    tryStretch(j - 2, j - 1, j, phi, vertexes);
                }
                if (j === l - 2) {
                    tryStretch(l - 2, l - 1, 0, phi, vertexes);
                }
                else if (j === l - 1) {
                    tryStretch(l - 1, 0, 1, phi, vertexes);
                }
                else {
                    tryStretch(j, j + 1, j + 2, phi, vertexes);
                }
            }
        },
        stretchVertex = function(p1, p2, p3, phi) {
            var p1p3 = new Vector(p1, p3),
                p1p3_center = p1.getShiftedByVector(p1p3.getMulOnScalar(0.5)),
                guide = new Vector(p2, p1p3_center),
                v1 = new Vector(p2, p1),
                v2 = new Vector(p2, p3),
                alpha = v1.getAlpha(v2);
            while (alpha < phi - Config.stretchingEps) {
                p2 = p2.getShiftedByVector(guide.getMulOnScalar(0.5));
                guide = new Vector(p2, p1p3_center);
                v1 = new Vector(p2, p1);
                v2 = new Vector(p2, p3);
                alpha = v1.getAlpha(v2);
            }
            if (Config.debugConsole) console.log("новый угол: " + alpha + "\n");
            return p2;
        };

    return {

        genRand: function(n, size) {
            this.dropVertexes();
            for (var i = 0; i < n; i++) {
                this.addVertex(G.getRandPoint(0, size));
            }
            var e = new Vector(1, 0),
                starCenter = findAverage(this.vertexes),
                curV = {};
            for (i = 0; i < n; i++) {
                //Не понимаю, что здесь происходит
                curV = this.vertexes[i].getShiftedByVector(starCenter.getMulOnScalar(-1));
                this.vertexes[i].alpha = e.getAlpha(new Vector(new Point(0, 0), curV));
            }
            this.vertexes.sort(sortFunc);
            this.type = "Случайный";
            return this.vertexes;
        },

        genRandWithNonEmptyCore: function(n, size) {
            this.dropVertexes();
            for (var i = 0; i < n; i++) {
                this.addVertex(G.getRandPoint(0, size));
                if (this.vertexes[i].y === this.maxY) {
                    swap(this.vertexes, i, 0);
                }
            }
            var e = new Vector(1, 0),
                curV = {};
            for (i = 1; i < n; i++) {
                curV = this.vertexes[i].getShiftedByVector(this.vertexes[0].getMulOnScalar(-1));
                this.vertexes[i].alpha = e.getAlpha(new Vector(new Point(0, 0), curV));
            }
            this.vertexes[0].alpha = -7;
            this.vertexes.sort(sortFunc);
            this.type = "С непустым ядром";
            return this.vertexes;
        },

        stretch: function(phi) {
            var n = this.vertexes.length;
            for (var i = 0; i < n - 2; i++) {
                tryStretch(i, i + 1, i + 2, phi, this.vertexes);
            }
            tryStretch(n - 2, n - 1, 0, phi, this.vertexes);
            tryStretch(n - 1, 0, 1, phi, this.vertexes);
        },

        drawRand: function(context, width, height, n, size, isVertexNumberNeeded) {
            this.genRand(n, size);
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        },

        drawRandStretched: function(context, width, height, n, size, phi, isVertexNumberNeeded) {
            this.genRand(n, size);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
            this.stretch(phi);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        },

        drawRandWithNonEmptyCore: function(context, width, height, n, size, isVertexNumberNeeded) {
            this.genRandWithNonEmptyCore(n, size);
            this.center(width, height);
            Drawing.drawPolygon(this.vertexes, context, width, height, isVertexNumberNeeded);
        }
    }
})();

StarPolygon.__proto__ = BasePolygon;
