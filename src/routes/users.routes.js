const { Router } = require('express')

const UserControllers = require('../controllers/UserControllers')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const userRoutes = Router()
const userControllers = new UserControllers()

userRoutes.post('/', userControllers.create)
userRoutes.patch('/', ensureAuthenticated, userControllers.update)

module.exports = userRoutes