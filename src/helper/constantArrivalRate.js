// constantArrivalRate.js
export const constantArrivalRateOptions = {
  executor: 'constant-arrival-rate',
  rate: 100,        // Jumlah permintaan per detik
  timeUnit: '1s',
  duration: '2m',   // Durasi pengujian
  preAllocatedVUs: 50,
  maxVUs: 200,
};
