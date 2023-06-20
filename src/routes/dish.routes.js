const { Router } = require('express')

const DishControllers = require("../controllers/DishControllers")
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const dishRoutes = Router()
const dishControllers = new DishControllers()

dishRoutes.get("/", dishControllers.show)
dishRoutes.post("/", ensureAuthenticated, dishControllers.create)
dishRoutes.get("/:id", dishControllers.index)
dishRoutes.put("/:id", ensureAuthenticated, dishControllers.update)
dishRoutes.delete("/:id", ensureAuthenticated, dishControllers.delete)

module.exports = dishRoutes