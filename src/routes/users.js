const express = require('express');
const router = express.Router();
const crud = require('./crud');
const db = require('../database/models/index');
const crypto = require('crypto')
const logger = require("../logger").log4js.getLogger('routes/users');
const modelName = "User";
const attributes = ['id', 'first_name', 'last_name', 'email', 'mobile', 'password'];

router.route('/')
    .get((req, resp) => {
        crud.read(modelName)
            .then(objects => {
                var users = objects.map(each => {
                    var user = {};
                    attributes.forEach(attr => {
                        user[attr] = each[attr];
                    });
                    return user;
                });
                resp.status(200).json(users);
            })
            .catch(error => resp.status(500).send(error));
    })
    .post((req, resp) => {
        db.sequelize.transaction(t => {
            return new Promise ((resolve, reject) => {
                crud.create(req.body, modelName, t)
                    .then(object => {
                        let hashPassword = crypto.createHmac(
                            'md5', object.createdAt.toString()).update(object.password).digest("hex");
                        object.password = hashPassword;
                        return object.save({transaction: t});
                    })
                    .then(object => {
                        var user = {};
                        attributes.forEach(attr => {
                            user[attr] = object[attr];
                        });
                        resp.status(200).json(user);
                        resolve();
                    })
                    .catch(error => {
                        logger.error(error);
                        resp.status(500).send(error);
                        reject(error);
                    });
            });
        });
    })
    .put((req, resp) => {
        // TODO: take care of password update
        crud.update(req.body, modelName)
            .then(object => resp.status(200).json(object))
            .catch(error => resp.status(500).send(error));
    })
    .delete((req, resp) => {
        crud.destroy(req, resp, modelName)
            .then(() => resp.status(200).json({}))
            .catch(error => resp.status(500).send(error));
    });

module.exports = router;