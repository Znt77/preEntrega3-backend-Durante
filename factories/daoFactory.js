const UserDAO = require('../models/userDao');

class DAOFactory {
  static getDAO(type) {
    switch (type) {
      case 'user':
        return new UserDAO();
      default:
        throw new Error('Invalid DAO type');
    }
  }
}

module.exports = DAOFactory;