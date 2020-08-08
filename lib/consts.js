const random = require('random');

const input = {
  timeWindow: 7, // hours until VIP customer arrives
  coneTimeMeanMins: 7, // avg time to create single cone
  coneTimeStdDevMins: 1, // std deviation
  customerArrivalMeanMins: 7, // avg time b/w customer arrivals
  simulationRuns: 1001, // how many simulation iterations

};

const timeWindow_i = {};
timeWindow_i.hours = input.timeWindow;
timeWindow_i.mins = timeWindow_i.hours * 60;

const coneTimeStats = {
  mean: input.coneTimeMeanMins,
  stdDev: input.coneTimeStdDevMins,
};

const calculateConeTime_i = random.normal(coneTimeStats.mean, coneTimeStats.stdDev);

const customerArrivalStats = {};
customerArrivalStats.mean = input.customerArrivalMeanMins;
customerArrivalStats.lambda = 1 / customerArrivalStats.mean;

const calcTimeBetweenCustomers_i = random.exponential(customerArrivalStats.lambda);

const simulationRuns_i = input.simulationRuns;

module.exports = {
  timeWindow_i,
  calculateConeTime_i,
  calcTimeBetweenCustomers_i,
  simulationRuns_i,
};
