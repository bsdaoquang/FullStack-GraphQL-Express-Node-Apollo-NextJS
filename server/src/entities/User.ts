import { __Type } from 'graphql'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@ObjectType()
@Entity() //tạo 1 bảng trong csdl
export class User extends BaseEntity {
  @Field((__Type) => ID)
  @PrimaryGeneratedColumn() //Tự động tăng lên trong csdl
  id!: number //!nghĩa là không được null

  @Field()
  @Column(
    { unique: true }, //Gía trị duy nhất
  ) //tạo cột
  username!: string

  @Field()
  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Field()
  @CreateDateColumn() //tự động nhận date hiện tại
  createdAt: Date
  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
