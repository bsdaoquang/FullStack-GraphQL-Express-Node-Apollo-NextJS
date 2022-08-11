require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'

const connectDB = async () => {
  await createConnection({
    type: 'postgres',
    database: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
  })

  const app = express()

  app.listen(4000, () => console.log('Server stated on port 4000'))
}

connectDB().catch((error) => console.log(error))
