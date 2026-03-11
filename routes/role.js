var express = require('express');
var router = express.Router();
let roleModel = require('../models/Role'); // Đổi đường dẫn tới model của bạn cho đúng nhé

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

module.exports = router;