const express = require('express');
const logger = require("./logger").log4js.getLogger('server');
const seqLogger = require("./logger").log4js.getLogger('sequelize');
const db = require('./database/models/index');
const commons = require('./routes/commons');
const options = require('./routes/options');
const srlevels = require('./routes/sr-levels');
const priceAction = require('./routes/price-action');
const scheduler = require('./event/scheduler');
const users = require('./routes/users');

// setup express
const app = express();
app.use(express.json());

const port = 8080;

// sequelize logger function
const dbLogger = (...msg) => {
    seqLogger.debug(msg);
};

db.sequelize.sync({
    logging: dbLogger
    }).then(() => logger.info('connected to db...'))
    .catch((err) => logger.error('error occurred while connecting to db: ' + err));

app.listen(port, () => {
    logger.info('Running server on port: ' + port);
});

// invoke scheduler
scheduler.schedule();

// api routes
app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/static/login.html');
});

// expose static content
app.use('/static', express.static('static'))

// Login
app.post("/login", (req, res) => {
    // our login logic goes here
});

// expose APIs for clients
app.use('/api/commons', commons);
app.use('/api/options', options);
app.use('/api/sr-levels', srlevels);
app.use('/api/price-action', priceAction);
app.use('/api/users', users);

process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    logger.warn('unhandledRejection', error.message);
});