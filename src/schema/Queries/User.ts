import { PrismaClient } from "@prisma/client";
import { GraphQLList } from "graphql";
import { UserType } from "../Types/User";

const prisma = new PrismaClient()

export const GET_ALL_USERS = {
  type: new GraphQLList(UserType),
  resolve() {
    return prisma.user.findMany()
  },
};