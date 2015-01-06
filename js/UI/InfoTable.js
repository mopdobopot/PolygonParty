/**
 * Created by mopdobopot on 04.01.2015.
 */

function InfoTable() {

    var makeInfoObject = function(polygon) {
        return {
            "Тип": polygon.type,
            "Периметр": polygon.getPerimeter(),
            "Площадь": polygon.getSquare(),
            "Альфа-выпуклость": polygon.getAlphaConvexity()
        }
    };
    var infoObjectToHTML = function(object) {
        var info = "";
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                info += '<tr>' +
                '<td>' + key + ':</td>' +
                '<td>' + object[key] + '</td>' +
                '</tr>';
            }
        }
        return info;
    };

    return {

        $container: undefined,
        $elem: undefined,
        id: undefined,

        init: function($container, id, polygon) {
            this.$container = $container;
            this.$container.append(
                "<table id=" + id + "></table>"
            );
            this.$elem = $('#' + id);
            this.id = id;
            this.update(polygon);
            return this;
        },
        update: function(polygon) {
            if (polygon != undefined && polygon != null) {
                this.$elem.html(infoObjectToHTML(makeInfoObject(polygon)));
            }
        },
        clear: function() {
            this.$elem.html("");
        }
    }
}