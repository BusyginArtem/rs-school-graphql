"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const DB_1 = __importDefault(require("../utils/DB/DB"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    const db = new DB_1.default();
    fastify.decorate('db', db);
});
//# sourceMappingURL=db.js.map