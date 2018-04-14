"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var renderDependency = function (libraryName, types) {
    return "import " + types.join(', ') + " from '" + libraryName + "'";
};
function component(name, template, dependencies, styles, props) {
    if (dependencies === void 0) { dependencies = {}; }
    // tslint:disable-next-line:max-line-length
    var dependenciesArray = Object.keys(dependencies).map(function (libraryName) { return renderDependency(libraryName, dependencies[libraryName]); });
    var propsString = '';
    if (props && props.length > 0) {
        propsString = "props: [" + props.join(', ') + "],";
    }
    var componentsString = '';
    if (dependencies && Object.keys(dependencies).length > 0) {
        componentsString = "components: {\n      " + Object.keys(dependencies).map(function (librabryName) { return dependencies[librabryName]; }).join(', ') + "      \n    }";
    }
    var stylesString = '';
    if (styles) {
        stylesString = "<style>" + styles + "</style>";
    }
    return "\n    <template>\n        " + template + "\n    </template>\n    \n    <script>\n    " + dependenciesArray.join("") + "\n    \n    export default {\n      name: " + JSON.stringify(_.upperFirst(name)) + ",\n      " + propsString + "\n      " + componentsString + "\n    }\n    </script>\n    \n    " + stylesString + "\n  ";
}
exports.default = component;
//# sourceMappingURL=component.js.map