require('dotenv').config(); // read .env files
const express = require('express');
const bodyParser = require('body-parser'); // middleware to help Express read properties from request object
const { getRates, getSymbols, } = require('./lib/fixer-service');
const { convertCurrency } = require('./lib/free-currency-service');
const simulationNormal = require('./lib/simulation-normal');

const app = express();
const port = process.env.PORT || 3000;

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Parse POST data as URL encoded data
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Parse POST data as JSON
app.use(bodyParser.json());

// Express Error handler
const errorHandler = (err, req, res) => {
    if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(403).send({ title: 'Server responded with an error', message: err.message });
    } else if (err.request) {
        // The request was made but no response was received
        res.status(503).send({ title: 'Unable to communicate with server', message: err.message });
    } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).send({ title: 'An unexpected error occurred', message: err.message });
    }
};

// Fetch Latest Currency Rates
app.get('/api/rates', async (req, res) => {
    try {
        const data = await getRates();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Fetch Symbols
app.get('/api/symbols', async (req, res) => {
    try {
        const data = await getSymbols();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Convert Currency
app.post('/api/convert', async (req, res) => {
    req.setTimeout(240000);
    try {
        const { from, to } = req.body;
        const data = await convertCurrency(from, to);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Run Simulation
app.post('/api/simulate', async (req, res) => {
    req.setTimeout(240000);
    try {
        const { 
            timeWindow,
            coneTimeMean,
            coneTimeStdDevMins,
            custArrivalMeanMins,
            simRuns
        } = req.body;
        const data = await simulationNormal(
            timeWindow,
            coneTimeMean,
            coneTimeStdDevMins,
            custArrivalMeanMins,
            simRuns
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000
var server = app.listen(port, () => {
    console.log('listening on %d', port);
});

server.setTimeout(240000);

// Test Rates Endpoint
const test1 = async () => {
    const data = await getRates();
    console.log(data);
}

// Test Symbols Endpoint
const test2 = async () => {
    const data = await getSymbols();
    console.log(data);
}

// Test Currency Conversion Endpoint
const test3 = async () => {
    const data = await convertCurrency('USD', 'PHP');
    console.log(data);
}

// Test Simulation Endpoint
const test4 = async () => {
    const data = await simulationNormal(
        7, // timeWindowHrs,
        7, // coneTimeMeanMins,
        1, // coneTimeStdDevMins,
        7, // custArrivalMeanMins,
        1001, // simRuns,
    );
    console.log(data);
}

// test1();
// test2();
// test3();
test4();