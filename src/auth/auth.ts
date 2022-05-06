import { prisma, PrismaClient, Role, User } from "@prisma/client";
import * as moment from "moment";
import * as crypto from "crypto";
import { CreateUserTokenDto, ReadableUser } from "./types";
import { Context } from "../server";

const getReadableUser = ({ password, ...user }: User): ReadableUser => user;

export async function signUser(user: User, prisma: PrismaClient): Promise<string> {
  const token = await generateToken();
  const expireAt = moment().add(1, "day").toISOString();

  await create({
    token,
    expireAt,
    userId: user.id,
  }, prisma);
  return token;
}

async function generateToken(): Promise<string> {
  return crypto.randomBytes(48).toString("hex");
}

async function create(createUserTokenDto: CreateUserTokenDto, prisma: PrismaClient) {
  return await prisma.token.create({ data: createUserTokenDto });
}

export async function getUser(token: string, prisma: PrismaClient) {
  const foundToken = await prisma.token.findUnique({
    where: {
      token,
    },
  });
  if (foundToken) {
    if(!tokenActinve(foundToken.expireAt)) throw new Error('ForbiddenException')
    const user = await prisma.user.findUnique({where: { id: foundToken.userId}})
    return getReadableUser(user)
  }
  throw new Error('Token not found')
}

function tokenActinve(expireAt: string) {
  return new Date(expireAt) > new Date(Date.now());
}

export const authenticated = (next: any) => (root: any, args: any, context: Context, info: any) => {
  if (!context.user) {
    throw new Error('must authenticate')
  }
  return next(root, args, context, info)
}

export const authorized = (role: Role, next: any) => (root: any, args: any, context: Context, info: any) => {
  if (context.user.role !== role) {
    throw new Error(`you must have ${role} role`)
  }
  return next(root, args, context, info)
}