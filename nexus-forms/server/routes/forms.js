const router = require('express').Router();
const Form   = require('../models/Form');
const auth   = require('../middleware/auth');

// GET /api/forms  — all forms for logged-in admin
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.userId })
      .sort({ updatedAt: -1 })
      .select('-questions');        // lean list — questions loaded on edit
    res.json(forms);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/forms/:id  — full form (public, for fill view)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/forms/slug/:slug  — public fill via slug (REQ-009)
router.get('/slug/:slug', async (req, res) => {
  try {
    const form = await Form.findOne({ publicSlug: req.params.slug, isPublished: true });
    if (!form) return res.status(404).json({ message: 'Form not found or not published' });
    res.json(form);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/forms  — create
router.post('/', auth, async (req, res) => {
  try {
    const form = await Form.create({ ...req.body, owner: req.userId });
    res.status(201).json(form);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/forms/:id  — update
router.put('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/forms/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json({ message: 'Form deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
