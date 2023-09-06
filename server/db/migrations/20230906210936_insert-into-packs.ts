import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex('packs').insert([
    { pack_id: 1000, product_id: 18, qty: 6 },
    { pack_id: 1010, product_id: 24, qty: 1 },
    { pack_id: 1010, product_id: 26, qty: 1 },
    { pack_id: 1020, product_id: 19, qty: 3 },
    { pack_id: 1020, product_id: 21, qty: 3 },
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex('packs')
    .del()
    .where({ code: [1000, 1010, 1020] })
}
