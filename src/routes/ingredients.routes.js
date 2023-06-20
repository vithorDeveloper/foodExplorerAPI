const { Router } = require('express')

const IngredientsController = require('../controllers/IngredientControllers')

const ingredientRoutes = Router()
const ingredientController = new IngredientsController()

ingredientRoutes.get("/:id", ingredientController.index)

module.exports = ingredientRoutes