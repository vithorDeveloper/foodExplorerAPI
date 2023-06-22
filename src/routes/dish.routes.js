const { Router } = require('express')
const multer = require("multer");
const uploadConfig = require("../config/uploads");

const DishControllers = require("../controllers/DishControllers")
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const upload = multer(uploadConfig.MULTER)

const dishRoutes = Router()
const dishControllers = new DishControllers()

dishRoutes.get("/", dishControllers.show)
dishRoutes.post("/", ensureAuthenticated, upload.single("image"), dishControllers.create)
dishRoutes.put("/:id", ensureAuthenticated, upload.single("image"), dishControllers.update)
dishRoutes.get("/:id", dishControllers.index)
dishRoutes.delete("/:id", ensureAuthenticated, dishControllers.delete)

module.exports = dishRoutes