import { Context } from '../types'
import { Ctx, Query, Resolver } from 'type-graphql'

@Resolver()
export class HelloResolver {
  @Query((_returns) => String)
  hello(
    //get and show user id request
    @Ctx() { req }: Context,
  ) {
    console.log(req.session.userId)

    return 'Hello world'
  }
}
