const controller = require('../controllers/vendas')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

module.exports = (app) => {
  app.get('/vendas',auth, controller.getVendas)
  app.post('/vendas',auth, controller.createVenda)
  app.patch('/vendas/:id',auth, controller.updateVenda)
  app.delete('/vendas/:id',auth,admin, controller.deleteVenda)
}