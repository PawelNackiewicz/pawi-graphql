import { ApolloServer } from "apollo-server";
import { getUser } from "./auth/auth";
import { typeDefs } from "./typeDefs";
import  {resolvers} from './resolvers'
import { ReadableUser } from "./auth/types";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()
export interface Context {
  prisma: PrismaClient,
  user: ReadableUser,
  req: Request,
  res: Response
}

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },  
  context: async({req, res}): Promise<Context> => {
    const token = req.headers.cookie.replace('token=', '') || '';
    const user = await getUser(token, prisma)
    return {prisma, user, req, res}
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});