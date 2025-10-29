import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const user = await auth.api.getSession({
    headers: opts.headers,
  })

  return {
    db,
    user: user?.user,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Server side caller
export const createCallerFactory = t.createCallerFactory

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: ctx.user,
    },
  })
})

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      message: 'Hello, world!',
    }
  }),
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
