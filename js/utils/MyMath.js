/**
 * @author Lomovtsev Pavel
 * Date: 17.04.2014
 * Time: 11:55
 */
var MyMath = {
    solveQuadratic: function(a, b, c) {
        if (Math.abs(a) < Config.quadraticEquationEps) {
            if (Math.abs(b) < Config.quadraticEquationEps)
                throw new Error("Квадратное уравнение задано неверно: a = 0 и b = 0");
            return {
                rootAmount: 1,
                roots: [-c / b]
            }
        }
        var d = b * b - 4 * a * c;
        if (d < 0)
            return {
                rootAmount: 0
            };
        if (Math.abs(d) < Config.quadraticEquationEps)
            return {
                rootAmount: 1,
                roots: [-b / (2 * a)]
            };
        if (d > 0)
            return {
                rootAmount: 2,
                roots: [(-b + Math.sqrt(d)) / (2 * a), (-b - Math.sqrt(d)) / (2 * a)]
            }
    }
};