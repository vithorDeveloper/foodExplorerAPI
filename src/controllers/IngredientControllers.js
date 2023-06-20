const knex = require('../database/knex/index')

class IngredientsControllers{
  async index(req, res){
    const dish_id = req.params.id

    const ingredients = await knex("ingredients")
      .where({dish_id})
      .groupBy("name")

      return res.status(200).json(ingredients)
  }
}

module.exports = IngredientsControllers
