"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reusedSchemas_1 = require("../../utils/reusedSchemas");
const plugin = async (fastify) => {
    fastify.get("/", async function (request, reply) {
        return await fastify.db.users.findMany();
    });
    fastify.get("/:id", {
        schema: {
            params: reusedSchemas_1.idParamSchema,
        },
    }, async function (request, reply) {
        return await fastify.db.users.findOne({
            key: "id",
            equals: request.params.id,
        });
    });
    // fastify.post(
    //   "/",
    //   {
    //     schema: {
    //       body: createUserBodySchema,
    //     },
    //   },
    //   async function (request, reply): Promise<UserEntity> {}
    // );
    // fastify.delete(
    //   "/:id",
    //   {
    //     schema: {
    //       params: idParamSchema,
    //     },
    //   },
    //   async function (request, reply): Promise<UserEntity> {}
    // );
    // fastify.post(
    //   "/:id/subscribeTo",
    //   {
    //     schema: {
    //       body: subscribeBodySchema,
    //       params: idParamSchema,
    //     },
    //   },
    //   async function (request, reply): Promise<UserEntity> {}
    // );
    // fastify.post(
    //   "/:id/unsubscribeFrom",
    //   {
    //     schema: {
    //       body: subscribeBodySchema,
    //       params: idParamSchema,
    //     },
    //   },
    //   async function (request, reply): Promise<UserEntity> {}
    // );
    // fastify.patch(
    //   "/:id",
    //   {
    //     schema: {
    //       body: changeUserBodySchema,
    //       params: idParamSchema,
    //     },
    //   },
    //   async function (request, reply): Promise<UserEntity> {}
    // );
};
exports.default = plugin;
//# sourceMappingURL=index.js.map