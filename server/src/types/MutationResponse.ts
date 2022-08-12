/*
  interface GraphQL
  là những cái để những resolver kế thừa
*/

import { Field, InterfaceType } from 'type-graphql'

//Khai báo
@InterfaceType()
export abstract class IMutationResponse {
  @Field()
  code: number

  @Field()
  success: boolean

  //trường này có thể null
  @Field({ nullable: true })
  message?: string
}
