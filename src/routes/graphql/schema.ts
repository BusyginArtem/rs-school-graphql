import {
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
//
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import {
  UserType,
  ProfileType,
  addUserInput,
  PostType,
  MemberType,
  newPostType,
  newProfileType,
  updateUserInput,
  updateProfileType,
  updatePostType,
  updateMemberType,
  subscribeUserType,
  // EntitiesType,
  // Entities,
} from "./schemaTypes";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const query = new GraphQLObjectType({
  name: "query",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      async resolve(_, __, context): Promise<UserEntity[]> {
        return await context.db.users.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(_, { id }, context): Promise<UserEntity> {
        return await context.db.users.findOne({
          key: "id",
          equals: id,
        });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      async resolve(_, __, context): Promise<ProfileEntity[]> {
        return await context.db.profiles.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: GraphQLID } },
      async resolve(_, { id }, context): Promise<ProfileEntity> {
        return await context.db.profiles.findOne({
          key: "id",
          equals: id,
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(_, __, context): Promise<PostEntity[]> {
        return await context.db.posts.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      async resolve(_, { id }, context): Promise<PostEntity> {
        return await context.db.posts.findOne({
          key: "id",
          equals: id,
        });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      async resolve(_, __, context): Promise<MemberTypeEntity[]> {
        return await context.db.memberTypes.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: GraphQLString } },
      async resolve(_, { id }, context): Promise<MemberTypeEntity> {
        return await context.db.memberTypes.findOne({
          key: "id",
          equals: id,
        });
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addUser: {
      type: UserType,
      args: { input: { type: addUserInput } },
      async resolve(
        _,
        { input }: Record<"input", UserEntity>,
        context
      ): Promise<UserEntity> {
        return await context.db.users.create(input);
      },
    },
    addPost: {
      type: PostType,
      args: { input: { type: newPostType } },
      async resolve(
        _,
        { input }: Record<"input", PostEntity>,
        context
      ): Promise<PostEntity> {
        return await context.db.posts.create(input);
      },
    },
    updatePost: {
      type: PostType,
      args: { input: { type: updatePostType } },
      async resolve(
        _,
        { input }: Record<"input", PostEntity>,
        context
      ): Promise<PostEntity> {
        const { id, ...rest } = input;

        return await context.db.posts.change(id, rest);
      },
    },
    addProfile: {
      type: ProfileType,
      args: { input: { type: newProfileType } },
      async resolve(
        _,
        { input }: Record<"input", ProfileEntity>,
        context
      ): Promise<ProfileEntity> {
        return await context.db.profiles.create(input);
      },
    },
    updateUser: {
      type: UserType,
      args: { input: { type: updateUserInput } },
      async resolve(
        _,
        { input }: Record<"input", UserEntity>,
        context
      ): Promise<UserEntity> {
        const { id, ...rest } = input;

        return context.db.users.change(id, rest);
      },
    },
    updateProfile: {
      type: ProfileType,
      args: { input: { type: updateProfileType } },
      async resolve(
        _,
        { input }: Record<"input", ProfileEntity>,
        context
      ): Promise<ProfileEntity> {
        const { id, ...rest } = input;

        return context.db.profiles.change(id, rest);
      },
    },
    updateMemberType: {
      type: MemberType,
      args: { input: { type: updateMemberType } },
      async resolve(
        _,
        { input }: Record<"input", MemberTypeEntity>,
        context
      ): Promise<MemberTypeEntity> {
        const { id, ...rest } = input;

        return context.db.memberTypes.change(id, rest);
      },
    },
    subscribeUser: {
      type: UserType,
      args: { input: { type: subscribeUserType } },
      async resolve(
        _,
        { input }: Record<"input", Pick<PostEntity, "id" | "userId">>,
        context
      ): Promise<UserEntity> {
        const { id, userId } = input;

        const subscriber = await context.db.users.findOne({
          key: "id",
          equals: id,
        });

        const user = await context.db.users.findOne({
          key: "id",
          equals: userId,
        });

        if (subscriber.subscribedToUserIds.includes(subscriber.id)) {
          return subscriber;
        } else {
          await context.db.users.change(user.id, {
            subscribedToUserIds: [...user.subscribedToUserIds, subscriber.id],
          });

          return context.db.users.change(subscriber.id, {
            subscribedToUserIds: [...subscriber.subscribedToUserIds, user.id],
          });
        }
      },
    },
    unSubscribeUser: {
      type: UserType,
      args: { input: { type: subscribeUserType } },
      async resolve(
        _,
        { input }: Record<"input", Pick<PostEntity, "id" | "userId">>,
        context
      ): Promise<UserEntity> {
        const { id, userId } = input;

        const subscriber = await context.db.users.findOne({
          key: "id",
          equals: id,
        });

        const user = await context.db.users.findOne({
          key: "id",
          equals: userId,
        });

        if (user.subscribedToUserIds.includes(subscriber.id)) {
          await context.db.users.change(user.id, {
            subscribedToUserIds: user.subscribedToUserIds.filter(
              (id: string) => id !== subscriber.id
            ),
          });

          return context.db.users.change(subscriber.id, {
            subscribedToUserIds: subscriber.subscribedToUserIds.filter(
              (id: string) => id !== user.id
            ),
          });
        } else {
          return subscriber;
        }
      },
    },
  },
});

export const graphqlSchema = new GraphQLSchema({
  query,
  mutation,
});

export const graphqlBodySchema = {
  type: "object",
  properties: {
    mutation: { type: "string" },
    query: { type: "string" },
    variables: {
      type: "object",
    },
  },
  oneOf: [
    {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string" },
        variables: {
          type: "object",
        },
      },
      additionalProperties: false,
    },
    {
      type: "object",
      required: ["mutation"],
      properties: {
        mutation: { type: "string" },
        variables: {
          type: "object",
        },
      },
      additionalProperties: false,
    },
  ],
} as const;
