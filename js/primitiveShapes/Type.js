/**
 * @author Lomovtsev Pavel
 * Date: 14.04.2014
 * Time: 17:16
 */
var Type = {
    isBeam: function(obj) {
        if (obj === null) {
            return null;
        }
        return obj.hasOwnProperty("point") &&
               obj.hasOwnProperty("vector") &&
               obj.hasOwnProperty("line");
    },
    isLine: function(obj) {
        if (obj === null) {
            return null;
        }
        return obj.hasOwnProperty("a") &&
               obj.hasOwnProperty("b") &&
               obj.hasOwnProperty("c") &&
               obj.hasOwnProperty("pointOnLine");
    },
    isSegment: function(obj) {
        if (obj === null) {
            return null;
        }
        return obj.hasOwnProperty("a") &&
               obj.hasOwnProperty("b") &&
               obj.hasOwnProperty("beamA") &&
               obj.hasOwnProperty("beamB");
    },
    isVector: function(obj) {
        if (obj === null) {
            return null;
        }
        return obj.hasOwnProperty("module") &&
               obj.hasOwnProperty("x") &&
               obj.hasOwnProperty("y");
    },
    isPoint: function(obj) {
        if (obj === null) {
            return null;
        }
        return !obj.hasOwnProperty("module") &&
               obj.hasOwnProperty("x") &&
               obj.hasOwnProperty("y");
    },
    isParabola: function(obj) {
        if (obj === null) {
            return null;
        }
        return obj.hasOwnProperty("focus") &&
               obj.hasOwnProperty("directrix");
    },
    isParabolicSegment: function(obj) {
        if (obj === null) {
            return null;
        }
        return obj.hasOwnProperty("parabola") &&
               obj.hasOwnProperty("normalLineA") &&
               obj.hasOwnProperty("normalLineB");
    },
    isParabolicBeam: function(obj) {
        if (obj === null) {
            return null;
        }
        return obj.hasOwnProperty("parabola") &&
               obj.hasOwnProperty("normalLine");
    }
};
