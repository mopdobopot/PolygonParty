/**
 * @author Lomovtsev Pavel
 * Date: 29.10.2014
 * Time: 22:43
 */

var TestAlphaConvexity = {
    all: function() {

        var testName = "Alpha-convexity";

        exampleBisector();
        console.assert(Math.abs(Example.alphaConvexity - Math.PI / 2) < Config.alphaConvexityEps,
            "Случай с одной биссектрисой");

        exampleTwoVertexes();
        console.assert(Math.abs(Example.alphaConvexity - Math.PI) < Config.alphaConvexityEps,
            "Случай с двумя вершинами (когда угол равен PI)");

        exampleParallelSides1();
        console.assert(Math.abs(Example.alphaConvexity - Math.PI) < Config.alphaConvexityEps,
            "Случай с параллельными сторонами (когда угол равен PI)");

        exampleParallelSides2();
        console.assert(Math.abs(Example.alphaConvexity - Math.PI) > Config.alphaConvexityEps,
            "Случай с параллельными сторонами (когда угол не равен PI)");

        exampleParabolaVertex();
        console.assert(Math.abs(Example.alphaConvexity - Math.PI) < Config.alphaConvexityEps,
            "Случай с вершиной параболы (когда угол равен PI)");

        exampleTwoBisectors();
        console.assert(Math.abs(Example.alphaConvexity) > Math.PI / 2,
            "Случай с двумя биссектрисами");

        exampleNonNeighbourSides();
        console.assert(Math.abs(Example.alphaConvexity - 2.2142) < Config.alphaConvexityEps,
            "Случай с двумя несоседними сторонами, угол должен быть равен 2.2142");

        exampleNonNeighbourSides2();
        console.assert(Math.abs(Example.alphaConvexity - 2.2142) < Config.alphaConvexityEps,
            "Случай с двумя несоседними сторонами, угол должен быть равен 2.2142");

        exampleThreeSides();
        console.assert(Math.abs(Example.alphaConvexity - 2.0323) < Config.alphaConvexityEps,
            "Случай с тремя сторонами, угол должен быть 2.0323");

        example(Example.random1);
        console.assert(Math.abs(Example.alphaConvexity - 3.0638) < Config.alphaConvexityEps,
            "Ошибка в Example.random1, биссектриса сторон 6-7 и 8-9 должна давать угол 3.0638");

        example(Example.random2);
        console.assert(Math.abs(Example.alphaConvexity - 2.7340) < Config.alphaConvexityEps,
            "Ошибка в Example.random2, биссектриса угла 4-5-0 должна давать угол 2.7340");

        this.logSuccess(testName);
    }
};

TestAlphaConvexity.__proto__ = BaseTest;