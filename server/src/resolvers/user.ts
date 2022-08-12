import argon2 from 'argon2'
import { User } from '../entities'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { LoginInput, RegisterInput, UserMutationResponse } from '../types'
import { validateRegisterInput } from '../utils/validateRegisterInput'

@Resolver()
export class UserResolver {
  //Register
  //dont need set nonable is true because has user
  @Mutation((_returns) => UserMutationResponse)
  async register(
    // @Arg('email') email: string,
    // @Arg('username') username: string,
    // @Arg('password') password: string,

    // next step thu gon code
    //if form have 50 field, cant create 50 line in code -->
    @Arg('registerInput') registerInput: RegisterInput,
  ): Promise<User | UserMutationResponse> {
    //check validate
    const validateRegisterInputError = validateRegisterInput(registerInput)

    if (validateRegisterInputError !== null) {
      return {
        code: 400,
        success: false,
        ...validateRegisterInputError,
      }
    }

    try {
      const { username, email, password } = registerInput

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

  //Login
  //@Mutation((_returns) => )
  @Mutation((_returns) => UserMutationResponse)
  async login(
    @Arg('loginInput') { usernameOrEmail, password }: LoginInput,
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne({
        where: [{ username: usernameOrEmail }],
      })

      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: 'User not found',
          errors: [
            {
              field: 'usernameOrEmail',
              message: 'username and/or password incorrect',
            },
          ],
        }
      } else {
        const passwordValid = await argon2.verify(
          existingUser.password,
          password,
        )

        if (!passwordValid)
          return {
            code: 400,
            success: false,
            message: 'Login failse',
            errors: [
              {
                field: password,
                message: 'username/email and/or password is not correct',
              },
            ],
          }

        return {
          code: 200,
          success: true,
          message: 'Login successful',
          user: existingUser,
        }
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        success: false,
        message: `Interval server error: ${error.message}`,
      }
    }
  }
}
