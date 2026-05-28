const service = require('../services/faturas')
const vendaService = require('../services/vendas')

async function getFaturas (req, res) {
  try {
    const faturas = await service.getFaturas({
      usuario_id: req.usuario.id,
      tipo_acesso: req.usuario.tipo_acesso
    })
if (!faturas.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuário não possui faturas'
      })
    }
    return res.status(200).json({
      status: 'ok',
      data: faturas
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

async function createFatura (req, res) {
  try {
    const camposFaltando = []

if (!req.body.venda_id) {
  camposFaltando.push('venda_id')
}

if (!req.body.valor_fatura) {
  camposFaltando.push('valor_fatura')
}

if (!req.body.data_vencimento) {
  camposFaltando.push('data_vencimento')
}

if (camposFaltando.length > 0) {
  return res.status(400).json({
    status: 'error',
    message: `Campos obrigatórios faltando: ${camposFaltando.join(', ')}`
  })
}
    const params = {
  ...req.body, 
  usuario_id: req.usuario.id
}

const vendaExiste = await vendaService.getVendaById({
  id: req.body.venda_id
})

const vendaAtual = vendaExiste[0]

if (Number(req.body.valor_fatura) !== Number(vendaAtual.total_venda)) {
  return res.status(400).json({
    status: 'error',
    message: 'O valor da fatura deve ser igual ao total da venda'
  })
}

if (!vendaExiste.length) {
  return res.status(404).json({
    status: 'error',
    message: 'Venda não encontrada'
  })
}

const hoje = new Date()
const dataVencimento = new Date(req.body.data_vencimento)

if (dataVencimento < hoje) {
  return res.status(400).json({
    status: 'error',
    message: 'A data de vencimento não pode estar no passado'
  })
}

const fatura = await service.createFatura(params)

    return res.status(201).json({
      status: 'ok',
      message: 'Fatura cadastrada com sucesso',
      data: fatura
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

async function updateFatura (req, res) {
  try {
    const params = {
      ...req.body,
      id: req.params.id
    }

    const faturaExiste = await service.getFaturaById({
      id: req.params.id
    })

    if (!faturaExiste.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Fatura não encontrada'
      })
    }

    const faturaAtual = faturaExiste[0]

    if (faturaAtual.status === 'pago') {
      return res.status(400).json({
      status: 'error',
      message: 'Faturas pagas não podem ser alteradas'
  })
}

    if (
      req.usuario.tipo_acesso !== 'admin' &&
      req.usuario.id !== faturaAtual.usuario_id
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para alterar esta fatura'
      })
    }

    if (params.status === 'pago'){
      params.data_pagamento = new Date()
    }

    if ( params.status === 'pendente' || params.status === 'cancelado'){
      params.data_pagamento = null
    }

    const fatura = await service.updateFatura(params)

    return res.status(200).json({
      status: 'ok',
      message: 'Fatura atualizada com sucesso',
      data: fatura
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

async function deleteFatura (req, res) {
  try {
    await service.deleteFatura(req.params)

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

module.exports = {
  getFaturas,
  createFatura,
  updateFatura,
  deleteFatura
}