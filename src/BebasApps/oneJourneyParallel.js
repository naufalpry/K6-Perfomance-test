import { login } from './stressTestLogin.js';
import { inquiryBalance } from './stressTestInquiryBalance.js';
import { pageHomepage } from './stressTestHomepage.js';
import { InquiryPostpaidPLN } from './stressTestInquiryPostpaidPLN_PPOB.js';
import { InquiryPrepaidPLN } from './stressTestInquiryPrepaidPLN_PPOB.js';
import { InquiryTransaksi } from './stressTestInquiryTransaksi.js';
import { InquiryTransfer } from './stressTestInquiryTransfer.js';
import { getStages } from '../helper/stages.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { group } from 'k6';

export const options = {
    scenarios: {
      constant_request_rate: {
        executor: 'constant-arrival-rate',
        rate: 3, 
        timeUnit: '1s', 
        duration: '10s', 
        preAllocatedVUs: 1,
        maxVUs: 1,
      },
    },
  };

//   export let options = {
//   stages: getStages(),
// }; // load test

function logSuccess(endpoint) {
    console.log(`✅ Scenario ${endpoint} passed successfully`);
}

function logFailure(endpoint, message) {
    console.error(`❌ Scenario ${endpoint} failed: ${message}`);
}

function runParallelScenarios() {
    return Promise.all([
        new Promise((resolve) => {
            group("Login Scenario", function () {
                try {
                    console.log("Starting login");
                    const tokenLogin = login();
                    if (!tokenLogin) throw new Error("Login failed");
                    logSuccess("login");
                } catch (error) {
                    logFailure("login", error.message);
                } finally {
                    resolve();
                }
            });
        }),
        
        new Promise((resolve) => {
            group("Homepage Scenario", function () {
                try {
                    console.log("Accessing homepage");
                    const homepage = pageHomepage();
                    if (!homepage) throw new Error("Homepage access failed");
                    logSuccess("homepage");
                } catch (error) {
                    logFailure("homepage", error.message);
                } finally {
                    resolve();
                }
            });
        }),
        new Promise((resolve) => {
            group("Check Balance Scenario", function () {
                try {
                    console.log("Checking balance");
                    const saldo = inquiryBalance();
                    if (!saldo) throw new Error("Balance inquiry failed");
                    logSuccess("balance");
                } catch (error) {
                    logFailure("balance", error.message);
                } finally {
                    resolve();
                }
            });
        }),
        new Promise((resolve) => {
            group("PLN Postpaid Inquiry Scenario", function () {
                try {
                    console.log("Inquiry PLN postpaid");
                    const postpaidPLN = InquiryPostpaidPLN();
                    if (!postpaidPLN) throw new Error("Postpaid PLN inquiry failed");
                    logSuccess("inquiryPostpaidPLN");
                } catch (error) {
                    logFailure("inquiryPostpaidPLN", error.message);
                } finally {
                    resolve();
                }
            });
        }),
        new Promise((resolve) => {
            group("PLN Prepaid Inquiry Scenario", function () {
                try {
                    console.log("Inquiry PLN prepaid");
                    const prepaidPLN = InquiryPrepaidPLN();
                    if (!prepaidPLN) throw new Error("Prepaid PLN inquiry failed");
                    logSuccess("InquiryprepaidPLN");
                } catch (error) {
                    logFailure("InquiryprepaidPLN", error.message);
                } finally {
                    resolve();
                }
            });
        }),
        new Promise((resolve) => {
            group("Transfer Scenario", function () {
                try {
                    console.log("Inquiry transfer");
                    const transfer = InquiryTransfer();
                    if (!transfer) throw new Error("Transfer failed");
                    logSuccess("Inquirytransfer");
                } catch (error) {
                    logFailure("Inquirytransfer", error.message);
                } finally {
                    resolve();
                }
            });
        }),
        new Promise((resolve) => {
            group("Transaction History Scenario", function () {
                try {
                    console.log("Checking transaction history");
                    const transaksiHistory = InquiryTransaksi();
                    if (!transaksiHistory) throw new Error("Transaction history inquiry failed");
                    logSuccess("transaction history");
                } catch (error) {
                    logFailure("transaction history", error.message);
                } finally {
                    resolve(); 
                }
            });
        }),
    ]);
}

export default function () {
    runParallelScenarios();
}

export function handleSummary(data) {
    return {
        "./report/report.html": htmlReport(data),
    };
}