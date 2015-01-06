/**
 * Created by mopdobopot on 06.01.2015.
 */

function Input() {

    return {

        $container: undefined,
        $elem: undefined,
        name: undefined,
        label: undefined,
        onChange: undefined,
        onError: undefined,
        onUnError: undefined,
        isError: false,

        init: function($container, name, label, defaultValue, onChange, onError, onUnError) {
            this.$container = $container;
            this.$container.append(
                "<div class=label>" + label + "</div>" +
                "<input name=" + name + ">"
            );
            this.$elem = $container.find('input[name = ' + name + ']');
            var _this = this;
            this.$elem.keyup(function() {
                _this.setVal(_this.val());
                if (onChange) onChange(_this.val());
            });
            this.$elem.change(function() {
                _this.setVal(_this.val());
                if (onChange) onChange(_this.val());
            });
            this.name = name;
            this.label = label;
            this.$label = $container.find('div.label'); //todo независимо от класса
            this.setVal(defaultValue);
            this.onChange = onChange;
            this.onError = onError;
            this.onUnError = onUnError;
            return this;
        },
        setVal: function(newVal) {
            if (newVal || newVal == "") {
                if (!this.isValidValue(newVal)) {
                    this.error();
                }
                else {
                    this.unError();
                    this.$elem.val(newVal);
                }
            }
        },
        setLabel: function(newLabel) {
            this.$label.text(newLabel);
            this.label = newLabel;
        },
        isValidValue: function(value) {
            return true; //abstract
        },
        val: function(newVal) {
            if (newVal) this.setVal(newVal);
            return this.$elem.val();
        },
        error: function() {
            this.isError = true;
            this.$container.children().addClass('error');
            if (this.onError) this.onError();
        },
        unError: function() {
            this.isError = false;
            this.$container.children().removeClass('error');
            if (this.onUnError) this.onUnError();
        }
    }
}