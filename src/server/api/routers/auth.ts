import { z } from "zod";

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
    // const user= await ctx.db.user.findFirst({where:{
    //   email:input.email,
    //   password:input.password
    // }});
    // console.log(input);
    // if(user){
    //   return alert("Login Successful!");
    // }
    
    return ctx.db.user.findFirst({where:{
        email:input.email,
        password:input.password
      }});;
  }),

  verifyCode: publicProcedure.input(z.object({code:z.string()})).mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    if(input.code==="12345678"){
      return true;
    }else{
      return false;
    }
  }),
});
