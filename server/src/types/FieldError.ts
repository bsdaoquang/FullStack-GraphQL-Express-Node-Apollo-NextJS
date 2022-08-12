/*
  hiển thị lỗi của người dùng khi đăng ký
  ví dụ như password short or long
*/

import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}
