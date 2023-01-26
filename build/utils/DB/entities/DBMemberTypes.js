"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBEntity_1 = __importDefault(require("./DBEntity"));
class DBMemberTypes extends DBEntity_1.default {
    constructor() {
        super();
        this.create({
            id: 'basic',
            discount: 0,
            monthPostsLimit: 20,
        });
        this.create({
            id: 'business',
            discount: 5,
            monthPostsLimit: 100,
        });
        const forbidOperationTrap = {
            apply(target) {
                throw new Error(`forbidden operation: cannot ${target.name} a member type`);
            },
        };
        this.delete = new Proxy(this.delete, forbidOperationTrap);
        this.create = new Proxy(this.create, forbidOperationTrap);
    }
    async create(dto) {
        const created = {
            ...dto,
        };
        this.entities.push(created);
        return created;
    }
}
exports.default = DBMemberTypes;
//# sourceMappingURL=DBMemberTypes.js.map