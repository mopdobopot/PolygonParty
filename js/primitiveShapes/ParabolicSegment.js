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
        dNormalLine = new Line(pointA, pointA.getShiftedByVector(dNormal));
    if (!dNormalLine.arePointsOnSameSide(pointB, pointA.getShiftedByVector(vectorA)) ||
        !dNormalLine.arePointsOnSameSide(pointA, pointB.getShiftedByVector(vectorB))) {
        throw new Error("Сегмент параболы задан неверно");
    }
    this.vectorB = vectorB;

    this.getPointOn = function() {
       return this.a;
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