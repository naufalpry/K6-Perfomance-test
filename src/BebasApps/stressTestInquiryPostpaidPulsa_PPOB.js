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
const GetFavoriteBillPaymentPostpaidPulsaTrend = new Trend('GetFavoriteBillPaymentPostpaidPulsaTrend_duration');
const getLastThreeTrxPostpaidPulsarend = new Trend('getLastThreeTrxPostpaidPulsarend_duration');
const InquiryPostpaidPulsaTrend = new Trend('InquiryPostpaidPulsaTrend_duration');

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    'GetFavoriteBillPaymentPostpaidPulsaTrend_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'getLastThreeTrxPostpaidPulsarend_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'InquiryPostpaidPulsaTrend_duration': ['avg<400', 'p(95)<600'], // Custom metric for request duration
    'http_req_failed': ['rate<0.01'], // Failure rate should be less than 1%
  },
};

export default function () {
    InquiryPostpaidPulsa();
}

export function InquiryPostpaidPulsa() {
    const loginToken = login();
    
//     console.log('Get favorite postpaid pulsa - get favorite');
//     let response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/favorite-postpaid-cellular/get-favorite?billingCategory=pascabayar', {
//       headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
//     });
//     GetFavoriteBillPaymentPostpaidPulsaTrend.add(response.timings.duration);

//     check(response, {
//       'status code is 200 get favorite pulsa postpaid': (r) => r.status === 200,
//       'response success get favorite pulsa postpaid': (r) => r.json('message') === 'SUCCESS'
      
//     });
//     sleep(0.01);

//     console.log('Last three transactions - postpaid Pulsa');
//     response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/transaction-history/postpaid/last-three-transactions?type=Pascabayar', {
//       headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
//     });
//     getLastThreeTrxPostpaidPulsarend.add(response.timings.duration);

//     check(response, {
//       'status code is 200 get last three transaction postpaid Pulsa': (r) => r.status === 200,
//       'response success get last three transaction postpaid Pulsa': (r) => r.json('message') === 'SUCCESS'
//     });
//     sleep(0.01);

    for (const user of credentials) {
      console.log('Create inquiry postpaid pulsa');
  
      const inquiryPrepaidPayload = {
        "accountName": "USERFABC",
        "accountNumber": "1001942987",
        "phoneNumber": "08122208111"
      };

      const params = {
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Sub': config.users.sub
        }
      };

      let startInquiryPulsaPostpaid = Date.now();
      let InquiryTransaksiPulsaPostpaiddResponse = http.post(
        'https://api.xxxx.xx.xx/xxxx.xx.xx/postpaid-cellular/inquiry',
        JSON.stringify(inquiryPrepaidPayload),
        params
      );
      let endInquiryPulsaPostpaid = Date.now();
      
      InquiryPostpaidPulsaTrend.add(endInquiryPulsaPostpaid - startInquiryPulsaPostpaid);

      const checkResult = check(InquiryTransaksiPulsaPostpaiddResponse, {
        // 'status code is 200 create inquiry postpaid pulsa': (r) => r.status === 400,
        // 'response success create inquiry postpaid pulsa': (r) => {
        //   const data = r.json('data');
        //   return data !== undefined && data !== null;
        // }
      });
  
      // Log response body if any check fails
        console.log(`Response Body: ${InquiryTransaksiPulsaPostpaiddResponse.body}`);

      console.log('Get balance page pulsa postpaid');
      response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/customer-info/get-account-bank?param=null', {
        headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
      });
      GetBalancePageTransferTrend.add(response.timings.duration);
  
      check(response, {
        'status code is 200 get balance pulsa page': (r) => r.status === 200
      });
      sleep(0.01);


      
      // console.log(`Response Body check balance postpaid pulsa: ${response.body}`);
    }
}
