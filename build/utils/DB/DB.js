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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBMemberTypes_1 = __importDefault(require("./entities/DBMemberTypes"));
const DBPosts_1 = __importDefault(require("./entities/DBPosts"));
const DBProfiles_1 = __importDefault(require("./entities/DBProfiles"));
const DBUsers_1 = __importDefault(require("./entities/DBUsers"));
const lodash = __importStar(require("lodash"));
class DB {
    users = new DBUsers_1.default();
    profiles = new DBProfiles_1.default();
    memberTypes = new DBMemberTypes_1.default();
    posts = new DBPosts_1.default();
    constructor() {
        const deepCopyResultTrap = {
            get: (target, prop) => {
                if (typeof target[prop] === 'function') {
                    return (...args) => {
                        const result = target[prop](...args);
                        if (result instanceof Promise) {
                            return result.then((v) => lodash.cloneDeep(v));
                        }
                        return lodash.cloneDeep(result);
                    };
                }
                else {
                    return target[prop];
                }
            },
        };
        for (const [k, v] of Object.entries(this)) {
            this[k] = new Proxy(v, deepCopyResultTrap);
        }
    }
}
exports.default = DB;
//# sourceMappingURL=DB.js.map