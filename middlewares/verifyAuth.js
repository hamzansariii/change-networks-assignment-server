const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        return res.status(401).json({ auth: false, message: 'Failed to authenticate.' })
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ auth: false, message: 'Failed to authenticate.' })
            } else {
                req.email = decoded.email
                req.role = decoded.role
                req.roleArray = decoded.role.split(',')
                next()
            }
        })
    }
}

module.exports = verifyJWT