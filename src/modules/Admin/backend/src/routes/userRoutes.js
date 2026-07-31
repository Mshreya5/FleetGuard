const express = require('express');
const { getUsers, createUser, updateUser, deleteUser, updateUserStatus } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/status/:id', updateUserStatus);

module.exports = router;
