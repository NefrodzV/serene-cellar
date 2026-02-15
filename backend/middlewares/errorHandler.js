export const errorHandler = (err, req, res, next) => {
    const code = err?.code
    const isSleeping =
        code === 'ETIMEDOUT' || 'ECONNREFUSED' || err?.name === 'AggregateError'

    if (isSleeping) {
        console.log('Sleeping sending 503')
        console.log('Error message')
        console.error(err.message)

        console.log('Error stack', err.stack)

        return res.sendStatus(503)
    }

    if (res.headerSent) return next(err)

    console.error('Some error happened: ', err.message)
    console.error('Error stack: ', err.stack)
    return res.status(err.status || 500).json({
        message: 'An unexpected error happened when processing the request.',
    })
}
