const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role' // Khớp chính xác với tên 'Role' đã export ở trên
    },
    loginCount: {
        type: Number,
        default: 0,
        min: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isDeleted: { 
        type: Boolean,
        default: false // Đã thêm trường này
    }
});

// Bỏ chữ 'new' và viết hoa chữ 'User'
module.exports = mongoose.model('User', userSchema);