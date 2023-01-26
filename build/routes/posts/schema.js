"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePostBodySchema = exports.createPostBodySchema = void 0;
exports.createPostBodySchema = {
    type: 'object',
    required: ['title', 'content', 'userId'],
    properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        userId: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
};
exports.changePostBodySchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        content: { type: 'string' },
    },
    additionalProperties: false,
};
//# sourceMappingURL=schema.js.map