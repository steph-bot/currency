const {
  timeWindow_i,
  calculateConeTime_i,
  calcTimeBetweenCustomers_i,
  simulationRuns_i,
} = require('./consts');
const simulation = require('./simulation');

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

const waitTimesArray = simulation(
  timeWindow_i,
  simulationRuns_i,
  calculateConeTime_i,
  calcTimeBetweenCustomers_i,
);
