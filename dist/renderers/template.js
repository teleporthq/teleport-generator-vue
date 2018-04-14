"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function template(name, childrenTags, styles, props) {
    var stylesString = '';
    if (styles) {
        if (Array.isArray(styles) && styles.length > 0) {
            stylesString = "class=\"" + styles.join(' ') + "\"";
        }
        else {
            stylesString = "class=\"" + styles + "\"";
        }
    }
    var propsArray = [];
    if (props) {
        Object.keys(props).map(function (propName) {
            var propValue = props[propName];
            propsArray.push(propName + "=\"" + propValue + "\"");
        });
    }
    var propsString = (propsArray.length ? ' ' + propsArray.join(' ') : '');
    if (childrenTags && childrenTags.length > 0) {
        return "\n      <" + name + " " + stylesString + " " + propsString + ">\n        " + childrenTags + "\n      </" + name + ">\n    ";
    }
    else {
        return "<" + name + " " + stylesString + " " + propsString + "/>";
    }
}
exports.default = template;
//# sourceMappingURL=template.js.map