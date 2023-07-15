import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Buku from './Buku'

export default class Peminjaman extends BaseModel {
  public static table = 'peminjaman'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public user_id : number

  @column()
  public buku_id : number

  @column()
  public tanggal_pinjam : Date

  @column()
  public tanggal_kembali : Date

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  public users : BelongsTo<typeof User>

  @belongsTo(() => Buku, {
    foreignKey: 'buku_id'
  })
  public bukus : BelongsTo<typeof Buku>
}
