import express from 'express';
import User from '../models/User.js';
import { authMiddleware, trainerOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all clients (trainer only)
router.get('/clients', authMiddleware, trainerOnly, async (req, res) => {
  try {
    const clients = await User.find({ trainer_id: req.user.id, role: 'client' }).select('-password');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single user
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'trainer') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, status, xp, level, rank } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, status, xp, level, rank },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get trainer profile
router.get('/trainer/:id', authMiddleware, async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id).select('-password');
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ error: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
