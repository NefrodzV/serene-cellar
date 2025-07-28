import { configDotenv } from 'dotenv'
import jwt from 'jsonwebtoken'
configDotenv()

export function generateToken(user) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })

    return token
}
