import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import KategoriValidator from 'App/Validators/KategoriValidator'
import Kategori from 'App/Models/Kategori'

export default class KategorisController {
    public async store({request,response,auth}:HttpContextContract){
        // untuk mengecek siapa yang login
        const userData = auth.user

        const payloadValidationController = await request.validate(KategoriValidator)

        // Cara Query
        // await Database.table('kategoris').insert(payloadValidationController)

        // Cara ORM
        await Kategori.create(payloadValidationController)

        return response.status(200).json({
            message:"Data berhasil ditambahkan!",
            data:payloadValidationController,
            user : userData
        })
    }

    public async index({response}:HttpContextContract){
        // Cara Query
        // const dataKategoris = await Database.from('kategoris').select('*')
        
        // Cara ORM
        const dataKategoris = await Kategori.query().preload('bukus')

        return response.status(200).json({
            message:"Data berhasil dibaca",
            data: dataKategoris
        })
    }

    public async show({response,params}:HttpContextContract){
        // Cara Query
        // const dataKategorisID = await Database.from('kategoris').select('id','nama').where('id',params.id).firstOrFail()

        // Cara ORM
        const dataKategorisID = await Kategori.query().where('id',params.id).preload('bukus').firstOrFail()

        return response.status(200).json({
            message:"Data berhasil dibaca",
            data: dataKategorisID
        })
    }

    public async update({request,response,params}:HttpContextContract){
        const payloadValidationController = await request.validate(KategoriValidator)
        
        const updateID = params.id

        // Cara Query
        // const updatedRowsCount = await Database.from('kategoris').where('id',updateID).update(payloadValidationController)

        // Cara ORM
        const updatedRowsCount = await Kategori.query().where('id',updateID).update(payloadValidationController)

        return response.status(200).json({
            message:"Data pada id "+ updateID + " berhasil diupdate",
            data: updatedRowsCount
        })
    }

    public async destroy({response,params}:HttpContextContract){
        const updateID = params.id

        // Cara Query
        // const deletedRowsCount = await Database.from('kategoris').where('id', updateID).delete()

        // Cara ORM
        const deletedRowsCount = await Kategori.findOrFail(updateID)
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


