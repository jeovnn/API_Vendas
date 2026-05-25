const service = require('../services/vendas')

async function getVendas (req, res) {
  try {
    const vendas = await service.getVendas()
    return res.status(200).json({
      status: 'ok',
      data: vendas
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

async function createVenda (req, res) {
  try {
    const camposFaltando = []

if (!req.body.total_venda) {
  camposFaltando.push('total_venda')
}

if (camposFaltando.length > 0) {
  return res.status(400).json({
    status: 'error',
    message: `Campos obrigatórios faltando: ${camposFaltando.join(', ')}`
  })
}

if (isNaN(req.body.total_venda) || Number(req.body.total_venda) <= 0) {
  return res.status(400).json({
    status: 'error',
    message: 'O valor total da venda deve ser um número maior que zero'
  })
}
    const venda = await service.createVenda(req.body)
    return res.status(201).json({
      status: 'ok',
      message: 'Venda cadastrada com sucesso',
      data: venda
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

async function updateVenda (req, res) {
  try {
    if (
      Object.hasOwn(req.body, 'total_venda') &&
      (isNaN(req.body.total_venda) || Number(req.body.total_venda) <= 0)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'O valor total da venda deve ser um número maior que zero'
      })
    }

    const vendaExiste = await service.getVendaById({
      id: req.params.id
    })

    if (!vendaExiste.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Venda não encontrada'
      })
    }

    const params = {
      ...req.body,
      id: req.params.id
    }

    const venda = await service.updateVenda(params)

    return res.status(200).json({
      status: 'ok',
      message: 'Venda atualizada com sucesso',
      data: venda
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

async function deleteVenda (req, res) {
  try {
    await service.deleteVenda(req.params)
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

module.exports = {
  getVendas,
  createVenda,
  updateVenda,
  deleteVenda
}