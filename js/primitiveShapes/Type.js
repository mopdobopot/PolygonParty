/**
 * @author Lomovtsev Pavel
 * Date: 14.04.2014
 * Time: 17:16
 */
var Type = {
    isBeam: function(obj) {
        return obj.hasOwnProperty("point") &&
               obj.hasOwnProperty("vector") &&
               obj.hasOwnProperty("line");
    },
    isLine: function(obj) {
        return obj.hasOwnProperty("a") &&
               obj.hasOwnProperty("b") &&
               obj.hasOwnProperty("c") &&
               obj.hasOwnProperty("pointOnLine");
    },
    isSegment: function(obj) {
        return obj.hasOwnProperty("a") &&
               obj.hasOwnProperty("b") &&
               obj.hasOwnProperty("beamA") &&
               obj.hasOwnProperty("beamB");
    },
    isVector: function(obj) {
        return obj.hasOwnProperty("module") &&
               obj.hasOwnProperty("x") &&
               obj.hasOwnProperty("y");
    },
    isPoint: function(obj) {
        return !obj.hasOwnProperty("module") &&
               obj.hasOwnProperty("x") &&
               obj.hasOwnProperty("y");
    },
    isParabola: function(obj) {
        return obj.hasOwnProperty("focus") &&
               obj.hasOwnProperty("directrix");
    },
    isParabolicSegment: function(obj) {
        return obj.hasOwnProperty("parabola") &&
               obj.hasOwnProperty("normalLineA") &&
               obj.hasOwnProperty("normalLineB");
    },
    isParabolicBeam: function(obj) {
        return obj.hasOwnProperty("parabola") &&
               obj.hasOwnProperty("normalLine");
    }
};
