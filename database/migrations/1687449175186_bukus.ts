import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'bukus'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('judul').unique().notNullable()
      table.text('ringkasan').notNullable()
      table.string('tahun_terbit').notNullable()
      table.integer('halaman').notNullable()
      table
        .integer('kategori_id')
        .unsigned()
        .references('kategoris.id')
        .onDelete('CASCADE').notNullable()
      

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true,true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
