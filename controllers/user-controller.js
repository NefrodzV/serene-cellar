import { passport } from '../config/index.js'
const getUser = [
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'Authentication sucessful', user: req.user })
    },
]
export default {
    getUser,
}
