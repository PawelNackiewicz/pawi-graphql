import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { CREATE_USER } from "./Mutations/User";
import { GET_ALL_USERS } from "./Queries/User";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllUsers: GET_ALL_USERS,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: CREATE_USER,
    // deleteUser: DELETE_USER,
    // updatePassword: UPDATE_PASSWORD,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});