const express = require('express');
const router = express.Router();
const crud = require('./crud');
const modelName = "PriceAction";

// route definition for common trades
router.route('/')
    .get((req, resp) => crud.read(req, resp, modelName))
    .post((req, resp) => crud.create(req, resp, modelName))
    .put((req, resp) => crud.update(req, resp, modelName))
    .delete((req, resp) => crud.destroy(req, resp, modelName));

module.exports = router;