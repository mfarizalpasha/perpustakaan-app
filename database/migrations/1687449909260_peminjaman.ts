import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Peminjaman extends BaseSchema {
  protected tableName = 'peminjaman'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('buku_id')
        .unsigned()
        .references('bukus.id')
        .onDelete('CASCADE')
        .notNullable()
      table.date('tanggal_pinjam').notNullable()
      table.date('tanggal_kembali').notNullable()
      table.unique(["user_id",'buku_id'])

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
