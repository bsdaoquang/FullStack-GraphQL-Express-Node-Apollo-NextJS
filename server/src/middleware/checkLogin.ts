import { Context } from '../types'
import { MiddlewareFn } from 'type-graphql'
import { AuthenticationError } from 'apollo-server-express'

export const CheckLogin: MiddlewareFn<Context> = (
  { context: { req } },
  next,
) => {
  if (!req.session.userId) {
    throw new AuthenticationError('Not login')
  }

  return next()
}
