function admin (req, res, next) {
  if (req.usuario.tipo_acesso !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Apenas administradores podem realizar esta ação'
    })
  }

  next()
}

module.exports = admin