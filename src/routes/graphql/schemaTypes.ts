import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
} from "graphql";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

export const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const MemberType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    profile: {
      type: ProfileType,
      async resolve(parent: UserEntity, _, context): Promise<ProfileEntity[]> {
        return await context.db.profiles.findOne({
          key: "userId",
          equals: parent.id,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserSubscribedToType),
      async resolve(parent: UserEntity, _, context) {
        return parent.subscribedToUserIds.map(async (user) => {
          if (user) {
            return await context.db.users.findOne({
              key: "id",
              equals: user,
            });
          }
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(SubscribedToType),
      async resolve(parent: UserEntity, _, context): Promise<UserEntity[]> {
        const users = await context.db.users.findMany();

        return users
          .map((user: UserEntity) => {
            if (user.subscribedToUserIds.includes(parent.id)) {
              return user;
            }

            return null;
          })
          .filter((item: UserEntity | null) => item);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(
        parent: UserEntity,
        _,
        context
      ): Promise<PostEntity | null> {
        const posts = await context.db.posts.findMany({
          key: "userId",
          equals: parent.id,
        });

        if (posts) {
          return posts;
        }

        return null;
      },
    },
    memberType: {
      type: MemberType,
      async resolve(
        parent: UserEntity,
        _,
        context
      ): Promise<MemberTypeEntity | null> {
        const profile = await context.db.profiles.findOne({
          key: "userId",
          equals: parent.id,
        });

        if (profile) {
          const memberType = await context.db.memberTypes.findOne({
            key: "id",
            equals: profile.memberTypeId,
          });

          return memberType;
        }

        return null;
      },
    },
  }),
});

export const UserSubscribedToType = new GraphQLObjectType({
  name: "UserSubscribedToType",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    profile: {
      type: ProfileType,
      async resolve(parent: UserEntity, _, context): Promise<ProfileEntity> {
        return await context.db.profiles.findOne({
          key: "userId",
          equals: parent.id,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserSubscribedToDeepType),
      async resolve(parent: UserEntity, _, context) {
        return parent.subscribedToUserIds.map(async (userId) => {
          return await context.db.users.findOne({
            key: "id",
            equals: userId,
          });
        });
      },
    },
  }),
});

export const UserSubscribedToDeepType = new GraphQLObjectType({
  name: "UserSubscribedToDeepType",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    profile: {
      type: ProfileType,
      async resolve(parent: UserEntity, _, context): Promise<ProfileEntity> {
        return await context.db.profiles.findOne({
          key: "userId",
          equals: parent.id,
        });
      },
    },
  }),
});

export const SubscribedToType = new GraphQLObjectType({
  name: "SubscribedToType",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent: UserEntity, _, context) {
        return context.db.posts.findMany({
          key: "userId",
          equals: parent.id,
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(SubscribedToDeepType),
      async resolve(parent: UserEntity, _, context) {
        return parent.subscribedToUserIds.map(async (user) => {
          if (user) {
            return await context.db.users.findOne({
              key: "id",
              equals: user,
            });
          }
        });
      },
    },
  }),
});

export const SubscribedToDeepType = new GraphQLObjectType({
  name: "SubscribedToDeepType",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent: UserEntity, _, context) {
        return context.db.posts.findMany({
          key: "userId",
          equals: parent.id,
        });
      },
    },
  }),
});

export const addUserInput = new GraphQLInputObjectType({
  name: "addUserInput",
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const updateUserInput = new GraphQLInputObjectType({
  name: "updateUserInput",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

export const newPostType = new GraphQLInputObjectType({
  name: "newPostType",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const newProfileType = new GraphQLInputObjectType({
  name: "newProfileType",
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
});
