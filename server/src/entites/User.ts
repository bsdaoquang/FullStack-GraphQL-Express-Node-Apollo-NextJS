import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity() //tạo 1 bảng trong csdl
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() //Tự động tăng lên trong csdl
  id!: number //!nghĩa là không được null

  @Column(
    { unique: true }, //Gía trị duy nhất
  ) //tạo cột
  username!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  createAt: Date

  @Column()
  updatedAt: Date
}
