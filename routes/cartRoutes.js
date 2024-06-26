const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Ticket = require('../models/ticket');

router.post('/:cid/purchase', async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  const productsToPurchase = cart.products.filter(product => product.stock >= product.quantity);
  const purchaseAmount = productsToPurchase.reduce((total, product) => total + product.price * product.quantity, 0);

  const ticket = new Ticket({
    code: generateUniqueCode(),
    amount: purchaseAmount,
    purchaser: req.user.email,
  });

  await ticket.save();
  res.json(ticket);
});

function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = router;
