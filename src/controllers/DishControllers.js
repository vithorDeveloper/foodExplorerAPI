const AppError = require("../utils/AppError")
const knex = require("../database/knex/index")
const DiskStorage = require("../providers/DiskStorage")

const diskStorage = new DiskStorage()
class DishControllers {

  async create(req, res) {
    const { title, category, price, description, ingredients } = req.body

      console.log(title, category, price, description, ingredients)

    const {filename: image} = req.file

    const filename = await diskStorage.saveFile(image)

    console.log(image)

      if(!title || !category || !price || !description || !ingredients) {
          throw new AppError("preencha todos os campos")
      }

      const [dishId] = await knex("dishes").insert({
        image: filename,
        title,
        category,
        price,
        description
      })
  
      const ingredientsInsert = ingredients.map( name => {
        return{
          dish_id: dishId,
          name
        }
      })

      await knex("ingredients").insert(ingredientsInsert)

    return res.status(200).json()
  }

  async update(req, res) {
    const { title, category, price, description} = req.body
    const { id } = req.params
    const {filename: image} = req.file

    const filename = await diskStorage.saveFile(image)

    const dishInfo = await knex("dishes")
    .where({id})
    .first()

    dishInfo.title = title ?? dishInfo.title
    dishInfo.category = category ?? dishInfo.category
    dishInfo.price = price ?? dishInfo.price
    dishInfo.description = description ?? dishInfo.description

    await knex("dishes").where("id", dishInfo.id).update({
      image: filename,
      title,
      category,
      price,
      description
    })

    return res.status(200).json()
  }

  async show(req, res) {
    const { title, ingredients } = req.query

    let dishes;

    const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
    const allIngredients = await knex("ingredients").select("*");
    const names = allIngredients.map(item => item.name);

    const checkIngredient = filterIngredients.every(ingredient => names.includes(ingredient));

    if(checkIngredient) {

    dishes = await knex("ingredients")
    .select([
        "dishes.id",
        "dishes.title",
        "dishes.image",
        "dishes.description",
        "dishes.price",
        "dishes.category"
    ])
    .whereIn("ingredients.name", filterIngredients)
    .innerJoin("dishes", "dishes.id", "ingredients.dish_id")

    } else if (!checkIngredient && title) {
      dishes = await knex("dishes").select("*")
        .whereLike("title", `%${title}%`)
        .orderBy("price");
    } 
    else {
        dishes = [];
  }

    const selectIngredient = await knex("ingredients").select("*");
    const dishesWithIngredient = dishes.map(dish => {
    const dishIngredient = selectIngredient.filter(ingredient => ingredient.dish_id === dish.id);

    return {
        ...dish,
        ingredients: dishIngredient
    }
  })

  return res.json(dishesWithIngredient);
}

  async index(req, res) {
    const { id } = req.params

      const dishes = await knex("dishes")
      .where({id})
      .select("*")

      const dishId = dishes.map(dish => dish.id)

      const ingredients = await knex("ingredients")
      .whereIn("dish_id", dishId)
      .orderBy("name")

      const dishesWithIngredients = dishes.map(dish => ({
            ...dish,
            ingredients: ingredients.filter(ingredient => ingredient.dish_id === dish.id)
      }))

      return res.status(200).json(dishesWithIngredients)
  }
  
  async delete(req, res) {
    const { id } = req.params

      await knex("dishes").where({id}).del()

    return res.status(200).json("prato deletado")
  }
}

module.exports = DishControllers