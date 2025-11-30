import express from 'express';
import Log from '../models/Log.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get client's workout logs
router.get('/client/:clientId', authMiddleware, async (req, res) => {
  try {
    const logs = await Log.find({ client_id: req.params.clientId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific log
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create log
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { client_id, date, day, completed, volume, exercises, notes } = req.body;
    const log = new Log({
      client_id,
      date: new Date(date),
      day,
      completed,
      volume,
      exercises,
      notes
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update log
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { completed, volume, exercises, notes } = req.body;
    const log = await Log.findByIdAndUpdate(
      req.params.id,
      { completed, volume, exercises, notes },
      { new: true }
    );
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete log
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Log.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
