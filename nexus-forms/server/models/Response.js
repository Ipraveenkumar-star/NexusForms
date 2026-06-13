const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema(
  {
    qid:   String,
    label: String,
    value: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const ResponseSchema = new mongoose.Schema(
  {
    formId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers:   [AnswerSchema],
    submitter: { type: String, default: 'Anonymous' },
    meta: {
      userAgent: String,
      submittedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Response', ResponseSchema);
