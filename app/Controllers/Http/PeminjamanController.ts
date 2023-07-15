import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Peminjaman from 'App/Models/Peminjaman'

export default class PeminjamanController {
    public async store({params,request,response,auth}:HttpContextContract){
        try {
            const userDataId = auth.user?.id

            const storePeminjamanValidation = schema.create({
                tanggal_pinjam:schema.string(),
                tanggal_kembali:schema.string(),
            })
    
            await request.validate({schema : storePeminjamanValidation})
    
            await Peminjaman.create({
                user_id : userDataId,
                buku_id : params.id,
                tanggal_pinjam : request.input('tanggal_pinjam'),
                tanggal_kembali : request.input('tanggal_kembali')
            })
    
            response.ok({
                message: 'berhasil Melakukan peminjaman',
                dataID: userDataId
            })
        } catch (error) {
            if(error.guard){
                return response.badRequest({
                    message: "Update Data Gagal",
                    error: error
                })
            }
            return response.badRequest({
                message: "Gagal",
                error: error
            })
        }
        
    }

    public async index({response}:HttpContextContract){
        const dataPeminjaman = await Peminjaman.query().preload('bukus').preload('users')

        response.ok({
            message : 'Data semua peminjaman',
            data : dataPeminjaman
        })
    }

    public async show({response,params}:HttpContextContract){
        const detailPeminjaman = await Peminjaman.query().where('id',params.id).preload('bukus').preload('users').firstOrFail()

        response.ok({
            message: "berhasil get data peminjaman by id",
            data : detailPeminjaman
        })
    }

    public async update({request,response,params}:HttpContextContract){
        // const userDataId = auth.user?.id

            const storePeminjamanValidation = schema.create({
                tanggal_pinjam:schema.string(),
                tanggal_kembali:schema.string(),
            })
    
            const UpdateData = await request.validate({schema : storePeminjamanValidation})
        
        
        
        // const payloadValidationController = await request.validate(KategoriValidator)
        
        const updateID = params.id

        // Cara Query
        // const updatedRowsCount = await Database.from('kategoris').where('id',updateID).update(payloadValidationController)

        // Cara ORM
        const updatedRowsCount = await Peminjaman.query().where('id',updateID).update(UpdateData).firstOrFail()

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
        const deletedRowsCount = await Peminjaman.findOrFail(updateID)
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
