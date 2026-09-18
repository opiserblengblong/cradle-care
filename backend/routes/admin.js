const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT id, status, total_amount, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const [revenueRows] = await db.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS revenue
      FROM orders
      WHERE status IN ('Completed', 'Processing', 'Delivered')
    `);

    const [productRows] = await db.query(`
      SELECT COUNT(*) AS totalProducts
      FROM products
    `);

    const [orderRows] = await db.query(`
      SELECT COUNT(*) AS totalOrders
      FROM orders
    `);

    const dashboard = {
      revenue: Number(revenueRows[0]?.revenue || 0),
      totalOrders: Number(orderRows[0]?.totalOrders || 0),
      totalProducts: Number(productRows[0]?.totalProducts || 0),
      orders: orders.map((order) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      })),
    };

    res.json(dashboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Admin dashboard failed' });
  }
});

module.exports = router;
