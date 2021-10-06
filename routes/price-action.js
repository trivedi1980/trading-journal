const express = require('express');
const router = express.Router();
const crud = require('./crud');
const modelName = "PriceAction";

// route definition for price action
router.route('/')
    .get((req, resp) => {
        crud.read(modelName)
            .then(objects => resp.status(200).json(objects))
            .catch(error => resp.status(500).send(error));
    })
    .post((req, resp) => {
        crud.create(req.body, modelName)
            .then(object => resp.status(200).json(object))
            .catch(error => resp.status(500).send(error));
    })
    .put((req, resp) => {
        crud.update(req.body, modelName)
            .then(objects => resp.status(200).json(objects))
            .catch(error => resp.status(500).send(error));
    })
    .delete((req, resp) => {
        crud.destroy(req, resp, modelName)
            .then(objects => resp.status(200).json(objects))
            .catch(error => resp.status(500).send(error));
    });

module.exports = router;