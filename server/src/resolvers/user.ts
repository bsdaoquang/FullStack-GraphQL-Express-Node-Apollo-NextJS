import argon2 from 'argon2'
import { User } from '../entities'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { UserMutationResponse } from '../types'

@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMutationResponse, { nullable: true })
  async register(
    @Arg('email') email: string,
    @Arg('username') username: string,
    @Arg('password') password: string,
  ): Promise<User | UserMutationResponse> {
    try {
      const existingUser = await User.findOne<User>({
        where: [{ username }, { email }], //check username and email is existing
      })
      if (existingUser) {
        return {
          code: 400,
          message: 'Duplicate username or email',
          success: false,
          errors: [
            {
              field: existingUser.username === username ? 'username' : 'email',
              message: 'User name or email aready',
            },
          ],
        }
      } else {
        const hashPass = await argon2.hash(password)
        const newUser = User.create({
          username,
          password: hashPass,
          email,
        })

        //regis success
        return {
          code: 200,
          success: true,
          message: 'Register successfully',
          user: await User.save(newUser),
        }
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        message: `Internal server error: ${error.message}`,
        success: false,
      }
    }
  }
}
