import { z } from "zod";
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  helloFromAuth: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createUser: publicProcedure
    .input(z.object({ name: z.string().min(1) ,email:z.string(),password:z.string()}))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password
        },
      });
    }),

  login: publicProcedure.input(z.object({email:z.string(),password:z.string()})).query(async ({ ctx,input }) => {
    if(input.email==="" || input.password===""){
      return {message:"Inputs are invalid!"};
    }
    const token = jwt.sign({ email: input.email, password: input.password }, "mysecret", { expiresIn: '1h' });
    return ctx.db.user.findFirst({where:{
        email:input.email,
        password:input.password
      }}).then((user)=>{
        if(!user){
          return new TRPCError({ code: 'UNAUTHORIZED' });;
        }
        return {token:token,userId:user.id};
      }).catch((e)=>{console.log(e);});;
  }),

  verifyCode: publicProcedure.input(z.object({code:z.string()})).mutation(async ({ ctx, input }) => {
    if(input.code==="12345678"){
      return true;
    }else{
      return false;
    }
  }),
});
