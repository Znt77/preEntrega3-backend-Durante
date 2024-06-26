const express = require('express');
const router = express.Router();
const UserRepository = require('../repositories/userRepository');
const DAOFactory = require('../factories/daoFactory');

const userDAO = DAOFactory.getDAO('user');
const userRepository = new UserRepository(userDAO);

router.get('/current', async (req, res) => {
  const user = await userRepository.getUserById(req.user.id);
  res.json(user);
});

module.exports = router;
