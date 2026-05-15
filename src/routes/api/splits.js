import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 * Returns: { status: "ok", timestamp }
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/splits
 * Create a new split
 * Body: { description, amount, createdBy, participants: [{name, phone, amount}] }
 * Returns: { id, description, total_amount, created_at }
 */
router.post('/splits', (req, res) => {
  try {
    const { description, amount, createdBy, participants } = req.body;

    // Validate required fields
    if (!description || typeof description !== 'string') {
      return res.status(400).json({
        error: 'description is required and must be a string',
      });
    }

    if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'amount is required and must be a positive number',
      });
    }

    if (!createdBy || typeof createdBy !== 'string') {
      return res.status(400).json({
        error: 'createdBy is required and must be a string',
      });
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({
        error: 'participants is required and must be a non-empty array',
      });
    }

    // Generate a unique ID (in production, this would come from the database)
    const id = `split_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate total amount from participants
    const totalAmount = participants.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const now = new Date();

    // In production, this would save to the database
    const split = {
      id,
      description,
      total_amount: totalAmount || amount,
      created_at: now.toISOString(),
      created_by: createdBy,
      status: 'pending',
      participants: participants.map((p, index) => ({
        id: `participant_${index}`,
        name: p.name || '',
        phone: p.phone || '',
        amount: p.amount || 0,
      })),
    };

    res.status(201).json(split);
  } catch (error) {
    console.error('Error creating split:', error);
    res.status(500).json({ error: 'Failed to create split' });
  }
});

/**
 * GET /api/splits/:id
 * Get a split with participants
 * Returns: { id, description, total_amount, created_at, status, participants: [...] }
 */
router.get('/splits/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Split ID is required' });
    }

    // In production, this would fetch from the database
    // For now, return a mock response if the ID format matches
    if (id.startsWith('split_')) {
      // Mock data for existing splits
      const mockSplit = {
        id,
        description: 'Sample Split',
        total_amount: 100.00,
        created_at: new Date().toISOString(),
        status: 'pending',
        participants: [
          { id: 'p1', name: 'Alice', phone: '+1234567890', amount: 50.00 },
          { id: 'p2', name: 'Bob', phone: '+0987654321', amount: 50.00 },
        ],
      };

      return res.json(mockSplit);
    }

    // Split not found
    res.status(404).json({ error: 'Split not found' });
  } catch (error) {
    console.error('Error fetching split:', error);
    res.status(500).json({ error: 'Failed to fetch split' });
  }
});

export default router;