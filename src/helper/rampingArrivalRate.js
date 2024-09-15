// rampingArrivalRate.js
export const rampingArrivalRateOptions = {
  executor: 'ramping-arrival-rate',
  startRate: 10,    // Laju kedatangan awal
  endRate: 100,     // Laju kedatangan akhir
  timeUnit: '1s',
  duration: '5m',   // Durasi ramping
  preAllocatedVUs: 50,
  maxVUs: 200,
};
