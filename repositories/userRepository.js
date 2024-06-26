const UserDTO = require('../models/userDTO');

class UserRepository {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async getUserById(id) {
    const user = await this.userDAO.getUserById(id);
    return new UserDTO(user);
  }
}

module.exports = UserRepository;