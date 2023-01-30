import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    return await fastify.db.posts.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!post) {
        throw reply.notFound("Post not found!");
      }

      return post;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const { title, content, userId } = request.body;

      if (!title || !content || !userId) {
        throw reply.badRequest(
          "Operation cannot be performed because of some fields are incorrect."
        );
      }

      const user = await fastify.db.users.findOne({
        key: "id",
        equals: userId,
      });

      if (!user) {
        throw reply.notFound("User not found!");
      }

      return await fastify.db.posts.create({
        title,
        content,
        userId,
      });
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        return await fastify.db.posts.delete(request.params.id);
      } catch (error) {
        throw reply.badRequest("Wrong post id!");
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const { params, body } = request;

        return await fastify.db.posts.change(params.id, body);
      } catch (error) {
        throw reply.badRequest("Wrong post id!");
      }
    }
  );
};

export default plugin;
