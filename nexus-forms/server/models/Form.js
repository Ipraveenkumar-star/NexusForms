const mongoose = require('mongoose');
const { v4: uuidv4 } = require('crypto').randomUUID
  ? { v4: () => require('crypto').randomUUID() }
  : require('crypto');

const OptionSchema = new mongoose.Schema({ text: String }, { _id: false });

const QuestionSchema = new mongoose.Schema(
  {
    qid:      { type: String, default: () => Math.random().toString(36).slice(2, 10) },
    type:     {
      type: String,
      enum: ['short_text', 'paragraph', 'multiple_choice', 'checkbox', 'dropdown', 'rating', 'date', 'email'],
      default: 'short_text',
    },
    label:    { type: String, required: true, default: 'Untitled Question' },
    required: { type: Boolean, default: false },
    options:  [String],
  },
  { _id: false }
);

const FormSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, default: 'Untitled Form' },
    description: { type: String, default: '' },
    questions:   [QuestionSchema],
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    theme:       { type: String, default: 'indigo', enum: ['indigo', 'rose', 'emerald', 'amber', 'sky'] },
    publicSlug:  { type: String, unique: true, sparse: true },
    closedAt:    { type: Date, default: null },
  },
  { timestamps: true }
);

// Auto-generate publicSlug on publish
FormSchema.pre('save', function (next) {
  if (this.isPublished && !this.publicSlug) {
    this.publicSlug = Math.random().toString(36).slice(2, 10);
  }
  next();
});

module.exports = mongoose.model('Form', FormSchema);
