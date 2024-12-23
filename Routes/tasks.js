const express = require('express');
const Task = require('../Models/tasks_model');
const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.session.userId });
  res.render('tasks', { tasks });
});

router.post('/', async (req, res) => {
  const { description } = req.body;
  await Task.create({ description, userId: req.session.userId });
  res.redirect('/tasks');
});

router.post('/:id/state', async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  await Task.findByIdAndUpdate(id, { state });
  res.redirect('/tasks');
});

module.exports = router;
