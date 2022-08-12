/*
  use validate libs to validate user's email add form register  
*/

import { RegisterInput } from '../types'

export const validateRegisterInput = (registerInput: RegisterInput) => {
  //check
  if (!registerInput.email.includes('@')) {
    return {
      message: 'Invalid email',
      errors: [
        {
          field: 'email',
          message: 'Email invalid, please try again',
        },
      ],
    }
  }

  if (registerInput.username.length <= 2) {
    return {
      message: 'Invalid username',
      errors: [
        {
          field: 'error',
          message: 'Length must be greater than 2',
        },
      ],
    }
  }

  if (registerInput.password.length <= 6) {
    return {
      message: 'Invalid password',
      errors: [
        {
          field: 'password',
          message: 'Password length must be greater than 6 symbol',
        },
      ],
    }
  }

  return null
}
