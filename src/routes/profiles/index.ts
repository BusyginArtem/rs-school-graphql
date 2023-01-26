import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createProfileBodySchema, changeProfileBodySchema } from "./schema";
import type { ProfileEntity } from "../../utils/DB/entities/DBProfiles";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!profile) {
        throw reply.notFound("Profile not found!");
      }

      return profile;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { userId, memberTypeId } = request.body;

      const profile = await fastify.db.profiles.findOne({
        key: "userId",
        equals: userId,
      });

      if (profile) {
        throw reply.badRequest("User profile exist!");
      }

      const memberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: memberTypeId,
      });

      if (memberType) {
        throw reply.badRequest("Member type doesn't exist!");
      }

      return await fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!profile) {
        throw reply.notFound("Profile not found!");
      }

      return profile;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!profile) {
        throw reply.notFound("Profile not found!");
      }

      return profile;
    }
  );
};

export default plugin;
