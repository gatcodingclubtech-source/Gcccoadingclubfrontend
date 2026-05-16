const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Never return password in queries
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values
    },
    avatar: {
      type: String,
      default: '',
    },
    // Profile fields
    usn: {
      type: String,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      enum: ['CS', 'IS', 'AI/ML', 'EC', 'ME', 'CV', 'Other', ''],
      default: '',
    },
    year: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', ''],
      default: '',
    },
    domainInterest: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    // Developer Social System
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    projects: [{
      title: { type: String, required: true },
      description: { type: String },
      link: { type: String },
      githubLink: { type: String },
      thumbnail: { type: String },
      tags: [String],
      upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      createdAt: { type: Date, default: Date.now }
    }],
    // Reputation & Advanced Gamification
    trustScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    skillMatrix: {
      web: { type: Number, default: 0 },
      ai: { type: Number, default: 0 },
      cyber: { type: Number, default: 0 },
      app: { type: Number, default: 0 },
      dsa: { type: Number, default: 0 },
      cloud: { type: Number, default: 0 },
    },
    // Role and status
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    xp: { type: Number, default: 0 },
    rank: { 
      type: String, 
      enum: ['Rookie', 'Builder', 'Elite', 'Core Member', 'Legend'], 
      default: 'Rookie' 
    },
    badges: [{
      name: { type: String },
      icon: { type: String },
      awardedAt: { type: Date, default: Date.now }
    }],
    achievements: [{
      id: { type: String },
      title: { type: String },
      unlockedAt: { type: Date, default: Date.now }
    }],
    profileComplete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    systemRemark: {
      type: String,
      default: '',
    },
    joinedDomains: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hooks for password hashing and admin auto-assignment
userSchema.pre('save', async function () {
  // Hash password if modified
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Auto-assign admin role based on env variable
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  if (adminEmails.includes(this.email.toLowerCase())) {
    this.role = 'admin';
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
