const jwt = require('jsonwebtoken')

function auth (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'Token não informado'
    })
  }

  const partes = authHeader.split(' ')

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({
      status: 'error',
      message: 'Formato do token inválido'
    })
  }

  const token = partes[1]

  try {
    const decoded = jwt.verify(token, process.env.AUTH_KEY)

    req.usuario = decoded.user

    next()
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado'
    })
  }
}

module.exports = auth