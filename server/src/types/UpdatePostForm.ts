import { Field, ID, InputType } from 'type-graphql'

@InputType()
export class UpdatePostForm {
  @Field((_type) => ID)
  id!: number

  @Field()
  title: string

  @Field()
  text: string
}
