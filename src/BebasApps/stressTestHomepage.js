import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';
import { login } from './stressTestLogin.js';
import { getStages } from '../helper/stages.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const credentials = new SharedArray('users', function () {
  return JSON.parse(open('../Config/credential.json')).users;
});

const config = JSON.parse(open('../Config/credential.json'));
const XRequestID = config.XRequestID;

const menuTrend = new Trend('menu_duration');
const menuV2Trend = new Trend('menuV2_duration');
const BannerPromoTrend = new Trend('BannerPromoTrend_duration');
const customerInfoPointTrend = new Trend('customerInfoPointTrend_duration');
const notificationTrend = new Trend('notificationTrend_duration');
const BannerInfoTrend = new Trend('bannerInfoTrend_duration');
const balanceTrend = new Trend('balance_duration');
const ProfileInfoTrend = new Trend('profile_info_duration');

export let options = {
  stages: getStages(),
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'menu_duration': ['avg<400', 'p(95)<600'],
    'menuV2_duration': ['avg<400', 'p(95)<600'],
    'BannerPromoTrend_duration': ['avg<400', 'p(95)<600'],
    'customerInfoPointTrend_duration': ['avg<400', 'p(95)<600'], 
    'notificationTrend_duration': ['avg<400', 'p(95)<600'], 
    'balance_duration': ['avg<400', 'p(95)<600'], 
    'bannerInfoTrend_duration': ['avg<400', 'p(95)<600'], 
    'profile_info_duration': ['avg<400', 'p(95)<600'], 
    'http_req_failed': ['rate<0.01'], 
  },
};

export default function () {
  pageHomepage();
}

