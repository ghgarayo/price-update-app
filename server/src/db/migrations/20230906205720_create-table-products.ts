import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.bigInteger('code').primary().notNullable()
    table.string('name', 100).notNullable()
    table.decimal('cost_price', 9, 2).notNullable()
    table.decimal('sales_price', 9, 2).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('products')
}
