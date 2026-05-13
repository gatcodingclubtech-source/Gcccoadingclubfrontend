const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Domain title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Domain slug is required'],
      unique: true,
      trim: true,
    },
    desc: {
      type: String,
      required: [true, 'Domain description is required'],
    },
    icon: {
      type: String,
      default: 'Layers',
    },
    color: {
      type: String,
      default: 'emerald',
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Domain', domainSchema);
