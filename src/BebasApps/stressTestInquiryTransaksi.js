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

const InquiryTransaksiTrend = new Trend('InquiryTransaksi_duration');
const InquiryTransaksiStatementEmailTrend = new Trend('InquiryTransaksiStatementEmailTrend_duration');

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'], 
    'InquiryTransaksi_duration': ['avg<400', 'p(95)<600'], 
    'InquiryTransaksiStatementEmailTrend_duration': ['avg<400', 'p(95)<600'],
    'http_req_failed': ['rate<0.01'],
  },
};

export default function () {
  InquiryTransaksi();
}

export function InquiryTransaksi() {
  const loginToken = login();

  // Loop through each user for inquiry transaksi
  for (const user of credentials) {
    console.log('Get history - inquiry transaksi');

    const startInquiryTransaksi = Date.now();
    const InquiryTransaksiResponse = http.post(
      'https://api.xxxx.xx.xx/xxxx.xx.xx/statement/mutasi',
      JSON.stringify({
        accountNumber: user.accountNumber,
        startDate: user.startDate,
        endDate: user.endDate,
        text: user.text,
        dataIndex: user.dataIndex
      }),
      {
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Sub': config.users.sub
        }
      }
    );

    const endInquiryTransaksi = Date.now();
    InquiryTransaksiTrend.add(endInquiryTransaksi - startInquiryTransaksi);
    
    console.log(`Get history - inquiry transaksi HTTP status: ${InquiryTransaksiResponse.status}`);
    
    check(InquiryTransaksiResponse, {
      'status code is 200 check inquiry transaksi': (r) => r.status === 200,
      'response success check inquiry transaksi': (r) => r.json('message') === 'SUCCESS'
    });
    
    sleep(0.01);

    console.log('Send email statement transaksi');

    const startInquiryTransaksiStatementEmail = Date.now();
    const InquiryTransaksiStatementEmailResponse = http.post(
      'https://api.xxxx.xx.xx/xxxx.xx.xx/statement/email',
      JSON.stringify({
        accountNumber: user.accountNumber,
        period: {
          "year": "2024",
          "month": "08"
        }
      }),
      {
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Sub': config.users.sub
        }
      }
    );

    const endInquiryTransaksiStatementEmail = Date.now();
    InquiryTransaksiStatementEmailTrend.add(endInquiryTransaksiStatementEmail - startInquiryTransaksiStatementEmail);
    
    console.log(`Send email statement transaksi HTTP status: ${InquiryTransaksiStatementEmailResponse.status}`);
    
    check(InquiryTransaksiStatementEmailResponse, {
      'status code is 200 Send email statement transaksi': (r) => r.status === 200,
    });

    if (InquiryTransaksiStatementEmailResponse.status !== 200) {
      console.error(`Send email statement transaksi failed with status ${InquiryTransaksiStatementEmailResponse.status}`);
    }
    
    sleep(0.01);
  }
}
