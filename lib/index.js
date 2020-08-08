const {
  timeWindow_i,
  calculateConeTime_i,
  calcTimeBetweenCustomers_i,
  simulationRuns_i,
} = require('./consts');
const simulation = require('./simulation');
const simulationNormal = require('./simulation-normal');

// < Average Wait VIP: 41.89834305234547
// < programRunTime: 42.188ms

/*
// TO DO:

- Array references in customerCalcs function
- preCommit Hook into tests
- get rid of reduce functions for tests, incorporate into customerCalcs or make them dependent
  on test environment (NODE_ENV=development)
- fix var names (timeWindow_i) and reduce repetition where possible

*/

/*
    + Assumptions +
    - Can only make one cone at a time
    - Customers must wait in line after arriving if a cone is in progress
*/

console.log(timeWindow_i);
console.log(simulationRuns_i);
console.log(calculateConeTime_i);
console.log(calcTimeBetweenCustomers_i);

const waitTimesArray = simulation(
  timeWindow_i,
  simulationRuns_i,
  calculateConeTime_i,
  calcTimeBetweenCustomers_i,
);

// console.log(`test`);
// const testing = simulationNormal(7, 7, 1, 7, 1001);

// console.log(`test`);
// const testing2 = simulationNormal(7, 7, 1, 7, 1001);

// console.log(`test`);
// const testing3 = simulationNormal(7, 7, 1, 7, 1001);

// console.log(`test`);
// const testing4 = simulationNormal(7, 7, 1, 7, 1001);

