require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import { HelloResolver, UserResolver } from './resolvers'
import { Post, User } from './entities'

const connectDB = async () => {
  await createConnection({
    type: 'postgres',
    database: 'postgres',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  })

  const app = express()

  const aplloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
  })

  await aplloServer.start()

  app.set('trust proxy', 1)

  aplloServer.applyMiddleware({ app, cors: false })

  const PORT = process.env.PORT || 4000

  app.listen(PORT, () =>
    console.log(
      `Server started on ${PORT}, GraphQL server started on localhost: http://localhost:${PORT}${aplloServer.graphqlPath}`,
    ),
  )
}

connectDB().catch((error) => console.log(error))
