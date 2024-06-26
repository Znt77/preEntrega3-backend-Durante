function authorize(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).send('Forbidden');
      }
      next();
    };
  }
  
  module.exports = authorize;
  