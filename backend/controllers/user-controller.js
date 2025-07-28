import { passport } from '../config/index.js'
const getUser = [
    passport.authenticate('jwt', { session: false }),
    // TODO: Implement the data that will be returned to the user
    (req, res) => {
        res.json({ message: 'Authentication sucessful', user: req.user })
    },
]
export default {
    getUser,
}
