const { performance } = require('perf_hooks');

const customerArrives = (arrivalTime, customerArray, calculateConeTime) => {
  const coneTime = calculateConeTime();
  const customer = {
    arrivalTime,
    coneTime,
    earliestLeaveTime: arrivalTime + coneTime,
  };
  customerArray.push(customer);
};

const customerCalcs = (customerArray) => {
  const i = customerArray.length - 1;
  if (i === 0) {
    // 1st Customer
    customerArray[0].leaveTime = customerArray[0].earliestLeaveTime;
    customerArray[0].waitTime = 0;
    customerArray[0].systemWaitTime = customerArray[0].waitTime + customerArray[0].coneTime;
  } else {
    // Subsequent Customers
    customerArray[i].waitTime = customerArray[i - 1].leaveTime - customerArray[i].arrivalTime;
    if (customerArray[i].waitTime < 0) {
      customerArray[i].waitTime = 0;
    }
    customerArray[i].leaveTime = customerArray[i].waitTime + customerArray[i].earliestLeaveTime;
    customerArray[i].systemWaitTime = customerArray[i].waitTime + customerArray[i].coneTime;
  }
};

const arrayAverage = (array) => array.reduce((a, b) => a + b) / array.length;

const simulation = (
  timeWindow,
  simulationRuns,
  calculateConeTime,
  calcTimeBetweenCustomers,
) => {
  // console.time('programRunTime');
  const programStartTime = performance.now();
  const VIPWaitTimesArray = [];
  const meanWaitInSystemArray = [];
  const meanWaitInQueueArray = [];
  for (let i = 0; i < simulationRuns; i++) {
    const customerQueue = [];
    for (let time = 0; time < timeWindow.mins;) {
      const timeTillNextCustomer = calcTimeBetweenCustomers();
      const arrivalTime = time + timeTillNextCustomer;

      if (arrivalTime < timeWindow.mins) {
        time = arrivalTime;
        customerArrives(arrivalTime, customerQueue, calculateConeTime);
        customerCalcs(customerQueue);
      } else {
        time = timeWindow.mins;
      }
    }

    const VIPCustomer = {};
    VIPCustomer.arrivalTime = timeWindow.mins;
    const lastCustomerLeaveTime = customerQueue[customerQueue.length - 1].leaveTime;
    VIPCustomer.waitTime = lastCustomerLeaveTime - VIPCustomer.arrivalTime;
    if (VIPCustomer.waitTime < 0) {
      VIPCustomer.waitTime = 0;
    }

    VIPWaitTimesArray.push(VIPCustomer.waitTime);

    /// ////// stephania here

    const allCustomerSystemWaitTimesArray = customerQueue.reduce((acc, customer, index) => {
      acc[index] = customer.systemWaitTime;
      return acc;
    }, []);

    const allCustomerQueueWaitTimesArray = customerQueue.reduce((acc, customer, index) => {
      acc[index] = customer.waitTime;
      return acc;
    }, []);

    const meanWaitInSystem = arrayAverage(allCustomerSystemWaitTimesArray);
    const meanWaitInQueue = arrayAverage(allCustomerQueueWaitTimesArray);
    meanWaitInSystemArray.push(meanWaitInSystem);
    meanWaitInQueueArray.push(meanWaitInQueue);
    // debugger;

    /// ///// stephania here
  }

  const simOutput = {
    rawData: {
      waitTimeForVIP: VIPWaitTimesArray,
      meanWaitTimeForAllCustomers: {
        system: meanWaitInSystemArray,
        queue: meanWaitInQueueArray,
      },
    },
    simSummary: {
      meanWaitTimeForVIP: arrayAverage(VIPWaitTimesArray), // avg wait for VIP customer
      meanMeanWaitTimeForAllCustomers: {
        system: arrayAverage(meanWaitInSystemArray),
        queue: arrayAverage(meanWaitInQueueArray),
      },
    },
  };

  console.log(`Average Wait for VIP Customer: ${simOutput.simSummary.meanWaitTimeForVIP}`);
  /// ////// stephania here
  console.log(`Mean Wait in System (wait in queue + service time): ${simOutput.simSummary.meanMeanWaitTimeForAllCustomers.system}`);
  console.log(`Mean Wait in Queue (wait in queue): ${simOutput.simSummary.meanMeanWaitTimeForAllCustomers.queue}`);
  /// ////// stephania here
  const programEndTime = performance.now();
  simOutput.simSummary.programRunTime = (programEndTime - programStartTime);
  console.log(`Program Run Time (ms): ${simOutput.simSummary.programRunTime}`);
  return simOutput;
};

module.exports = simulation;
