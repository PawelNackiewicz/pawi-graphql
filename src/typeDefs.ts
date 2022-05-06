import { gql } from "apollo-server";

export const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        password: String!
        status: String!
        role: String!
    }

    type Service {
        id: ID!
        name: String!
        duration: String
        price: String
    }

    input SigninInput {
        email: String!
        password: String!
      }

    type Query {
        me: User!
    }

    type AuthUser {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        status: String!
        role: String!
    }

    type Mutation {
        login(input: SigninInput): AuthUser
    }
`