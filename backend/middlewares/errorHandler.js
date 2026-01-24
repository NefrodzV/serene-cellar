export const errorHandler = (err, req, res, next) => {
  const code = err?.code
  const isSleeping =
    code === 'ETIMEDOUT' || 'ECONNREFUSED' || err?.name === 'AggregateError'

  if (isSleeping) {
    console.log('Sleeping sending 503')
    return res.sendStatus(503)
  }

  if (res.headerSent) return next(err)

  console.error('Some error happened: ', err)
  console.error('Error stack: ', err.stack)
  return res.status(err.status || 500).json({
    message: 'An unexpected error happened when processing the request.',
  })
}
