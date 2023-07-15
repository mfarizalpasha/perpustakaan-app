import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BukuValidator from 'App/Validators/BukuValidator'
import Buku from 'App/Models/Buku'

export default class BooksController {
    public async store({request,response}:HttpContextContract){
        
        const payloadValidationController = await request.validate(BukuValidator)

        await Buku.create(payloadValidationController)

        return response.status(200).json({
            message:"Data berhasil ditambahkan!",
            data:payloadValidationController
        })
    }

    public async index({response}:HttpContextContract){
        const dataKategoris = await Buku.query().preload('kategori')

        return response.status(200).json({
            message:"Data berhasil dibaca",
            data: dataKategoris
        })
    }

    public async show({response,params}:HttpContextContract){
        const updateID = params.id
        
        const dataKategorisID = await Buku.query().where('id',updateID).preload('kategori').preload('userPeminjam').preload('bukuDipinjam').firstOrFail()

        return response.status(200).json({
            message:"berhasil get data peminjaman",
            data: dataKategorisID
        })
    }

    public async update({request,response,params}:HttpContextContract){
        const payloadValidationController = await request.validate(BukuValidator)
        
        const updateID = params.id

        const updatedRowsCount = await Buku.query().where('id',updateID).update(payloadValidationController).firstOrFail()

        return response.status(200).json({
            message:"Data pada id "+ updateID + " berhasil diupdate",
            data: updatedRowsCount
        })
    }

    public async destroy({response,params}:HttpContextContract){
        const updateID = params.id

        // Cara query Builder
        // const deletedRowsCount = await Database.from('bukus').where('id', updateID).delete()
        
        // Cara ORM
        const deletedRowsCount = await Buku.findOrFail(updateID)
        await deletedRowsCount.delete()

        if(!deletedRowsCount){
            return response.status(400).json({
                message:"Data pada id "+ updateID + " tidak ada"
           })
        }

        return response.status(200).json({
            message:"Data pada id "+ updateID + " berhasil dihapus",
            data: deletedRowsCount
        }) 
    }
}
