var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');
require('../schemas/roles'); // Đổi đường dẫn tới model của bạn cho đúng nhé

// GET all users (Có query theo username includes)
router.get('/', async function (req, res, next) {
  let queries = req.query;
  // Nếu có query username thì lấy, không thì để chuỗi rỗng
  let usernameQ = queries.username ? queries.username : ''; 
  
  let data = await userModel.find({
    isDeleted: false,
    // RegExp với flag 'i' giúp tìm kiếm "includes" không phân biệt hoa thường
    username: new RegExp(usernameQ, 'i') 
  }).populate({
    path: 'role',
    select: 'name description' // Chỉ lấy name và description của Role cho nhẹ data
  });
  
  res.send(data);
});

// GET user by ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.find({
      isDeleted: false,
      _id: id
    }).populate({
      path: 'role',
      select: 'name description'
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

// CREATE (POST) user
router.post('/', async function (req, res, next) {
  let newUser = new userModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    status: req.body.status,
    role: req.body.role,
    loginCount: req.body.loginCount
  });
  await newUser.save();
  res.send(newUser);
});

// UPDATE (PUT) user
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findByIdAndUpdate(
      id, req.body, {
      new: true
    });
    res.send(result);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// DELETE (Soft Delete) user
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findById(id);
    result.isDeleted = true;
    await result.save();
    res.send(result);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
// 2) Kích hoạt tài khoản (ENABLE)
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    
    // Tìm user khớp với email, username và chưa bị xóa mềm
    let user = await userModel.findOne({ 
      email: email, 
      username: username, 
      isDeleted: false 
    });

    if (!user) {
      return res.status(404).send("Không tìm thấy User hoặc sai thông tin (email/username)!");
    }

    // Cập nhật status thành true
    user.status = true;
    await user.save();
    
    res.send({ message: "Đã kích hoạt tài khoản thành công!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 3) Vô hiệu hóa tài khoản (DISABLE)
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    
    let user = await userModel.findOne({ 
      email: email, 
      username: username, 
      isDeleted: false 
    });

    if (!user) {
      return res.status(404).send("Không tìm thấy User hoặc sai thông tin (email/username)!");
    }

    // Cập nhật status thành false
    user.status = false;
    await user.save();
    
    res.send({ message: "Đã khóa tài khoản thành công!", user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;