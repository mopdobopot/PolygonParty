/**
 * @author Lomovtsev Pavel
 * Date: 09.06.2014
 * Time: 11:19
 */
//Задаётся параболой, точкой и направлением параллельным директрисе
function ParabolicBeam(parabola, point, vector) {
    this.parabola = parabola;
    this.point = point;
    this.vector = vector;
    this.normalLine = new Line(point, point.getShiftedByVector(parabola.directrixNormalVector));

    this.getPointOn = function() {
        return this.point;
    };
    this.isPointOn = function(point) {
        return this.parabola.isPointOn(point) &&
               this.normalLine.arePointsOnSameSide(this.point.getShiftedByVector(this.vector), point);
    };
    this.getIntersectionWithParabolicBeam = function(pBeam) {
        var intersec = G.getIntersection(this.parabola, pBeam.parabola);
        if (intersec === Infinity) {
            if (this.isPointOn(pBeam.point)) {
                if (pBeam.isPointOn(this.point)) {
                    return new ParabolicSegment(this.parabola, this.point, this.vector, pBeam.point, pBeam.vector);
                }
                else {
                    return pBeam;
                }
            }
            else if (pBeam.isPointOn(this.point)) {
                return this;
            }
            else {
                return null;
            }
        }
        else {
            var p = [], curP;
            for (var i = 0; i < intersec.pointAmount; i++) {
                curP = intersec.p[i];
                if (this.isPointOn(curP) && pBeam.isPointOn(curP)) {
                    p.push(curP);
                }
            }
            return {
                pointAmount: p.length,
                p: p
            }
        }
    };
    this.getIntersectionWithParabolicSegment = function(pSeg) {
        var intersec = G.getIntersection(this.parabola, pSeg.parabola);
        if (intersec === Infinity) {
            if (this.isPointOn(pSeg.a)) {
                if (this.isPointOn(pSeg.b)) {
                    return pSeg;
                }
                else {
                    return new ParabolicSegment(this.parabola, pSeg.a, pSeg.vectorA, this.point, this.vector);
                }
            }
            else if (this.isPointOn(pSeg.b)) {
                return new ParabolicSegment(this.parabola, pSeg.b, pSeg.vectorB, this.point, this.vector);
            }
            else {
                return null;
            }
        }
        else {
            var p = [], curP;
            for (var i = 0; i < intersec.pointAmount; i++) {
                curP = intersec.p[i];
                if (this.isPointOn(curP) && pSeg.isPointOn(curP)) {
                    p.push(curP);
                }
            }
            return {
                pointAmount: p.length,
                p: p
            }
        }
    };
    this.getIntersectionWithOtherShape = function(shape) {
        var intersec = G.getIntersection(this.parabola, shape),
            resPoints = [];
        for (var i = 0; i < intersec.pointAmount; i++) {
            if (this.normalLine.arePointsOnSameSide(this.point.getShiftedByVector(this.vector), intersec.p[i])) {
                resPoints.push(intersec.p[i]);
            }
        }
        return {
            pointAmount: resPoints.length,
            p: resPoints
        }
    }
}