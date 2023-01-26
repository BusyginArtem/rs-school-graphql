"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const plugin = async (fastify) => {
    fastify.post('/', {
        schema: {
            body: schema_1.graphqlBodySchema,
        },
    }, async function (request, reply) { });
};
exports.default = plugin;
//# sourceMappingURL=index.js.map