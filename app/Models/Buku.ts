import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column,HasMany,hasMany,manyToMany,ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Kategori from './Kategori'
import User from './User'
import Peminjaman from './Peminjaman'

export default class Buku extends BaseModel {
  public static table = 'bukus'
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public judul: string

  @column()
  public ringkasan: string

  @column()
  public tahun_terbit: number

  @column()
  public halaman: number

  @column()
  public kategori_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=> Kategori,{
    foreignKey: 'kategori_id'
  })
  public kategori: BelongsTo<typeof Kategori>

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'buku_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'peminjaman'
  })
  public userPeminjam: ManyToMany<typeof User>

  @hasMany(() => Peminjaman,{
    foreignKey: 'buku_id'
  })
  public bukuDipinjam : HasMany<typeof Peminjaman> 
}
