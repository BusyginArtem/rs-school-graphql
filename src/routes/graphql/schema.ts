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
        { input }: Record<"input", Omit<UserEntity, "id">>,
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
