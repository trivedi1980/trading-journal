const db = require('../database/models/index');
const logger = require("../logger").log4js.getLogger('routes/crud');

const create = (req, resp, modelName) => {
    logger.debug('received request: ' + req.body);
    return db[modelName].create(req.body).then((object) => {
        resp.status(200).json(object);
        return object;
    }).catch(err => {
        resp.status(500).send(err.original.detail);
        logger.error('error occurred: ' + err);
    });
};

const read = (req, resp, modelName) => {
    logger.debug('reading all objects for: ' + modelName);
    return db[modelName].findAll().then((objects) => {
        resp.status(200).json(objects);
        return objects;
    }).catch(err => {
        resp.status(500).send(err.original.detail);
        logger.error('error occurred while reading data: ' + err);
    });
};

const update = (req, resp, modelName) => {
    logger.debug('received object: ' + req.body);
    var updatedObject = req.body;
    if (!updatedObject.id) {
        resp.status(500).send('missing primary key in the request');
        logger.error('missing primary key in the request');
        return Promise.reject();
    }

    return db[modelName].findByPk(updatedObject.id).then(storedInstance => {
        if (!storedInstance) {
            resp.status(500).send('no record found with given key: ' + updatedObject.id);
            logger.warn('no record found with given key: ' + updatedObject.id);
            return;
        }

        Object.keys(updatedObject).forEach(element => {
            if (element in storedInstance) {
                storedInstance[element] = updatedObject[element];
            }
        });

        storedInstance.save().then((object) => {
            resp.status(200).json(object);
            logger.info('object updated successfully');
            return object;
        }).catch(err => {
            resp.status(500).send(err.original.detail);
            logger.error('failed to update object: ' + err);
        })
    }).catch(err => {
        resp.status(500).send(err.original.detail);
        logger.error('error occurred: ' + err);
    });
};

const destroy = (req, resp, modelName) => {
    logger.info('received delete request for id: ' + req.body.id + ' modelName: ' + modelName);
    var object = req.body;
    if (!object.id) {
        resp.status(500).send('missing primary key in the request');
        logger.warn('missing primary key in the request');
        return Promise.reject();    
    }

    return db[modelName].findByPk(object.id).then(storedInstance => {
        if (!storedInstance) {
            resp.status(500).send('no record found with given key: ' + object.id);
            logger.warn('no record found with given key: ' + object.id);
            return;
        }
        storedInstance.destroy().then(object => {
            resp.status(200).json(object);
            logger.info('object successfully deleted');
            return object;
        }).catch(err => {
            resp.status(500).send(err.original.detail);
            logger.error('failed to delete object: ' + err);    
        })
    }).catch(err => {
        resp.status(500).send(err.original.detail);
        logger.error('error occurred: ' + err);
    });
};

module.exports = {
    create,
    read,
    update,
    destroy
}