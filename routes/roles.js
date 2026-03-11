const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isDeleted: { 
        type: Boolean,
        default: false // Đã thêm mặc định false để phục vụ xoá mềm
    }
});

// Sửa 'role' thành 'Role' (Viết hoa chữ cái đầu) và bỏ chữ 'new'
module.exports = new mongoose.model('Role', roleSchema);