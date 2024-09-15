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
const GetFavoriteBillPaymentPostpaidPLNTrend = new Trend('GetFavoriteBillPaymentPostpaidPLN_duration');
const getLastThreeTrxPostpaidPLNTrend = new Trend('getLastThreeTrxPostpaidPLNTrend_duration');
const InquiryPospaidPLNTrend = new Trend('InquiryPospaidPLNTrend_duration');

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    'GetFavoriteBillPaymentPostpaidPLN_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'getLastThreeTrxPostpaidPLNTrend_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'InquiryPospaidPLNTrend_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'http_req_failed': ['rate<0.01'], // Failure rate should be less than 1%
  },
};


export default function () {
  InquiryPostpaidPLN(); 
}
export function InquiryPostpaidPLN() {
  const loginToken = login();
    console.log('Get favorite bill payment - get favorite');
    let response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/favorite-bill/get-favorite', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
    });
    GetFavoriteBillPaymentPostpaidPLNTrend.add(response.timings.duration);
    console.log(`Get favorite bill payment HTTP status: ${response.status}`);
    check(response, {
      'status code is 200 get favorite bill payment postpaid': (r) => r.status === 200,
      'response success get favorite bill payment postpaid': (r) => r.json('message') === 'SUCCESS'
    });
    sleep(0.01);

    '2. Get last three transactions'
    console.log('Last-three-transactions - postpaid PLN');
    response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/transaction-history/postpaid/last-three-trx?type=Listrik', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
    });
    getLastThreeTrxPostpaidPLNTrend.add(response.timings.duration);
    console.log(`Get last three transactions HTTP status: ${response.status}`);
    check(response, {
      'status code is 200 get last three transaction postpaid PLN': (r) => r.status === 200,
      'response success get last three transaction postpaid PLN': (r) => r.json('message') === 'SUCCESS'
    });
    sleep(0.01);

    for (const user of credentials) {
      console.log('Create inquiry postpaid PLN');
  
      const inquiryPayload = {
        fromAccountNumber: user.accountNumber,
        customerId: user.customerId_postpaid
      };

      const params = {
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Sub': config.users.sub
        }
      };

      let startInquiryPospaidPLN = Date.now();
      let InquiryTransaksiPostpaidResponse = http.post(
        'https://api.xxxx.xx.xx/xxxx.xx.xx/pln/inquiry/postpaid',
        JSON.stringify(inquiryPayload),
        params
      );
      let endInquiryPospaidPLN = Date.now();
      
      InquiryPospaidPLNTrend.add(endInquiryPospaidPLN - startInquiryPospaidPLN);
      // usedUsers.add(user.accountNumber);
      console.log(`Create inquiry postpaid PLN HTTP status: ${InquiryTransaksiPostpaidResponse.status}`);
      check(InquiryTransaksiPostpaidResponse, {
        'status code is 200 create inquiry postpaid PLN': (r) => r.status === 200,
        'response success create inquiry postpaid PLN': (r) => {
          const data = r.json('data');
          return data !== undefined && data !== null;
        }
      });    
    sleep(0.01);
    }
    // console.log('Users used during the test:');
    // console.log([...usedUsers]);
}
