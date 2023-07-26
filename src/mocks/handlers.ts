import { rest } from 'mswx'

const DelayMiddleware = rest.middleware(async (req, res, ctx, next) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return next()
})

export const handlers = [
  rest.get('/ping', (_, res, ctx) => {
    return res(ctx.json({ message: 'pong' }))
  }),
].map(DelayMiddleware)
