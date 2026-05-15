import express from 'express';

const router = express.Router();

/**
 * GET /
 * Render landing page with recent splits
 */
router.get('/', (req, res) => {
  try {
    // In production, this would fetch recent splits from the database
    // Limit to 10 most recent splits
    const splits = [
      {
        id: 'split_demo_1',
        description: 'Dinner at Restaurant',
        total_amount: 120.00,
        created_at: new Date().toISOString(),
        status: 'pending',
      },
    ];

    res.render('index', { splits });
  } catch (error) {
    console.error('Error rendering landing page:', error);
    res.status(500).render('error', {
      message: 'Failed to load page',
    });
  }
});

/**
 * GET /split/:id
 * Render split detail page
 */
router.get('/split/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).render('error', {
        message: 'Split ID is required',
      });
    }

    // In production, this would fetch the split with participants from the database
    // Mock data for demonstration
    if (id.startsWith('split_') || id === 'demo') {
      const split = {
        id,
        description: 'Dinner at Restaurant',
        total_amount: 120.00,
        created_at: new Date().toISOString(),
        status: 'pending',
        participants: [
          { id: 'p1', name: 'Alice', phone: '+1234567890', amount: 60.00 },
          { id: 'p2', name: 'Bob', phone: '+0987654321', amount: 60.00 },
        ],
        created_by: 'Alice',
      };

      return res.render('split', { split });
    }

    // Split not found
    res.status(404).render('error', {
      message: 'Split not found',
    });
  } catch (error) {
    console.error('Error rendering split detail:', error);
    res.status(500).render('error', {
      message: 'Failed to load split',
    });
  }
});

/**
 * GET /qr
 * QR code page for WhatsApp authentication
 * Placeholder for WhatsApp auth flow
 */
router.get('/qr', (req, res) => {
  try {
    res.render('qr', {
      title: 'WhatsApp Authentication',
    });
  } catch (error) {
    console.error('Error rendering QR page:', error);
    res.status(500).render('error', {
      message: 'Failed to load QR page',
    });
  }
});

export default router;