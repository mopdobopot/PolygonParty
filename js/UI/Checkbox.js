/**
 * Created by mopdobopot on 05.01.2015.
 */

function Checkbox() {

    return {

        $container: undefined,
        $elem: undefined,
        name: undefined,
        label: undefined,
        $label: undefined,
        state: CheckboxState.UNCHECKED,

        init: function($container, name, label, defaultState, onClick, onCheck, onUnCheck) {
            this.$container = $container;
            this.$container.append(
                "<input type=checkbox name=" + name + ">" +
                "<div class=inline-label>" + label + "</div>"
            );
            this.$elem = $container.find('input[name = ' + name + ']');
            var _this = this;
            this.$elem.click(function() {
                _this.toggleState();
                if (onClick) onClick();
                if (onCheck && _this.isChecked()) {
                    onCheck();
                }
                if (onUnCheck && !_this.isChecked()) {
                    onUnCheck();
                }
            });
            this.name = name;
            this.label = label;
            this.$label = $container.find('div.inline-label'); //todo независимо от класса
            if (defaultState) {
                this.setState(defaultState);
            }
            return this;
        },
        setState: function(newState) {
            if (newState != this.state) {
                this.$elem.click();
            }
        },
        setLabel: function(newLabel) {
            this.$label.text(newLabel);
            this.label = newLabel;
        },
        isChecked: function() {
            return this.state == CheckboxState.CHECKED;
        },
        toggleState: function() {
            this.state = this.state == CheckboxState.CHECKED ?
                CheckboxState.UNCHECKED :
                CheckboxState.CHECKED;
        }
    }
}

var CheckboxState = {
    CHECKED: 'checked',
    UNCHECKED: 'unchecked'
};