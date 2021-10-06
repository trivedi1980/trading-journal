const db = require('../database/models/index');
const logger = require("../logger").log4js.getLogger('routes/crud');

const processError = (err, callback) => {
    if (err.original.detail) {
        callback(err.original.detail);
    } else if (err.errors) {
        var errorText;
        err.errors.forEach(error => {
            errorText += error.message + '\n';
        });
        callback(errorText);
    } else {
        callback('internal error occurred');
    }
    logger.error('error occurred: ' + err);
};

const create = (request, modelName, transaction) => {
    logger.debug('received request for create: ' + JSON.stringify(request));
    return new Promise((resolve, reject) => {
        db[modelName].create(request, { transaction: transaction })
            .then(object => resolve(object))
            .catch(err => processError(err, reject));
    });
};

const read = (modelName) => {
    logger.debug('reading all objects for: ' + modelName);
    return new Promise((resolve, reject) => {
        db[modelName].findAll()
            .then(objects => resolve(objects))
            .catch(err => processError(err, reject));
    });
};

const update = (request, modelName, transaction) => {
    logger.debug('received request for update: ' + JSON.stringify(request));
    if (!request.id) {
        logger.error('missing primary key in the request');
        return Promise.reject('missing primary key in the request');
    }

    return new Promise((resolve, reject) => {
        db[modelName].findByPk(request.id, {transaction: transaction})
            .then(object => {
                if (!object) {
                    logger.warn('no record found with given key: ' + request.id);
                    reject('no record found with given key: ' + request.id);
                    return;
                }

                Object.keys(request).forEach(element => {
                    if (element in object) {
                        object[element] = request[element];
                    }
                });
                
                object.save({ transaction: transaction }).then(() => {
                    logger.info('object updated successfully');
                    resolve(object)
                })
                .catch(err => processError(err, reject));
            })
            .catch(err => processError(err, reject));    
    });
};

const destroy = (request, modelName, transaction) => {
    logger.info('received delete request for id: ' + request.id + ' modelName: ' + modelName);
    if (!request.id) {
        logger.warn('missing primary key in the request');
        return Promise.reject('missing primary key in the request');    
    }

    return new Promise((resolve, reject) => {
        db[modelName].findByPk(request.id, {transaction: transaction}).then(object => {
            if (!object) {
                logger.warn('no record found with given key: ' + object.id);
                reject('no record found with given key: ' + object.id);
                return;
            }
            
            object.destroy({ transaction: transaction }).then(() => {
                logger.info('object successfully deleted');
                resolve(object);    
            }).catch(err => processError(err, reject));
        }).catch(err => processError(err, reject));
    });
};

module.exports = {
    create,
    read,
    update,
    destroy
}