
import { PrismaClient } from "@prisma/client";
import { GraphQLID, GraphQLString } from "graphql";
import { UserType } from "../Types/User";
import * as bcrypt from "bcrypt";
import { MessageType } from "../Types/Message";

const prisma = new PrismaClient();

async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

export const CREATE_USER = {
  type: UserType,
  args: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent: any, args: any) {
    const { firstName, lastName, email, password, role } = args;
    const hash = await hashPassword(password);
    await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hash,
            role,
            status: 'ACTIVE',
          },
    })
    return args;
  },
};

export const DELETE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent: any, args: any) {
    const id = args.id;
    await prisma.user.delete(({
      where: {
        id
      }
    }))
    return { successful: true, message: "DELETE WORKED" };
  },
};