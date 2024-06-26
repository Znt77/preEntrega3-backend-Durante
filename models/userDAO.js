const User = require('./user');

class UserDAO {
  async getUserById(id) {
    return await User.findById(id);
  }
}

module.exports = UserDAO;