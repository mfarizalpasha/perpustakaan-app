import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Verify {
  public async handle({response,auth}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let isVerified = auth.user?.isVerified
    if(auth.user?.role == 'admin'){
      if(isVerified){
        await next()
      } else {
        return response.unauthorized({
          message : "belum terverifikasi"
        })
      }
    } else if(auth.user?.role == 'admin') {
      return response.unauthorized({
        message : "Maaf, selain admin dilarang melakukan verifikasi!"
      })
    }
  }
}
