export function getStages() {
  return [
    { duration: '30s', target: 1 },
    // { duration: '20s', target: 0 },
  ];
}



// //===================================//
// //Load test 20 menit
// export function getStages() {
//   return [
//     { duration: '2m', target: 5 },
//     { duration: '16m', target: 20 },
//     { duration: '2m', target: 0 },
//   ];
// }

// export const options = {
//   vus: 100,
//   duration: '5m',
// }; // Stress test

// //Stress test 25 menit max 20 user
// export function getStages() {
//   return [
//     { duration: '5m', target: 50 },
//     { duration: '5m', target: 100 },
//     { duration: '5m', target: 250 },
//     { duration: '2m', target: 0 },
//   ];
// }

// //Stress test 25 menit max 30 user
// export function getStages() {
//   return [
//     { duration: '2m', target: 5 },
//     { duration: '5m', target: 10 },
//     { duration: '3m', target: 20 },
//     { duration: '10m', target: 30 },
//     { duration: '5m', target: 0 },
//   ];
// }

// //Stress test 25 menit max 50 user
// export function getStages() {
//   return [
//     { duration: '2m', target: 5 },
//     { duration: '5m', target: 10 },
//     { duration: '3m', target: 30 },
//     { duration: '10m', target: 50 },
//     { duration: '5m', target: 0 },
//   ];
// }

// //Stress test 25 menit max 50 user
// export function getStages() {
//   return [
//   { duration: '5m', target: 10 },  // Increase to 10 user over 5 minute 
//   { duration: '5m', target: 20 },  // Increase to 20 user over 5 minute 
//   { duration: '5m', target: 30 },  // Increase to 30 user over 5 minute
//   { duration: '10m', target: 50 },  // Increase to 50 user over 15 minute
//   { duration: '15m', target: 100 },  // Increase to 50 user over 15 minute
//   { duration: '15m', target: 150 },  // Increase to 50 user over 15 minute
//   { duration: '5m', target: 0 },  // Ramp down to 0 users over 5 minute
  
//   ];
// }


//error rate trigger in max 50%, dibawah 50% stopped