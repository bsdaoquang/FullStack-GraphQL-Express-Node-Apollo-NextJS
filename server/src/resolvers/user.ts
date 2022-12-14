import argon2 from 'argon2'
import { User } from '../entities'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import {
  Context,
  LoginInput,
  RegisterInput,
  UserMutationResponse,
} from '../types'
import { validateRegisterInput } from '../utils/validateRegisterInput'
import { COOKIE_NAME } from '../constants'

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
    @Ctx() { req }: Context,
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
        let newUser = User.create({
          username,
          password: hashPass,
          email,
        })

        newUser = await User.save(newUser)
        req.session.userId = newUser.id

        //regis success
        return {
          code: 200,
          success: true,
          message: 'Register successfully',
          user: newUser,
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

    //@Ctx is context
    @Ctx() { req }: Context,
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

        //save session userId === existingUser.id
        //create session and return cookie
        req.session.userId = existingUser.id

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

  @Mutation((_returns) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME)

      req.session.destroy((error) => {
        if (error) {
          console.log('Error destroy cookie')
          resolve(false)
        }

        resolve(true)
      })
    })
  }
}
