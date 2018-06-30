"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var formatter = require("vue-formatter");
var teleport_lib_js_1 = require("teleport-lib-js");
var template_1 = require("../renderers/template");
var component_1 = require("../renderers/component");
function findNextIndexedKeyInObject(object, key) {
    if (!object[key])
        return key;
    var i = 1;
    while (object[key + "_" + i] !== undefined) {
        i++;
    }
    return key + "_" + i;
}
var VueComponentGenerator = /** @class */ (function (_super) {
    __extends(VueComponentGenerator, _super);
    function VueComponentGenerator(generator) {
        return _super.call(this, generator) || this;
    }
    VueComponentGenerator.prototype.processStyles = function (componentContent, styles) {
        var _this = this;
        var content = JSON.parse(JSON.stringify(componentContent));
        if (content.style) {
            var styleName = findNextIndexedKeyInObject(styles, content.name || content.type);
            styles[styleName] = content.style;
            content.style = [styleName];
            // @todo: handle platform
        }
        // if has children, do the same for children
        if (content.children && content.children.length > 0) {
            if (typeof content.children !== "string") {
                content.children = content.children.map(function (child) {
                    var childStyledResults = _this.processStyles(child, styles);
                    styles = __assign({}, styles, childStyledResults.styles);
                    return childStyledResults.content;
                });
            }
        }
        return { styles: styles, content: content };
    };
    VueComponentGenerator.prototype.computeDependencies = function (content) {
        var _a, _b;
        var _this = this;
        var dependencies = {};
        var source = content.source, type = content.type, children = content.children, otherProps = __rest(content, ["source", "type", "children"]);
        if (source && type) {
            if (source === 'components') {
                return _a = {},
                    _a["components/" + type] = [type],
                    _a;
            }
            if (source === 'pages') {
                return _b = {},
                    _b["pages/" + type] = [type],
                    _b;
            }
            var mapping = this.generator.target.map(source, type);
            if (mapping) {
                if (mapping.library) {
                    // if the library is not yet in the dependecnies, add it
                    if (!dependencies[mapping.library])
                        dependencies[mapping.library] = [];
                    // if the type is not yet in the deps for the current library, add it
                    if (dependencies[mapping.library].indexOf(mapping.type) < 0)
                        dependencies[mapping.library].push(mapping.type);
                }
            }
            else {
                console.error("could not map '" + type + "' from '" + source + "' for target '" + this.generator.targetName + "'");
            }
        }
        // if there are childrens, get their deps and merge them with the current ones
        if (children && children.length > 0 && typeof children !== "string") {
            var childrenDependenciesArray = children.map(function (child) { return _this.computeDependencies(child); });
            if (childrenDependenciesArray.length) {
                childrenDependenciesArray.forEach(function (childrenDependency) {
                    Object.keys(childrenDependency).forEach(function (childrenDependencyLibrary) {
                        if (!dependencies[childrenDependencyLibrary])
                            dependencies[childrenDependencyLibrary] = [];
                        // tslint:disable-next-line:max-line-length
                        dependencies[childrenDependencyLibrary] = _.union(dependencies[childrenDependencyLibrary], childrenDependency[childrenDependencyLibrary]);
                    });
                });
            }
        }
        return dependencies;
    };
    VueComponentGenerator.prototype.renderComponentTemplate = function (content) {
        var _this = this;
        var source = content.source, type = content.type, props = __rest(content
        // retieve the target type from the lib
        , ["source", "type"]);
        // retieve the target type from the lib
        var mapping = null;
        var mappedType = type;
        if (source !== 'components' && source !== 'pages') {
            mapping = this.generator.target.map(source, type);
            if (mapping)
                mappedType = mapping.type;
        }
        var styleNames = null;
        if (props.style)
            styleNames = props.style;
        delete props.style;
        // there are cases when no children are passed via structure, so the deconstruction will fail
        var children = null;
        if (props.children)
            children = props.children;
        // remove the children from props
        delete props.children;
        var childrenTags = [];
        if (children && children.length > 0) {
            if (typeof children === "string")
                childrenTags = children;
            else
                childrenTags = children.map(function (child) { return _this.renderComponentTemplate(child); });
        }
        if (Array.isArray(childrenTags)) {
            childrenTags = childrenTags.join('');
        }
        styleNames = styleNames ? styleNames.map(function (style) { return style; }).join(', ') : null;
        var name = props.name, componentProps = props.props, otherProps = __rest(props, ["name", "props"]); // this is to cover img uri props; aka static props
        var mappedProps = __assign({}, componentProps, otherProps);
        if (mapping && typeof mapping.props === 'function') {
            mappedProps = mapping.props(mappedProps);
        }
        return template_1.default(mappedType, childrenTags, styleNames, mappedProps);
    };
    // tslint:disable-next-line:no-shadowed-variable
    VueComponentGenerator.prototype.generate = function (component, options) {
        if (options === void 0) { options = {}; }
        var name = component.name;
        var content = component.content;
        var dependencies = this.computeDependencies(content);
        var stylingResults = this.processStyles(content, {});
        var styles = stylingResults.styles;
        content = stylingResults.content;
        var css = teleport_lib_js_1.default.transformers.styles.jstocss(styles).css;
        var template = this.renderComponentTemplate(content);
        var props = (component.editableProps ? Object.keys(component.editableProps) : null);
        // tslint:disable-next-line:max-line-length
        var result = new teleport_lib_js_1.FileSet();
        result.addFile(_.upperFirst(component.name) + ".vue", formatter(component_1.default(name, template, dependencies, css, props)));
        return result;
    };
    return VueComponentGenerator;
}(teleport_lib_js_1.ComponentGenerator));
exports.default = VueComponentGenerator;
//# sourceMappingURL=component.js.map