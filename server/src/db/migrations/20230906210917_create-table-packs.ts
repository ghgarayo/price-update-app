import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
                    CREATE TABLE packs 
                  (
                    id bigint AUTO_INCREMENT PRIMARY KEY, 
                    pack_id bigint NOT NULL,  
                    product_id bigint NOT NULL, 
                    qty bigint NOT NULL, 
                    
                    CONSTRAINT FOREIGN KEY (pack_id) REFERENCES products(code),
                    CONSTRAINT FOREIGN KEY (product_id) REFERENCES products(code)
                  );
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('packs')
}
