import { configDotenv } from 'dotenv'

configDotenv()
export function setCookieAndRespond(req, res) {
    const { token, user } = req
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('serene', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Last 7 days,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
    })

    return res.status(201).json({
        message: 'Successful login',
        user,
    })
}
