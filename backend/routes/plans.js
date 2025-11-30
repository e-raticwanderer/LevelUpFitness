import express from 'express';
import Plan from '../models/Plan.js';
import { authMiddleware, trainerOnly } from '../middleware/auth.js';

const router = express.Router();

// Get client's active plan
router.get('/client/:clientId', authMiddleware, async (req, res) => {
  try {
    const plan = await Plan.findOne({ client_id: req.params.clientId, active: true });
    if (!plan) {
      return res.status(404).json({ error: 'No active plan found' });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all plans for client
router.get('/client-all/:clientId', authMiddleware, async (req, res) => {
  try {
    const plans = await Plan.find({ client_id: req.params.clientId });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create plan (trainer only)
router.post('/', authMiddleware, trainerOnly, async (req, res) => {
  try {
    const { client_id, name, schedule } = req.body;
    const plan = new Plan({
      client_id,
      trainer_id: req.user.id,
      name,
      schedule,
      active: true
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update plan (trainer only)
router.put('/:id', authMiddleware, trainerOnly, async (req, res) => {
  try {
    const { name, schedule, active } = req.body;
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { name, schedule, active, updatedAt: Date.now() },
      { new: true }
    );
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete plan (trainer only)
router.delete('/:id', authMiddleware, trainerOnly, async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
