const express = require('express');
const path = require('path');
const router = express.Router();
router.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../tesla-3-6-9/build', 'index.html'));
});
module.exports = router;
