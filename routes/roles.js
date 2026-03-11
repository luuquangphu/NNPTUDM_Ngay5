var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
 // Đổi đường dẫn tới model của bạn cho đúng nhé
let userModel = require('../schemas/users'); // Thêm dòng này lên đầu file roles.js

// GET all roles
router.get('/', async function (req, res, next) {
  let data = await roleModel.find({
    isDeleted: false
  });
  res.send(data);
});

// GET role by ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.find({
      isDeleted: false,
      _id: id
    });
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.status(404).send("ID NOT FOUND");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// CREATE (POST) role
router.post('/', async function (req, res, next) {
  let newRole = new roleModel({
    name: req.body.name,
    description: req.body.description
  });
  await newRole.save();
  res.send(newRole);
});

// UPDATE (PUT) role
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findByIdAndUpdate(
      id, req.body, {
      new: true
    });
    res.send(result);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// DELETE (Soft Delete) role
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findById(id);
    result.isDeleted = true;
    await result.save();
    res.send(result);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// 4) Lấy tất cả user có cùng Role ID
router.get('/:id/users', async function (req, res, next) {
  try {
    let roleId = req.params.id; // Lấy ID của role từ URL

    // Tìm tất cả các user có trường 'role' khớp với roleId và chưa bị xóa
    let users = await userModel.find({
      role: roleId,
      isDeleted: false
    }).populate({
      path: 'role',
      select: 'name description'
    });

    // Trả về danh sách user
    res.send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;