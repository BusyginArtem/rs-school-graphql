"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeProfileBodySchema = exports.createProfileBodySchema = void 0;
exports.createProfileBodySchema = {
    type: 'object',
    required: [
        'avatar',
        'sex',
        'birthday',
        'country',
        'street',
        'city',
        'userId',
        'memberTypeId',
    ],
    properties: {
        avatar: { type: 'string' },
        sex: { type: 'string' },
        birthday: { type: 'number' },
        country: { type: 'string' },
        street: { type: 'string' },
        city: { type: 'string' },
        userId: { type: 'string', format: 'uuid' },
        memberTypeId: {
            type: 'string',
        },
    },
    additionalProperties: false,
};
exports.changeProfileBodySchema = {
    type: 'object',
    properties: {
        avatar: { type: 'string' },
        sex: { type: 'string' },
        birthday: { type: 'number' },
        country: { type: 'string' },
        street: { type: 'string' },
        city: { type: 'string' },
        memberTypeId: {
            type: 'string',
        },
    },
    additionalProperties: false,
};
//# sourceMappingURL=schema.js.map