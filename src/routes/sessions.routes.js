const {Router} = require('express')

const SessionsControllers = require('../controllers/SessionsControllers')

const sessionsControllers = new SessionsControllers()
const sessionRoutes = Router()

sessionRoutes.post('/', sessionsControllers.create)

module.exports = sessionRoutes