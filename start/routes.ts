/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Route.get('/', async () => {
//   return { hello: 'world', walah : 'Tampan' }
// })

// Route.post('/kategori','KategorisController.store').as('kategori.store')
// Route.post('/buku','BooksController.store').as('book.store')


// Apabila admin, maka harus di verif dulu
Route.group(() =>{

    Route.group(() => {
        //CRUD kategori
        Route.resource('kategori','KategorisController').as('kategori').middleware({'*':['auth','verify']}).apiOnly()
    
        //CRUD buku
        Route.resource('buku','BooksController').as('buku').apiOnly().middleware({'*':['auth','verify']})
    }).prefix('/admin')


    //auth
    Route.group(() => {
        // Saat melakukan register, apabila yang mendaftar admin, maka akan mendapatkan OTP_code, sedangkan apabila user tidak dapat
        Route.post("/register","AuthController.register").as('auth.register')
        Route.post("/login","AuthController.login").as('auth.login')
        Route.post("/verification","AuthController.otpConfirmation").as('auth.verif').middleware('auth')
        Route.get('/me','AuthController.me').middleware('auth')
    }).prefix('/auth')

    //update profile
    Route.post('/profile','AuthController.updateProfile').middleware('auth')

    //Peminjaman Buku
    Route.post('buku/:id/peminjaman',"PeminjamanController.store").middleware('auth')
    Route.get('buku/:id/peminjaman',"PeminjamanController.index").middleware('auth')
    Route.get('buku/peminjaman/:id',"PeminjamanController.show").middleware('auth')
    Route.put('buku/peminjaman/:id',"PeminjamanController.update").middleware('auth')
    Route.delete('buku/peminjaman/:id',"PeminjamanController.destroy").middleware('auth')
}).prefix('api/v1/')
