import * as bcrypt from "bcrypt";
import { authenticated, signUser } from "./auth/auth";
import { Context } from "./server";

export const resolvers = {
  Query: {
    me: authenticated(async (_, __, { user }: Context) => {
      return user;
    }),
  },
  Mutation: {
    async login(_, { input }, { prisma, res }: Context) {
      const foundUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      const correctCredentials =
        foundUser && (await bcrypt.compare(input.password, foundUser.password));

      if (correctCredentials) {
        const token = await signUser(foundUser, prisma);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
        return foundUser;
      }
      throw new Error("Invalid credentials");
    },
  },
};
