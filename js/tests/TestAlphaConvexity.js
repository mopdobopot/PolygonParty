/**
 * @author Lomovtsev Pavel
 * Date: 29.10.2014
 * Time: 22:43
 */

var TestAlphaConvexity = {
    all: function() {
        var testName = "alphaConvexity()";
        try {
            exampleBisector();
            if (Math.abs(Example.alphaConvexity - Math.PI / 2) >= Config.alphaConvexityEps) {
                throw new Error("Случай с одной биссектрисой")
            }

            exampleTwoVertexes();
            if (Math.abs(Example.alphaConvexity - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с двумя вершинами (когда угол равен PI)")
            }

            exampleParallelSides1();
            if (Math.abs(Example.alphaConvexity - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с параллельными сторонами (когда угол равен PI)")
            }

            exampleParallelSides2();
            if (Math.abs(Example.alphaConvexity - Math.PI) <= Config.alphaConvexityEps) {
                throw new Error("Случай с параллельными сторонами (когда угол не равен PI)")
            }

            exampleParabolaVertex();
            if (Math.abs(Example.alphaConvexity - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с вершиной параболы (когда угол равен PI)")
            }

            exampleTwoBisectors();
            if (Math.abs(Example.alphaConvexity) <= Math.PI / 2) {
                throw new Error("Случай с двумя биссектрисами")
            }

            exampleNonNeighbourSides();
            if (Math.abs(Example.alphaConvexity - 2.2142) >= Config.alphaConvexityEps) {
                throw new Error("Случай с двумя несоседними сторонами, угол должен быть равен 2.2142");
            }

            exampleNonNeighbourSides2();
            if (Math.abs(Example.alphaConvexity - 2.2142) >= Config.alphaConvexityEps) {
                throw new Error("Случай с двумя несоседними сторонами, угол должен быть равен 2.2142");
            }

            exampleThreeSides();
            if (Math.abs(Example.alphaConvexity - 2.0323) >= Config.alphaConvexityEps) {
                throw new Error("Случай с тремя сторонами, угол должен быть 2.0323");
            }

            acTestThreeVertexes();
            if (Math.abs(Example.alphaConvexity - Math.PI) >= Config.alphaConvexityEps) {
                throw new Error("Случай с двумя вершинами")
            }

            this.logSuccess(testName);
        } catch (whatsWrong) {
            this.logFailure(testName, whatsWrong);
        }
    }
};

TestAlphaConvexity.__proto__ = BaseTest;