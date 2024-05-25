const express = require('express');
const router = express.Router();
const { addTag, updateTag, deleteTag } = require('../Controllers/tagController');
const auth = require('../Middlewares/auth');

router.use(auth);

router.post('/add', addTag);
router.delete('/delete/:id', deleteTag);
router.put('/update/:id', updateTag);

module.exports = router;
