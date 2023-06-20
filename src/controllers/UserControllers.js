const AppError = require("../utils/AppError")
const {hash} = require("bcryptjs")

const knex = require("../database/knex/index")

class UserControllers{

  async create(req, res){
    const {name, email, password, isAdm} = req.body

    const emailExists = await knex("users")
    .select("id")
    .where("email", "=", email)
    .first()

    if(emailExists) {
      throw new AppError("Email já existe!")
    }

    const hashedPassword = await hash(password, 8)

    await knex("users").insert({
      name, email, password:hashedPassword, isAdm
    })

    return res.status(201).json()
  }

  async update(req, res){
    const user_id = req.user.id
    const { isAdm } = req.body

    const checkUser  = await knex("users").where({id: user_id}).first()

    if(!checkUser){
      throw new AppError("usuario não encontrado")
    }

    checkUser.isAdm = isAdm ?? checkUser.isAdm

    await knex("users").where({id: user_id}).update({
      isAdm: checkUser.isAdm
    })

    return response.json()
  }
}

module.exports = UserControllers