var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users'); // Đổi đường dẫn tới model của bạn cho đúng nhé

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

module.exports = router;