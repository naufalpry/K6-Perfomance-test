import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Counter, Rate, Trend } from 'k6/metrics';
import { getStages } from '../helper/stages.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const credentials = new SharedArray('users', function () {
  return JSON.parse(open('../Config/credential.json')).users;
});

const apiToken = JSON.parse(open('../Config/credential.json')).api_token;

const loginTrend = new Trend('login_duration');
const successfulLogins = new Counter('successful_logins');
const failedLogins = new Counter('failed_logins');
let errorRate = new Rate('error_rate');

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'], 
    'login_duration': ['avg<400', 'p(95)<600'], 
    'successful_logins': ['count>10'],
    'failed_logins': ['count<5'],
    'error_rate': ['rate<0.05'],
    'http_req_failed': ['rate<0.01'],
  },
};

export function login() {
  'Get accessToken'
  const guestResponse = http.post('https://api.xxxx.xx.xx/xxxx.xx.xx/guest/session/create', 
    JSON.stringify({ guestId: "aaaaa" }), 
    { headers: { 'Authorization': `Bearer ${apiToken}`, 'Content-Type': 'application/json' } }
  );

  console.log(`Guest API HTTP status: ${guestResponse.status}`);
  check(guestResponse, {
    'status code is 200 get jwt token - guest': (r) => r.status === 200,
    // 'response success create jwt accessToken': (r) => r.json('data.accessToken') !== undefined,
  });

  const accessToken = guestResponse.json('data.accessToken');
  
  'Login with each credential'
  for (const user of credentials) {
    const start = Date.now();

    const loginResponse = http.post('https://api.xxxx.xx.xx/xxxx.xx.xx/auth/login',
      JSON.stringify({
        nik: user.nik,
        deviceId: user.deviceId,
        deviceToken: user.deviceToken,
        password: user.password,
        phoneNumber: user.phoneNumber,
        clientTimeMilis: user.clientTimeMilis,
        activationId: user.activationId
      }),
      { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    const end = Date.now();
    loginTrend.add(end - start);

    console.log(`Auth login API HTTP status: ${loginResponse.status}`);
    const loginSuccessful = check(loginResponse, {
      'status code is 200 get accessToken - auth login': (r) => r.status === 200,
      // 'response success create accessToken login': (r) => r.json('data.accessToken') !== undefined,
    });


    if (loginSuccessful) {
      successfulLogins.add(1); // Tambah 1 ke hitungan login sukses
    } else {
      failedLogins.add(1); // Tambah 1 ke hitungan login gagal
    }


    errorRate.add(!loginSuccessful); // Jika gagal, hitung sebagai error
    const loginToken = loginResponse.json('data.accessToken');
    sleep(0.01);

    return loginToken;
  }
}


export default function () {
  login();
}

export function handleSummary(data) {
  return {
    "./report/report.html": htmlReport(data),
  };
}
