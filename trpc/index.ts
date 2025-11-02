import { createCallerFactory, createTRPCContext, createTRPCRouter, protectedProcedure, publicProcedure } from './init'
import { projectRouter } from './routes/project'

export { createTRPCContext, createTRPCRouter, protectedProcedure, publicProcedure }

export const appRouter = createTRPCRouter({
  project: projectRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
