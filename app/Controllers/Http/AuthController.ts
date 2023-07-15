import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
    public async register({request,response}:HttpContextContract){
        try {
            const registValidation = schema.create({
                email:schema.string([
                    rules.email(),
                    rules.unique({
                        table: 'users',
                        column: 'email'
                    })
                ]),
                  role:schema.enum(
                    ['admin', 'user',] as const
                  ),
                  nama:schema.string([
                    rules.nullable()
                  ]),
                  password:schema.string([
                    rules.minLength(8),
                ]),
            })

            const payloadValidationController = await request.validate({schema : registValidation})

            const newUser = await User.create(payloadValidationController)

            // const email = request.input('email')
            const otp_code = Math.floor(100000 + Math.random() * 900000)

            await Database.table('otp_codes').insert({otp_code:otp_code, user_id: newUser.id})

            await Mail.send((message) => {
                message
                  .from('admin@todoapi.com')
                  .to(newUser.email)
                  .subject('Welcome Onboard!')
                  .htmlView('emails/otp_verification', { otp_code })
              })

            if(newUser.role == 'admin'){
                return response.created({
                    message: "register berhasil, silahkan lakukan verifikasi!",
                    data : newUser,
                    otp_code:otp_code
                })
            } else{
                return response.created({
                    message: "register berhasil, silahkan lakukan verifikasi!",
                    data : newUser,
                    // otp_code:otp_code////////////////
                })
            }

            
        } catch (error) {
            if(error.guard){
                return response.badRequest({
                    message: "Gagal",
                    error: error.message
                })
            }
            return response.badRequest({
                message: "Register Gagal",
                error: error.message
            })
        }
    }

    public async login({request,response,auth}:HttpContextContract){
        try {

            const loginValidation = schema.create({
                email:schema.string(),
                password:schema.string([
                    rules.minLength(8),
                ]),
            })

            const payloadValidationController = await request.validate({schema : loginValidation})

            const email = request.input("email")
            const password = request.input("password")

            const token = await auth.use('api').attempt(email,password,{
                expiresIn: '7 days'
            })

            return response.created({
                message: "login berhasil",
                data : payloadValidationController,
                token : token
            })
        } catch (error) {
            if(error.guard){
                return response.badRequest({
                    message: "Login Gagal",
                    error: error
                })
            }
            return response.badRequest({
                message: "Login Gagal",
                error: error
            })
        }
    }

    public async otpConfirmation({request,response}:HttpContextContract){
        try {
            
        const OTPValidation = schema.create({
            otp_code:schema.number(),
            email:schema.string(),
        })

        const payloadValidationController = await request.validate({schema : OTPValidation})

        const email = request.input("email")
        const otp_code = request.input("otp_code")

        let user = await User.findBy('email',email)
        let otpCheck = await Database.query().from('otp_codes').where('otp_code',otp_code).firstOrFail()
        
        if(user?.id == otpCheck.user_id){
            if(user?.isVerified){
                user.isVerified = true
            }
            await user?.save()

            return response.ok({
                message: "Berhasil konfirmasi OTP"
            })
        } else{
            return response.badRequest({
                message: "Gagal Verifikasi OTP",
                data : payloadValidationController
            })
        }
        } catch (error) {
            if(error.guard){
                return response.badRequest({
                    message: "Gagal",
                    error: error.message
                })
            }
            return response.badRequest({
                message: "Verifikasi Gagal",
                error: error.message
            })
        }

    }

    public async me({auth,response}:HttpContextContract){
        const user = auth.user

        return response.ok({
            message : user
        })
    }

    public async updateProfile({auth,request,response}:HttpContextContract){
        const userData = auth.user

        try {
            const profileValidation = schema.create({
                bio:schema.string(),
                alamat:schema.string()
            })

            await request.validate({schema : profileValidation})

            const bio = request.input("bio")
            const alamat = request.input("alamat")

            const persistancePayload = {
                bio,
                alamat
            }

            await userData?.related('profile').updateOrCreate({}, persistancePayload)

            return response.ok({
                message : 'sukses edit profile',
                data: persistancePayload
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
}
