import argon2 from 'argon2'
import { User } from '../entities'
import { Arg, Mutation, Resolver } from 'type-graphql'

@Resolver()
export class UserResolver {
  @Mutation((_returns) => User, { nullable: true })
  async register(
    @Arg('email') email: string,
    @Arg('username') username: string,
    @Arg('password') password: string,
  ) {
    try {
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return null
      } else {
        const hashPass = await argon2.hash(password)
        const newUser = User.create({
          username,
          password: hashPass,
          email,
        })

        return await User.save(newUser)
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
