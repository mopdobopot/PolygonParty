/**
 * @Author Lomovtsev Pavel
 * Date: 02.11.13
 * Time: 14:31
 */
var Config = {
    debugDrawing: false,
    debugConsole: true,

    polygonFileName: "p",

    polygonColor: "#000",
    gridColor: "#eee",
    axisColor: "#ccc",

    animatedDrawing: false,
    animatedDrawingSpeed: 100,
    vertexRadius: 2.1,
    clickedVertexRadius: 1.6,

    eps: 1e-5,
    zeroPointEps: 1e-7,
    //Точность для вычисления принадлежности точки параболе
    pointOnParabolaEps: 1e-5,
    quadraticEquationEps: 10e-7,
    //Угол, примерно равный 0.06 градуса, считается за 0 при определении сонаправленности векторов
    sameDirectingEps: 1e-3,
    //Точность "выпукливания" звёздчатого многоугольника
    stretchingEps: 1e-7,
    //Точность определения совпадения прямых
    linesEqualsEps: 1e-5,
    linesParallelEps: this.eps,

    //Точность вычисления альфа-выпуклости
    alphaConvexityEps: 1e-4
};
