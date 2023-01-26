"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = __importStar(require("lodash"));
const NoRequireEntity_error_1 = require("../errors/NoRequireEntity.error");
class DBEntity {
    entities = [];
    runChecks(entity, options) {
        if (options.equals) {
            return lodash.isEqual(entity[options.key], options.equals);
        }
        if (options.equalsAnyOf) {
            return options.equalsAnyOf.some((inputValue) => lodash.isEqual(entity[options.key], inputValue));
        }
        if (options.inArray) {
            const array = entity[options.key];
            return array.some((value) => lodash.isEqual(value, options.inArray));
        }
        if (options.inArrayAnyOf) {
            const array = entity[options.key];
            return array.some((value) => options.inArrayAnyOf?.some((valueInput) => lodash.isEqual(value, valueInput)));
        }
        return false;
    }
    async findOne(options) {
        return (this.entities.find((entity) => this.runChecks(entity, options)) ?? null);
    }
    async findMany(options) {
        if (!options) {
            return this.entities;
        }
        return this.entities.filter((entity) => this.runChecks(entity, options));
    }
    async delete(id) {
        const idx = this.entities.findIndex((entity) => entity.id === id);
        if (idx === -1)
            throw new NoRequireEntity_error_1.NoRequiredEntity('delete');
        const deleted = this.entities[idx];
        this.entities.splice(idx, 1);
        return deleted;
    }
    async change(id, changeDTO) {
        const idx = this.entities.findIndex((entity) => entity.id === id);
        if (idx === -1)
            throw new NoRequireEntity_error_1.NoRequiredEntity('change');
        const changed = { ...this.entities[idx], ...changeDTO };
        this.entities.splice(idx, 1, changed);
        return changed;
    }
}
exports.default = DBEntity;
//# sourceMappingURL=DBEntity.js.map