export const errorHandler = (err, req, res, next) => {
  console.log('error handler running')
  console.error(err.stack)
  return res.status(500).json({
    message: 'An unexpected error happened when processing the request.',
  })
}
