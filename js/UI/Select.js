/**
 * Created by mopdobopot on 06.01.2015.
 */

function Select() {

    return {

        $container: undefined,
        $elem: undefined,
        id: undefined,
        options: undefined,

        init: function($container, id, options, defaultOption, onChange) {
            this.$container = $container;
            var optionsHTML = "";
            for (var i = 0; i < options.length; i++) {
                optionsHTML += "<option>" + options[i] + "</option>"
            }
            this.$container.append(
                "<select id=" + id + ">" + optionsHTML + "</select>"
            );
            this.$elem = $('select#' + id);
            this.id = id;
            this.options = options;
            this.$elem.val(defaultOption);
            var _this = this;
            this.$elem.change(function() {
                if (onChange) onChange(_this.val());
            });
            return this;
        },
        val: function(value) {
            if (value) this.$elem.val(value);
            return this.$elem.val();
        }
    }
}