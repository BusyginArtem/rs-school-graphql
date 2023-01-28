import {
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLObjectType,
} from "graphql";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { UserType, ProfileType, newUserType, PostType } from "./schemaTypes";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { PostEntity } from "../../utils/DB/entities/DBPosts";

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
        return await context.db.profiles.findMany();
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
    // memberTypes: {
    // 	type: new GraphQLList(MemberType),
    // },
    // memberType: {
    // 	type: MemberType,
    // 	args: { id: { type: GraphQLString } },
    // },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: { input: { type: newUserType } },
      async resolve(
        _,
        { input }: Record<"input", Omit<UserEntity, "id">>,
        context
      ) {},
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
