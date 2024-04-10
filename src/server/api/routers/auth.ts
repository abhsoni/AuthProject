import { z } from "zod";
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
type Category = {
  id: number
  categoryName: string
  createdAt: Date
  updatedAt: Date
}

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
      const cat:Category[]=[{id:60,categoryName:"Shoes- JORDAN",createdAt:new Date(),updatedAt:new Date()}];
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
    }),
  updateUserCategories: publicProcedure
  .input(
    z.object({
      userID: z.string().min(1),
      categoryId: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // const { userID, categories } = input;
    console.log(JSON.stringify(input.categoryId));

    try {
      // Check if the user exists
      let user = await ctx.db.user.findUnique({
        where: { id: parseInt(input.userID) },
        select:{categories:true,name:true,email:true}
      });
      console.log(input.userID);
      console.log(JSON.stringify(user));
      console.log(JSON.stringify(input.categoryId));
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found.",
        });
      }
      let updatedCategories = [...user.categories];
      if (updatedCategories.includes(input.categoryId)) {
        console.log("include");
        updatedCategories = updatedCategories.filter(cat => cat !== input.categoryId);
      }else{
        updatedCategories.push(input.categoryId);
      }
      console.log(JSON.stringify(updatedCategories));
      // Update the user's categories
      await ctx.db.user.update({
        where: { id: parseInt(input.userID) },
        data: { name:"Maharaj",categories:{set: updatedCategories.map(category => (category)),} },
      });

      return updatedCategories; // Successfully updated user categories
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update user categories.",
        
      });
    }
  }),
  deleteAllUser: publicProcedure
  .mutation(async ({ ctx }) => {
    try {
      // Delete all users from the database
      await ctx.db.user.deleteMany();

      return true; // Successfully deleted all users
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete all users.",
      });
    }
  }),
  
  getUserByID:publicProcedure.input(z.object({ userID: z.string().min(1)})).query(async ({ctx,input})=>{
    return await ctx.db.user.findUnique({where:{id:parseInt(input.userID)},select: {name:true,id:true,categories:true},}).then((user)=>{
      if(!user){
        return new TRPCError({ code: 'UNAUTHORIZED',message:"User not found." });;
      }
      return user;
    })
  }),

  login: publicProcedure.input(z.object({email:z.string(),password:z.string()})).query(async ({ ctx,input }) => {
    if(input.email==="" || input.password===""){
      throw new TRPCError({code:'BAD_REQUEST',message:"Invalid input"});
    }
    
    const token = jwt.sign({ email: input.email, password: input.password }, "mysecret", { expiresIn: '1h' });
    return ctx.db.user.findFirst({where:{
        email:input.email,
        password:input.password
      }}).then((user)=>{
        if(!user){
          return new TRPCError({ code: 'UNAUTHORIZED',message:"User not found." });;
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
