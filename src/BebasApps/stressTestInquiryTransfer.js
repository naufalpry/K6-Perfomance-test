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

const GetFavoriteTransferTrend = new Trend('GetFavoriteTransferTrend_duration');
const getLastThreeTrxTransferTrend = new Trend('getLastThreeTrxTransferTrend_duration');
const InquiryTransferTrend = new Trend('InquiryTransferTrend_duration');
const GetMethodTransferTrend = new Trend('GetMethodTransferTrend_duration');
const GetBalancePageTransferTrend = new Trend('GetBalancePageTransferTrend_duration');
const limitTransferVerificationTrend = new Trend('limitTransferVerificationTrend_duration');
const getListBankTransferTrend = new Trend('getListBankTransferTrend_duration');
getListBankTransferTrend

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'], 
    'GetFavoriteTransferTrend_duration': ['avg<400', 'p(95)<600'], 
    'getLastThreeTrxTransferTrend_duration': ['avg<400', 'p(95)<600'], 
    'InquiryTransferTrend_duration': ['avg<400', 'p(95)<600'], 
    'GetMethodTransferTrend_duration': ['avg<400', 'p(95)<600'],
    'GetBalancePageTransferTrend_duration': ['avg<400', 'p(95)<600'],
    'limitTransferVerificationTrend_duration': ['avg<400', 'p(95)<600'],
    'getListBankTransferTrend_duration': ['avg<400', 'p(95)<600'], 
    'http_req_failed': ['rate<0.01'],
  },
};

export default function () {
    InquiryTransfer();
}

export function InquiryTransfer() {
    const loginToken = login();

    console.log('Get favorite transfer - get favorite');
    let response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/favorite', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
    });
    GetFavoriteTransferTrend.add(response.timings.duration);
    console.log(`Get favorite transfer HTTP status: ${response.status}`);
    check(response, {
      'status code is 200 get favorite transfer': (r) => r.status === 200,
      'response success get favorite transfer': (r) => r.json('message') === 'SUCCESS'
    });
    sleep(0.01);

    console.log('Last three transactions - transfer');
    response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/transaction-history/last-three-trx', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
    });
    getLastThreeTrxTransferTrend.add(response.timings.duration);
    console.log(`Last three transactions HTTP status: ${response.status}`);
    check(response, {
      'status code is 200 get last three transaction transfer': (r) => r.status === 200,
      'response success get last three transaction transfer': (r) => r.json('message') === 'SUCCESS'
    });
    sleep(0.01);

    console.log('Transfer bank - Get list bank');
    response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/transfer/listbank', {
      headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
    });
    getListBankTransferTrend.add(response.timings.duration);
    console.log(`Get list bank HTTP status: ${response.status}`);
    check(response, {
      'status code is 200 get list bank transfer': (r) => r.status === 200,
      'response success get list bank transfer': (r) => r.json('message') === 'SUCCESS'
    });
    sleep(0.01);


    for (const user of credentials) {
      console.log('Create inquiry transfer xxxx.xx.xx');
  
      const inquiryTransferPayload = {
        accountNumber: user.accountNumber,
        destinationAccountNumber: user.destinationAccountNumber
      };

      const params = {
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Sub': config.users.sub
        }
      };

      let startInquiryTransfer = Date.now();
      let InquiryTransferResponse = http.post(
        'https://api.xxxx.xx.xx/xxxx.xx.xx/transfer/inquiry/bank',
        JSON.stringify(inquiryTransferPayload),
        params
      );
      let endInquiryTransfer = Date.now();
      
      InquiryTransferTrend.add(endInquiryTransfer - startInquiryTransfer);
      console.log(`Create inquiry transfer HTTP status: ${response.status}`);
      check(InquiryTransferResponse, {
        'status code is 200 create inquiry transfer': (r) => r.status === 200,
        'response success create inquiry transfer': (r) => {
          const data = r.json('data');
          return data !== undefined && data !== null;
        }
      });
      sleep(0.01);

      console.log('Get balance page transfer');
      response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/customer-info/v2/get-account-bank?param=null', {
        headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
      });
      GetBalancePageTransferTrend.add(response.timings.duration);
      console.log(`Get balance page transfer HTTP status: ${response.status}`);
      check(response, {
        'status code is 200 get balance transfer page': (r) => r.status === 200
      });
      
      // console.log(`Response Body check balance in inquiry transfer: ${response.body}`);
      sleep(0.01);

      console.log('Get method transfer');
      response = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/transfer/method-transfer', {
        headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept': 'application/json' }
      });
      GetMethodTransferTrend.add(response.timings.duration);
      console.log(`Get method transfer HTTP status: ${response.status}`);
      check(response, {
        'status code is 200 get method transfer': (r) => r.status === 200,
        'response success get method transfer': (r) => r.json('message') === 'SUCCESS'
      });
      sleep(0.01);

      console.log('Verification limit transfer');
      const limitTransferPayload = {
        "accountNumber": user.accountNumber,
        "transactionType": "Pemindahbukuan",
        "amount": 10000.0
      };
    
      const limitTransferParams = {
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Sub': config.users.sub
        }
      };

      response = http.post('https://api.xxxx.xx.xx/xxxx.xx.xx/limit-transfer/verification', 
        JSON.stringify(limitTransferPayload), 
        limitTransferParams
      );
      
      limitTransferVerificationTrend.add(response.timings.duration);
      console.log(`Verification limit transfer HTTP status: ${response.status}`);
      check(response, {
        'status code is 200 verification limit transfer': (r) => r.status === 200,
        'response success verification limit transfer': (r) => r.json('message') === 'SUCCESS'
      });
      // console.log(`Response Body LIMIT: ${response.body}`);
    
      sleep(0.01);
    }
}
