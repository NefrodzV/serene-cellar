export function setCookieAndRespond(req, res) {
    const { token, user } = req
    res.cookie('serene', token, {
        maxAge: 1000 * 60 * 60, // Lasts  1 hour,
        httpOnly: true,
    })

    return res.status(201).json({
        message: 'Successful login',
        user,
    })
}
