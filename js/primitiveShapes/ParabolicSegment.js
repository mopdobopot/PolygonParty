/**
 * @author Lomovtsev Pavel
 * Date: 09.06.2014
 * Time: 10:43
 */
//Задаётся параболой и двумя точками с направлениями параллельными директрисе, направленными друг к другу
function ParabolicSegment(parabola, pointA, vectorA, pointB, vectorB) {
    this.parabola = parabola;
    this.a = pointA;
    this.b = pointB;
    this.normalLineA = new Line(pointA, pointA.getShiftedByVector(parabola.directrixNormalVector));
    this.normalLineB = new Line(pointB, pointB.getShiftedByVector(parabola.directrixNormalVector));
    this.vectorA = vectorA;
    var dNormal = parabola.directrixNormalVector,
        dNormalLine1 = new Line(pointA, pointA.getShiftedByVector(dNormal)),
        dNormalLine2 = new Line(pointB, pointB.getShiftedByVector(dNormal));
    if (!dNormalLine1.arePointsOnSameSide(pointB, pointA.getShiftedByVector(vectorA)) ||
        !dNormalLine2.arePointsOnSameSide(pointA, pointB.getShiftedByVector(vectorB))) {
        throw new Error("Сегмент параболы задан неверно");
    }
    this.vectorB = vectorB;

    this.getPointOn = function() {
       return this.a;
    };
    this.isPointOn = function(point) {
        if (point.equalsToPoint(this.a) || point.equalsToPoint(this.b)) {
            return true;
        }
        else {
            var beam1 = new ParabolicBeam(this.parabola, this.a, this.vectorA);
            var beam2 = new ParabolicBeam(this.parabola, this.b, this.vectorB);
            return beam1.isPointOn(point) && beam2.isPointOn(point);
        }
    };
    this.getIntersectionWithParabolicSegment = function(pSeg) {
        var intersec = G.getIntersection(this.parabola, pSeg.parabola);
        if (intersec === Infinity) {
            if (this.isPointOn(pSeg.a)) {
                if (this.isPointOn(pSeg.b)) {
                    //Оба конца pSeg лежат в this => pSeg целиком лежит в this
                    return pSeg;
                }
                //pSeg.b не лежит в this
                else if (pSeg.isPointOn(this.a)) {
                    if (this.a.equalsToPoint(pSeg.a)) {
                        return this.a;
                    }
                    else {
                        return new ParabolicSegment(this.parabola, this.a, this.vectorA, pSeg.a, pSeg.vectorA);
                    }
                }
                else if (pSeg.isPointOn(this.b)) {
                    if (this.b.equalsToPoint(pSeg.a)) {
                        return this.b;
                    }
                    else {
                        return new ParabolicSegment(this.parabola, this.b, this.vectorB, pSeg.a, pSeg.vectorA);
                    }
                }
            }
            else if (this.isPointOn(pSeg.b)) {
                if (pSeg.isPointOn(this.a)) {
                    if (this.a.equalsToPoint(pSeg.b)) {
                        return this.a;
                    }
                    else {
                        return new ParabolicSegment(this.parabola, this.a, this.vectorA, pSeg.b, pSeg.vectorB);
                    }
                }
                else if (pSeg.isPointOn(this.b)) {
                    if (this.b.equalsToPoint(pSeg.b)) {
                        return this.b;
                    }
                    else {
                        return new ParabolicSegment(this.parabola, this.b, this.vectorB, pSeg.b, pSeg.vectorB);
                    }
                }
            }
            //Ни один конец pSeg не лежит в this => или this целиком лежит в pSeg
            else if (pSeg.isPointOn(this.a) && pSeg.isPointOn(this.b)) {
                return this;
            }
            //или они не пересекаются
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
            if (this.normalLineA.arePointsOnSameSide(this.a.getShiftedByVector(this.vectorA), intersec.p[i]) &&
                this.normalLineB.arePointsOnSameSide(this.b.getShiftedByVector(this.vectorB), intersec.p[i])) {
                resPoints.push(intersec.p[i]);
            }
        }
        return {
            pointAmount: resPoints.length,
            p: resPoints
        }
    }
}