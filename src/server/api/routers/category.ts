import { z } from "zod";
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  helloFromCategory: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createCategory: publicProcedure
    .input(z.object({ categoryName: z.string().min(1)}))
    .mutation(async ({ ctx, input }) => {
      const authHeader = ctx.headers.get("Authorization");
      const token = authHeader?.split(" ")[1];
      let decodedToken;
      try {
        decodedToken = jwt.verify(token?token:"", "omnamahshivaay");
      } catch {
        throw new TRPCError({ message:"Token not validated! Token maybe tempered!",code: 'UNAUTHORIZED' });;
      }
      if (!decodedToken) {
        throw new TRPCError({ message:"Decoded token is not valid!",code: 'UNAUTHORIZED' });;
      }
      
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.category.create({
        data: {
          categoryName: input.categoryName,
        },
      });
    }),

  getCategories: publicProcedure.query(({ ctx }) => {
    // const authHeader = ctx.headers.get("Authorization");
    // const token = authHeader?.split(" ")[1];
    // let decodedToken;
    // try {
    //   decodedToken = jwt.verify(token?token:"", "omnamahshivaay");
    // } catch {
    //   throw new TRPCError({ message:"Token not verified!",code: 'UNAUTHORIZED' });;
    // }
    // if (!decodedToken) {
    //   throw new TRPCError({ message:"Decoded token is not valid!",code: 'UNAUTHORIZED' });;
    // }
    return ctx.db.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
