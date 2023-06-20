const { Router } = require('express')

const routes = Router()
const usersRouter = require('./users.routes')
const dishesRouter = require('./dish.routes')
const ingredientRouter = require('./ingredients.routes')
const sessionsRouter = require('./sessions.routes')

routes.use('/users', usersRouter)
routes.use('/dishes', dishesRouter)
routes.use('/ingredients', ingredientRouter)
routes.use('/sessions', sessionsRouter)

module.exports = routes