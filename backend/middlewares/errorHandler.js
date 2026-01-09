export const errorHandler = (err, req, res, next) => {
  const code = err?.code
  const isSleeping =
    code === 'ETIMEDOUT' || 'ECONNREFUSED' || err?.name === 'AggregateError'

  console.log('Sleeping is running value is:', isSleeping)
  if (isSleeping) return res.sendStatus(503)
  console.error('Unexpected error happened', err.stack)
  return res.status(500).json({
    message: 'An unexpected error happened when processing the request.',
  })
}
