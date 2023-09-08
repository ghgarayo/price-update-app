import { knex as setupKnex, Knex } from 'knex'

import { env } from './env'

export const config: Knex.Config = {
  client: 'mysql',
  connection: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
  migrations: {
    extension: 'ts',
    directory: './src/db/migrations',
  },
}

export const knex = setupKnex(config)
