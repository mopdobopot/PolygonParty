/**
 * Created by mopdobopot on 04.01.2015.
 */

function InfoTable($container, id) {

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
        $container: $container,
        $elem: undefined,
        id: id,

        init: function(polygon) {
            this.$container.append(
                "<table id=" + this.id + "></table>"
            );
            this.$elem = $('#' + this.id);
            this.update(polygon);
            return this;
        },
        update: function(polygon) {
            if (polygon != undefined && polygon != null) {
                this.$elem.html(infoObjectToHTML(makeInfoObject(polygon)));
            }
        }
    }
}