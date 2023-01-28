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
    userId: { type: new GraphQLNonNull(GraphQLInt) },
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
  name: "User",
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
    // userSubscribedTo: {
    // 	type: new GraphQLList(),
    // 	async resolve(parent: UserEntity, _, context) {
    // 	},
    // },
    // subscribedToUser: {
    // 	type: new GraphQLList(),
    // 	async resolve(parent: UserEntity, _, context) {
    // 	},
    // },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(parent: UserEntity, _, context): Promise<PostEntity> {
        return await context.db.posts.findMany({
          key: "userId",
          equals: parent.id,
        });
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

export const newUserType = new GraphQLInputObjectType({
  name: "newUserType",
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});
