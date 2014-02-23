/**
 * @Author Lomovtsev Pavel
 * Date: 04.10.13
 * Time: 22:01
 */
var Point = {

    genRand: function(min, max) {
        if (min > max) {
            throw new Error("Неверный диапазон для генерации точки: [" + min + ".." + max + ")");
        } else if (min < 0) {
            throw new Error("Координаты генерируемой точки могут изменяться только от 0 до +inf");
        } else {
            return {
                x: min + Math.random() * (max - min),
                y: min + Math.random() * (max - min)
            }
        }
    }

}