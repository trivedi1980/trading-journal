const e = require('express');
const db = require('../database/models/index');
const logger = require("../logger").log4js.getLogger('routes/crud');

const handleError = err => {
    logger.error('error occurred: ' + err);
    let errorText = 'internal error occurred';
    if (typeof err === 'string') {
        errorText = err;
    } else if (err.original.detail) {
        errorText = err.original.detail;
    } else if (err.errors) {
        err.errors.forEach(error => {
            errorText += error.message + '\n';
        });
    }
    throw errorText;
};

const create = async (request, modelName, transaction) => {
    logger.debug('received request for create: ' + JSON.stringify(request));
    try {
        return await db[modelName].create(request, { transaction: transaction });
    } catch (error) {
        handleError(error);
    }
};

const read = async (modelName) => {
    logger.debug('reading all objects for: ' + modelName);
    try {
        return await db[modelName].findAll();
    } catch (error) {
        handleError(error);
    }
};

const update = async (request, modelName, transaction) => {
    logger.debug(`received request for update:  ${JSON.stringify(request)}`);

    if (!request.id) {
        logger.error('missing primary key in the request');
        throw 'missing primary key in the request';
    }

    try {
        const object = await db[modelName].findByPk(request.id, {transaction: transaction});

        if (!object) {
            logger.warn(`no record found with given key: ${request.id}`);
            throw `no record found with given key: ${request.id}`; 
        }

        Object.keys(request).forEach(element => {
            if (element in object) {
                object[element] = request[element];
            }
        });

        await object.save({ transaction: transaction });
        logger.info('object updated successfully');
        return object;
    } catch(error) {
        handleError(error);
    }
};

const destroy = async (request, modelName, transaction) => {
    logger.info('received delete request for id: ' + request.id + ' modelName: ' + modelName);
    if (!request.id) {
        logger.warn('missing primary key in the request');
        throw 'missing primary key in the request';   
    }

    try {
        const object = await db[modelName].findByPk(request.id, {transaction: transaction});

        if (!object) {
            logger.warn(`no record found with given key: ${request.id}`);
            throw `no record found with given key: ${request.id}`; 
        }

        await object.destroy({ transaction: transaction });
        logger.info('object deleted successfully');
        return;
    } catch(error) {
        handleError(error);
    }
};

module.exports = {
    create,
    read,
    update,
    destroy
}