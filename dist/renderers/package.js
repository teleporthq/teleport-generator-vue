"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function packageRenderer(project) {
    return {
        name: project.slug,
        author: project.userSlug || 'Unknown',
        version: project.version || '0.0.1',
        description: project.description || '',
        scripts: {
            dev: "nuxt",
            build: "nuxt build",
            start: "nuxt start",
        },
        license: "ISC",
        dependencies: {
            "nuxt": "^1.4.0",
            "vue": "^2.5.13"
        }
    };
}
exports.default = packageRenderer;
//# sourceMappingURL=package.js.map