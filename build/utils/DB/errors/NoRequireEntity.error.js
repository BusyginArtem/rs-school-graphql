"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRequiredEntity = void 0;
class NoRequiredEntity extends Error {
    constructor(operation) {
        super(`Fail during ${operation}.`);
        this.name = 'No required entity';
    }
}
exports.NoRequiredEntity = NoRequiredEntity;
//# sourceMappingURL=NoRequireEntity.error.js.map