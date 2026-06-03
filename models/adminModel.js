const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'content_manager', 'course_admin'],
        default: 'course_admin'
    },
    lastLogin: { type: Date, default: null },
    lastLoginIP: { type: String, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


// Add this method to the adminSchema
adminSchema.methods.incLoginAttempts = function() {
    // Reset attempts if lock has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    // Otherwise increment
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= 5) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours lock
    }
    return this.updateOne(updates);
};

module.exports = mongoose.model('Admin', adminSchema);