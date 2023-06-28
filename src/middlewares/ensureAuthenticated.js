const { verify } = require('jsonwebtoken')
const authConfig = require('../config/auth')
const AppError = require('../utils/AppError')

function ensureAuthenticated(req, res, next){
  const authHeader = req.headers.authorization

  if(!authHeader){
    throw new AppError("JWT token não informado")
  }

  const [, token] = authHeader.split(" ")

  try{
    const { sub: user_id } = verify(token, authConfig.jwt.secret)

    req.user = {
      id: Number(user_id),
    }

    return next()
  }
  catch (error) {
    console.error(error)
    throw new AppError("JWT token invalido")
  }
}

module.exports = ensureAuthenticated