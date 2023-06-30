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

      const ingredientsArray = ingredients.split(",");
  
      const ingredientsInsert = ingredientsArray.map( name => {
        return{
          dish_id: dishId,
          name
        }
      })

      await knex("ingredients").insert(ingredientsInsert)

    return res.status(200).json()
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, category, price, description, ingredients } = req.body;
      const { filename: image } = req.file;

      if (!image) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const filename = await diskStorage.saveFile(image.filename);

      const dishInfo = await knex('dishes').where({ id }).first();

      dishInfo.title = title || dishInfo.title;
      dishInfo.category = category || dishInfo.category;
      dishInfo.price = price || dishInfo.price;
      dishInfo.description = description || dishInfo.description;
      dishInfo.ingredients = JSON.parse(ingredients) || dishInfo.ingredients;
      dishInfo.image = filename || dishInfo.image;

      await knex('dishes').where('id', dishInfo.id).update({
        image: filename,
        title,
        category,
        price,
        description,
        ingredients: JSON.stringify(dishInfo.ingredients),
      });

        return res.status(200).json();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar o prato' });
      }
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
        dishes = await knex("dishes").select("*")
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
    const { id } = req.params;
  
    const dish = await knex("dishes").where({ id }).first();
  
    if (!dish) {
      return res.status(404).json({ error: "Este prato não existe" });
    }
  
    const ingredients = await knex("ingredients")
      .whereIn("dish_id", [id])
      .orderBy("name");
  
    const dishesWithIngredients = {
      ...dish,
      ingredients
    };
  
    return res.status(200).json(dishesWithIngredients);
  }
  
  async delete(req, res) {
    const { id } = req.params

      await knex("dishes").where({id}).del()

    return res.status(200).json("prato deletado")
  }
}
module.exports = DishControllers