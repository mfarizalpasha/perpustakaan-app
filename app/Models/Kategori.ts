import { DateTime } from 'luxon'
import { BaseModel, column, hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'
import Buku from './Buku'

export default class Kategori extends BaseModel {
  public static table = 'kategoris'

  @column({ isPrimary: true })
  public id: number

  @column()
  public nama:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=> Buku,{
    foreignKey:'kategori_id'
  })
  public bukus: HasMany<typeof Buku> 
}
