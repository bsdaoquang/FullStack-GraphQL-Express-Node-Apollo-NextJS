import { Field, InputType } from 'type-graphql'

@InputType()
export class NewPostForm {
  @Field()
  title: string

  @Field()
  text: string
}
