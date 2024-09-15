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
const InquiryPrepaidPLNTrend = new Trend('InquiryPrepaidPLNTrend_duration');

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    'GetFavoriteBillPaymentPostpaidPLN_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'getLastThreeTrxPostpaidPLNTrend_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'InquiryPrepaidPLNTrend_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'http_req_failed': ['rate<0.01'], // Failure rate should be less than 1%
  },
};

export default function () {
    InquiryPrepaidPLN();
}

export function InquiryPrepaidPLN() {
    const loginToken = login();
    
    console.log('Get favorite-prepaid - get favorite');
    let response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/favorite-prepaid/get-favorite', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
    });
    GetFavoriteBillPaymentPostpaidPLNTrend.add(response.timings.duration);
    console.log(`Get favorite prepaid HTTP status: ${response.status}`);
    check(response, {
      'status code is 200 get favorite prepaid PLN': (r) => r.status === 200,
      'response success get favorite prepaid PLN': (r) => r.json('message') === 'SUCCESS'
    });
    sleep(0.01);

    console.log('Last-three-transactions - prepaid PLN');
    response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/transaction-history/prepaid/last-three-trx?type=Listrik', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
    });
    getLastThreeTrxPostpaidPLNTrend.add(response.timings.duration);
    console.log(`Last three transactions HTTP status: ${response.status}`);
    check(response, {
      'status code is 200 get last three transaction prepaid PLN': (r) => r.status === 200,
      'response success get last three transaction prepaid PLN': (r) => r.json('message') === 'SUCCESS'
    });
    sleep(0.01);

    for (const user of credentials) {
      console.log('Create inquiry prepaid PLN');
  
      const inquiryPrepaidPayload = {
        fromAccountNumber: user.accountNumber,
        customerId: user.customerId_prepaid,
        amount: user.amount
      };

      const params = {
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Sub': config.users.sub
        }
      };

      let startInquiryPrepaidPLN = Date.now();
      let InquiryTransaksiPrepaidResponse = http.post(
        'https://api.xxxx.xx.xx/xxxx.xx.xx/pln/inquiry/prepaid',
        JSON.stringify(inquiryPrepaidPayload),
        params
      );
      let endInquiryPrepaidPLN = Date.now();
      
      InquiryPrepaidPLNTrend.add(endInquiryPrepaidPLN - startInquiryPrepaidPLN);
      console.log(`Create inquiry prepaid PLN HTTP status: ${InquiryTransaksiPrepaidResponse.status}`);
      check(InquiryTransaksiPrepaidResponse, {
        'status code is 200 create inquiry prepaid PLN': (r) => r.status === 200,
        'response success create inquiry prepaid PLN': (r) => {
          const data = r.json('data');
          return data !== undefined && data !== null;
        }
      });
      sleep(0.01);
    }
}
