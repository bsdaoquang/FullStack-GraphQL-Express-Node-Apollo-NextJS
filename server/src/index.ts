require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import { HelloResolver, UserResolver } from './resolvers'
import { Post, User } from './entities'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import { COOKIE_NAME, __prop__ } from './constants'
import { Context } from './types'

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

  //session cookie store
  //MonggoDB connection
  const monggoDBUrl = `mongodb+srv://${process.env.DB_MONGO_SECTION_USERNAME}:${process.env.DB_MONGO_SECTION_PASSWORD}@fullstackgraphqlsecctio.eqtznbe.mongodb.net/?retryWrites=true&w=majority`
  await mongoose.connect(monggoDBUrl)
  //console.log(`MongoDB connected`)

  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({
        mongoUrl: monggoDBUrl,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60, //on hour,
        httpOnly: true, //js frond end can't read
        secure: __prop__, //cookie only work on https
        sameSite: 'lax', //project
      },
      secret: process.env.SESSION_SECRET as string,
      saveUninitialized: false,
      resave: false,
    }),
  )

  const aplloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),

    //create req to get from every where
    context: ({ req, res }): Context => ({ req, res }),
  })

  await aplloServer.start()

  aplloServer.applyMiddleware({ app, cors: false })

  const PORT = process.env.PORT || 4000

  app.listen(PORT, () =>
    console.log(
      `Server started on ${PORT}, GraphQL server started on localhost: http://localhost:${PORT}${aplloServer.graphqlPath}`,
    ),
  )
}

connectDB().catch((error) => console.log(error))
