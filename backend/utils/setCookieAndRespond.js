export function setCookieAndRespond(req, res) {
    const { token, user } = req
    res.cookie('serene', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Last 7 days,
        httpOnly: true,
    })

    return res.status(201).json({
        message: 'Successful login',
        user,
    })
}
