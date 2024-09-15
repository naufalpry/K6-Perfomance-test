import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';
import { login } from './stressTestLogin.js';
import { getStages } from '../helper/stages.js';

const credentials = new SharedArray('users', function () {
  return JSON.parse(open('../Config/credential.json')).users;
});

const config = JSON.parse(open('../Config/credential.json'));
const XRequestID = config.XRequestID;

const balanceTrend = new Trend('balance_duration');

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    'balance_duration': ['avg<400', 'p(95)<600'], // Custom metric for balance query duration
    'http_req_failed': ['rate<0.01'], // Failure rate should be less than 1%
  },
};

export default function () {
  inquiryBalance(); 
}
export function inquiryBalance() {
  const loginToken = login();
    console.log('Get account bank - inquiry balance');
    'Get account bank homepage - inquiry balance'
    const startBalance = Date.now();
    const menuResponse2 = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/customer-info/get-account-bank?param=createdDate', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN' }
    });
    const endBalance = Date.now();
    balanceTrend.add(endBalance - startBalance);
    console.log(`Get account bank HTTP status: ${menuResponse2.status}`);
    check(menuResponse2, {
      'status code is 200 get data balance': (r) => r.status === 200,
      'response success get data balance': (r) => {
        const data = r.json('data');
        return (
          data.savings !== undefined &&
          Array.isArray(data.savings) &&
          data.giro !== undefined &&
          Array.isArray(data.giro) &&
          data.deposit !== undefined &&
          Array.isArray(data.deposit)
        );
      },
      'response success get data saving displayed': (r) => {
        const savings = r.json('data.savings');
        return savings.every(item => 
          item.accountNo !== undefined &&
          item.accountName !== undefined &&
          item.productName !== undefined
        );
      },
      'response success get data giro displayed': (r) => {
        const giro = r.json('data.giro');
        return Array.isArray(giro);
      },
      'response success get data deposit displayed': (r) => {
        const deposit = r.json('data.deposit');
        return deposit.every(item => 
          item.depositNumber !== undefined &&
          item.currency !== undefined &&
          item.amount !== undefined
        );
      }
    });
    console.log(`Response Body: ${r.status}`);
    sleep(0.01);
    
}
