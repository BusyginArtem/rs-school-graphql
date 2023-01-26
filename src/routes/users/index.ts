import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from "./schemas";
import type { UserEntity } from "../../utils/DB/entities/DBUsers";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!user) {
        throw reply.notFound("User not found!");
      }

      return user;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { firstName, lastName, email } = request.body;

      if (!firstName || !lastName || !email) {
        throw reply.badRequest(
          "Operation cannot be performed because of some fields are incorrect."
        );
      }

      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw reply.badRequest("Invalid email address!");
      }

      return await fastify.db.users.create({
        firstName,
        lastName,
        email,
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
    async function (request, reply): Promise<UserEntity> {
      try {
        const { params } = request;

        const user = await fastify.db.users.delete(params.id);

        const profile = await fastify.db.profiles.findOne({
          key: "userId",
          equals: params.id,
        });

        if (profile) {
          await fastify.db.profiles.delete(profile.id);
        }

        const posts = await fastify.db.posts.findMany({
          key: "userId",
          equals: params.id,
        });

        if (posts) {
          for (const post of posts) {
            await fastify.db.posts.delete(post.id);
          }
        }

        const subscribers = await fastify.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: user.id,
        });

        for (const subscriber of subscribers) {
          if (subscriber) {
            await fastify.db.users.change(subscriber.id, {
              subscribedToUserIds: subscriber.subscribedToUserIds.filter(
                (id) => id !== user.id
              ),
            });
          }
        }

        return user;
      } catch (error) {
        throw reply.badRequest("Wrong user id!");
      }
    }
  );

  fastify.post(
    "/:id/subscribeTo",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { params, body } = request;

      const subscriber = await fastify.db.users.findOne({
        key: "id",
        equals: params.id,
      });

      if (subscriber) {
        const user = await fastify.db.users.findOne({
          key: "id",
          equals: body.userId,
        });

        if (user) {
          if (user.subscribedToUserIds.includes(subscriber.id)) {
            return user;
          } else {
            return fastify.db.users.change(user.id, {
              subscribedToUserIds: [...user.subscribedToUserIds, subscriber.id],
            });
          }
        } else {
          throw reply.notFound("User not found!");
        }
      } else {
        throw reply.notFound("Subscriber not found!");
      }
    }
  );

  fastify.post(
    "/:id/unsubscribeFrom",
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { params, body } = request;

      const subscriber = await fastify.db.users.findOne({
        key: "id",
        equals: params.id,
      });

      if (subscriber) {
        const user = await fastify.db.users.findOne({
          key: "id",
          equals: body.userId,
        });

        if (user) {
          if (user.subscribedToUserIds.includes(subscriber.id)) {
            return fastify.db.users.change(user.id, {
              subscribedToUserIds: user.subscribedToUserIds.filter(
                (id) => id !== subscriber.id
              ),
            });
          } else {
            throw reply.badRequest("The user is not subscribed!");
          }
        } else {
          throw reply.notFound("User not found!");
        }
      } else {
        throw reply.notFound("Subscriber not found!");
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { params, body } = request;

      const user = await fastify.db.users.findOne({
        key: "id",
        equals: params.id,
      });

      if (user) {
        return fastify.db.users.change(request.params.id, body);
      } else {
        throw reply.badRequest("Wrong user id!");
      }
    }
  );
};

export default plugin;
