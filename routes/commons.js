const express = require('express');
const router = express.Router();
const crud = require('./crud');
const eventManager = require('../event/event-manager');
const modelName = "CommonsTrade";

// route definition for common trades
router.route('/')
    .get((req, resp) => {
        crud.read(modelName)
            .then(objects => resp.status(200).json(objects))
            .catch(error => resp.status(500).send(error));
    })
    .post((req, resp) => {
        crud.create(req.body, modelName).then(object =>  {
            resp.status(200).json(object);
            eventManager.emitEvent('ticker_saved', { ticker: object.ticker });
        }).catch(error => resp.status(500).send(error));
    })
    .put((req, resp) => {
        crud.update(req.body, modelName)
            .then(objects => resp.status(200).json(objects))
            .catch(error => resp.status(500).send(error));
    })
    .delete((req, resp) => {
        crud.destroy(req.body, modelName)
            .then(objects => resp.status(200).json(objects))
            .catch(error => resp.status(500).send(error));
    });

module.exports = router;