export function pageHomepage () {
    const loginToken = login();

    'Access homepage menu'
    const startMenu = Date.now();
    const menuResponse1 = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/menu',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN' } }
    );
    const endMenu = Date.now();
    menuTrend.add(endMenu - startMenu);
    console.log(`Access homepage menu HTTP status: ${menuResponse1.status}`);
    check(menuResponse1, {
      'status code is 200 get menu homepage': (r) => r.status === 200,
      'response success get data menu': (r) => {
        const data = r.json('data');
        return Array.isArray(data) &&
          data.every(item => item.menuId !== undefined && typeof item.menuId === 'string');
      },
      'response success menu TRANSFER displayed': (r) => {
        const menuItems = r.json('data');
        return menuItems.some(item => item.menuId === 'TRANSFER');
      },
      'response success menu PURCHASE displayed': (r) => {
        const menuItems = r.json('data');
        return menuItems.some(item => item.menuId === 'PURCHASE');
      },
      'response success menu PAYMENT displayed': (r) => {
        const menuItems = r.json('data');
        return menuItems.some(item => item.menuId === 'PAYMENT');
      },
      'response success menu TOPUP displayed': (r) => {
        const menuItems = r.json('data');
        return menuItems.some(item => item.menuId === 'TOPUP');
      },
      'response success menu CARDLESS WD displayed': (r) => {
        const menuItems = r.json('data');
        return menuItems.some(item => item.menuId === 'CARDLESS_WD');
      },
      'response success menu INVESTMENT displayed': (r) => {
        const menuItems = r.json('data');
        return menuItems.some(item => item.menuId === 'INVESTMENT');
      },
      'response success menu OTHER displayed': (r) => {
        const menuItems = r.json('data');
        return menuItems.some(item => item.menuId === 'OTHER');
      }
    });
    
    sleep(0.01);

    'Access homepage menu v2'
    const startMenuV2 = Date.now();
    const menuResponseV2 = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/v2/menu',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN' } }
    );
    const endMenuV2 = Date.now();
    menuV2Trend.add(endMenuV2 - startMenuV2);
    console.log(`Access homepage menu v2 HTTP status: ${menuResponseV2.status}`);
    check(menuResponseV2, {
      'status code is 200 get menu v2 homepage': (r) => r.status === 200,
    });
    
    sleep(0.01);

    'Access homepage promo banner'
    const startBannerPromo = Date.now();
    const BannerPromoResponseV2 = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/homepage/banner/promo?promo-type=OTHER',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN' } }
    );
    const endBannerPromo = Date.now();
    BannerPromoTrend.add(endBannerPromo - startBannerPromo);
    console.log(`Access homepage promo banner HTTP status: ${BannerPromoResponseV2.status}`);
    check(BannerPromoResponseV2, {
      'status code is 200 get data banner promo': (r) => r.status === 200,
      'response success get data banner promo': (r) => {
        const data = r.json('data');
        return Array.isArray(data) &&
               data.every(item => 
                 item.id !== undefined &&
                 item.imageUrlThumbnail !== undefined &&
                 item.imageUrlOriginal !== undefined &&
                 item.startPeriode !== undefined &&
                 item.endPeriode !== undefined &&
                 item.title !== undefined &&
                 item.description !== undefined &&
                 item.promoCategory !== undefined &&
                 item.cta !== undefined &&
                 item.cta.ctaTitle !== undefined &&
                 item.cta.ctaLink !== undefined &&
                 item.tnc !== undefined &&
                 item.howToUse !== undefined &&
                 item.customerServiceInfo !== undefined
               );
      }
    });
    
    sleep(0.01);

    'Get account bank homepage - inquiry balance'
    const startBalance = Date.now();
    const menuResponse2 = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/customer-info/get-account-bank?param=saldo',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN' } }
    );
    const endBalance = Date.now();
    balanceTrend.add(endBalance - startBalance);
    console.log(`Get account bank homepage HTTP status: ${menuResponse2.status}`);
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
    
    sleep(0.01);
    // console.log(`Response Body check balance homepage: ${menuResponse2.body}`);

    'Access customer info point'
    const startCustomerInfoPoint = Date.now();
    const CustomerInfoPoint = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/customer-info/points',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN', 'X-Request-ID': XRequestID } }
    );
    const endCustomerInfoPoint = Date.now();
    customerInfoPointTrend.add(endCustomerInfoPoint - startCustomerInfoPoint);
    console.log(`Access customer info point HTTP status: ${CustomerInfoPoint.status}`);
    check(CustomerInfoPoint, {
      'status code is 200 get data customer info point': (r) => r.status === 200,
      'response success get data customer info point': (r) => {
        const data = r.json('data');
        return data !== undefined &&
               data.points !== undefined &&
               data.expired_at !== undefined &&
               data.is_onboarded !== undefined &&
               data.is_earned !== undefined &&
               data.next_period_points_balance !== undefined &&
               data.next_period_points_balance_expired_at !== undefined;
      }
    });
    
    sleep(0.01);

    'Access notification'
    const startNotification = Date.now();
    const notification = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/notification/count/unread',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'id-ID' } }
    );
    const endNotification = Date.now();
    notificationTrend.add(endNotification - startNotification);
    console.log(`notification HTTP status: ${notification.status}`);
    check(notification, {
      'status code is 200 get data notification': (r) => r.status === 200,
      'response success get data notification retail': (r) => {
        const data = r.json('data');
        return data !== undefined &&
               data.total !== undefined &&
               Array.isArray(data.detail) &&
               data.detail.every(item => item.type !== undefined && item.total !== undefined);
      }
    });
    
    sleep(0.01);

    'Access homepage banner info'
    const startBannerInfo = Date.now();
    const BannerInfoResponse = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/homepage/banner/info',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN' } }
    );
    const endBannerInfo = Date.now();
    BannerInfoTrend.add(endBannerInfo - startBannerInfo);
    console.log(`Banner Info HTTP status: ${BannerInfoResponse.status}`);
    check(BannerInfoResponse, {
      'status code is 200 get data banner promo': (r) => r.status === 200,
      'response success get data banner promo': (r) => {
        const data = r.json('data');
        return Array.isArray(data) &&
               data.every(item => 
                 item.imageUrl !== undefined
               );
      }
    });
    
    sleep(0.01);

    'Get profile info'
    const startProfileInfo = Date.now();
    const ProfileInfo = http.get('https://api.xxxx.xx.xx/xxxx.xx.xx/customer-info/get-profile',
      { headers: { 'Authorization': `Bearer ${loginToken}`, 'Accept-Language': 'en-EN', 'X-Request-ID': XRequestID } }
    );
    const endProfileInfo = Date.now();
    ProfileInfoTrend.add(endProfileInfo - startProfileInfo);
    console.log(`Profile Info HTTP status: ${ProfileInfo.status}`);
    check(ProfileInfo, {
      'status code is 200 get data profile info': (r) => r.status === 200,
      'response success get data profile info': (r) => {
        const data = r.json('data');
        return data !== undefined &&
               data.fullName !== undefined &&
               data.phoneNumber !== undefined &&
               data.email !== undefined &&
               data.address !== undefined &&
               data.npwp !== undefined &&
               data.languagePreference !== undefined &&
               data.nik !== undefined;
      }
    });
    
    sleep(0.01);
}

export function handleSummary(data) {
  return {
    "./report/report.html": htmlReport(data),
  };
}
