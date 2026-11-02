export default function errorMiddleware(error, req, res, next) {
  console.error(error.message);
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Invalid JSON request body.' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(error.errors).map(item => item.message).join(', ') });
  }
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid value supplied.' });
  res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Internal server error.' });
}
