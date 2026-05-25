const controller = require('../controllers/faturas')
const auth = require('../middlewares/auth')

module.exports = (app) => {
  app.get('/faturas',auth, controller.getFaturas)
  app.post('/faturas',auth, controller.createFatura)
  app.patch('/faturas/:id',auth, controller.updateFatura)
  app.delete('/faturas/:id',auth, controller.deleteFatura)
}