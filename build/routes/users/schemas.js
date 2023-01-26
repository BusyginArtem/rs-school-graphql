"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeBodySchema = exports.changeUserBodySchema = exports.createUserBodySchema = void 0;
exports.createUserBodySchema = {
    type: 'object',
    required: ['firstName', 'lastName', 'email'],
    properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
    },
    additionalProperties: false,
};
exports.changeUserBodySchema = {
    type: 'object',
    properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
    },
    additionalProperties: false,
};
exports.subscribeBodySchema = {
    type: 'object',
    required: ['userId'],
    properties: {
        userId: { type: 'string', format: 'uuid' },
    },
    additionalProperties: false,
};
//# sourceMappingURL=schemas.js.map