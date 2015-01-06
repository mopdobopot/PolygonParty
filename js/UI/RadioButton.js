/**
 * Created by mopdobopot on 06.01.2015.
 */

function RadioButton() {

    return {

        $container: undefined,
        $elems: {},
        name: undefined,
        radios: undefined,

        init: function($container, name, radios, defaultRadioValue) {
            this.$container = $container;
            for (var i = 0; i < radios.length; i++) {
                var val = radios[i].value;
                this.$container.append(
                    '<div class="option radioButton">' +
                        '<input type="radio" name=' + name + ' value=' + val + '>' +
                        '<div class=inline-label>' + radios[i].label + '</div>' +
                    '</div>'
                );
                this.$elems[val] = $container.find('input[value=' + val + ']');
                this.$elems[val]['onCheck'] = radios[i].onCheck;
                this.$elems[val]['onUnCheck'] = radios[i].onUnCheck;
                var _this = this;
                this.$elems[val].change(function() {
                    if ($(this).prop('checked')) {
                        _this.$elems[$(this).prop('value')].onCheck();
                    }
                });
                this.$elems[val].change(function() {
                    if (!$(this).prop('checked')) {
                        _this.$elems[$(this).prop('value')].onUnCheck();
                    }
                })
            }
            this.name = name;
            this.radios = radios;
            if (defaultRadioValue) this.check(defaultRadioValue);
            return this;
        },
        check: function(radioValue) {
            this.$elems[radioValue].click();
        }
    }
}