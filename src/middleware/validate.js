const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: 'Validation failed',
      details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }
};

module.exports = validate;
