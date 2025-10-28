import { createEnv } from '@t3-oss/env-nextjs'

// CLIENT SIDE ENV VARIABLES GO HERE

export const env = createEnv({
  client: {
    // NEXT_PUBLIC_: z.string().min(1),
  },
  runtimeEnv: {
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
})
