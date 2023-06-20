const knex = require('../database/knex/index')
const AppError = require('../utils/AppError')
const authConfig = require('../config/auth')
const { compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')

class SessionsControllers{

    async create(req, res){
        const {email, password} = req.body

        const user = await knex("users").where({email}).first()

        if(!user){
          throw new AppError("email e/ou senha incorretos")
        }

        const comparePassword = compare(password, user.password)

        if(!comparePassword){
          throw new AppError("email e/ou senha incorretos")
        }

      const { secret, expiresIn } = authConfig.jwt

      const token = sign({}, secret, {
          subject: String(user.id),
          expiresIn
      })

        return res.json({user, token})
    }
}

module.exports = SessionsControllers