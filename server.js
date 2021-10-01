const express = require('express');
const db = require('./database/models/index');
const commons = require('./routes/commons');
const options = require('./routes/options');
const srlevels = require('./routes/sr-levels');
const priceAction = require('./routes/price-action')

const app = express();
// parse application/json
app.use(express.json());

const port = 8080;

db.sequelize.sync({
    logging: console.log
    }).then(() => console.info('connected to db...'))
    .catch((err) => console.error('error occurred while connecting to db: ' + err));

app.listen(port, () => {
    console.info('Running server on port: ' + port);
});

// api routes
app.get('/', (req, resp) => {
    resp.status(200).send('Journal Service API...');
});

app.use('/api/commons', commons);
app.use('/api/options', options);
app.use('/api/sr-levels', srlevels);
app.use('/api/price-action', priceAction);