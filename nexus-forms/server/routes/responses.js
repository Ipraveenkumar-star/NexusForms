const router   = require('express').Router();
const Response = require('../models/Response');
const Form     = require('../models/Form');
const auth     = require('../middleware/auth');

// POST /api/responses  — public submission (REQ-010)
router.post('/', async (req, res) => {
  try {
    const { formId, answers, submitter } = req.body;

    // REQ-011: validate form exists and is open
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (!form.isPublished) return res.status(403).json({ message: 'This form is not accepting responses' });

    // REQ-011: validate required fields
    const missing = form.questions
      .filter((q) => q.required)
      .filter((q) => {
        const ans = answers?.find((a) => a.qid === q.qid);
        return !ans || ans.value === '' || ans.value === null || ans.value === undefined ||
          (Array.isArray(ans.value) && ans.value.length === 0);
      });

    if (missing.length)
      return res.status(400).json({
        message: 'Please fill all required fields',
        missing: missing.map((q) => q.label),
      });

    const response = await Response.create({
      formId,
      answers,
      submitter: submitter || 'Anonymous',
      meta: { userAgent: req.headers['user-agent'], submittedAt: new Date() },
    });

    res.status(201).json({ message: 'Response submitted successfully', id: response._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/responses/:formId  — admin fetch all
router.get('/:formId', auth, async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId })
      .sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/responses/:id  — admin delete one
router.delete('/:id', auth, async (req, res) => {
  try {
    await Response.findByIdAndDelete(req.params.id);
    res.json({ message: 'Response deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
