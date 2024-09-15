**Stress test** dan **load test** adalah dua jenis pengujian kinerja yang penting untuk mexxxx.xx.xxtikan API mampu menangani berbagai tingkat permintaan. Berikut adalah penjelasan mengenai keduanya dan cara melakukannya di API menggunakan k6.

### **1. Load Test**
Load test mengukur performa sistem dalam menangani permintaan di bawah beban yang wajar atau diharapkan dalam kondisi normal.

**Tujuan**: 
Untuk mexxxx.xx.xxtikan bahwa sistem berfungsi dengan baik di bawah beban yang diharapkan (misalnya, 100 RPS selama 1 jam).

**Target**: 
Biasanya menjalankan API dengan tingkat pengguna atau request yang diantisipasi dalam produksi.

#### Contoh Load Test dengan k6
```javascript
import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  stages: [
    { duration: '2m', target: 50 }, // Naik ke 50 VU dalam 2 menit
    { duration: '3h56m', target: 50 }, // Tetap di 50 VU selama hampir 4 jam
    { duration: '2m', target: 0 }, // Turun kembali ke 0 VU dalam 2 menit
  ],
};
export default function () {
  http.get('https://your-api.com/endpoint');
  sleep(0.01);
}
```
**Penjelasan**:
**VU (Virtual Users)**: 
Menggunakan 50 VU yang berjalan selama hampir 4 jam, mensimulasikan beban pengguna nyata yang tetap.

**Tujuan**: 
Menguji stabilitas API selama periode panjang dengan beban tetap.
### **2. Stress Test**
Stress test digunakan untuk mengetahui batas maksimal kapasitas API dan melihat bagaimana ia bereaksi ketika beban sangat tinggi. Ini bertujuan untuk mencapai titik di mana sistem mulai gagal atau performa menurun.

**Tujuan**: 
Untuk mengetahui seberapa baik API menangani beban yang lebih tinggi dari yang diantisipasi (misalnya, skenario "spike").

**Target**: 
Menjalankan API dengan tingkat permintaan yang semakin meningkat hingga melebihi kapasitas.

#### Contoh Stress Test dengan k6
```javascript
import http from 'k6/http';
import { sleep } from 'k6';
export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Naik ke 100 VU dalam 2 menit
    { duration: '5m', target: 200 },  // Naik ke 200 VU dalam 5 menit
    { duration: '3m', target: 300 },  // Naik ke 300 VU dalam 3 menit
    { duration: '10m', target: 500 }, // Naik ke 500 VU dalam 10 menit
    { duration: '5m', target: 0 },    // Turun ke 0 VU dalam 5 menit
  ],
};
export default function () {
  http.get('https://your-api.com/endpoint');
  sleep(0.01);
}
```
**Penjelasan**:
**VU (Virtual Users)**: 
Pengguna virtual bertambah secara bertahap, dimulai dari 100 VU hingga mencapai 500 VU dalam kurun waktu 20 menit.

**Tujuan**: 
Mengetahui kapan API mulai mengalami penurunan performa atau kegagalan.
### **Perbedaan Utama: Stress Test vs Load Test**
**Load Test**: 
Mengukur performa sistem di bawah beban yang diharapkan (biasanya kondisi stabil dan realistis).
**Stress Test**: 
Mengukur kemampuan sistem untuk menangani beban ekstrem, bertujuan untuk menemukan batas kapasitas maksimum dan titik kegagalan.
### **Metrik yang Diamati**:
Untuk kedua jenis tes ini, metrik yang harus diperhatikan selama pengujian kinerja adalah:
**Response Time**: 
Waktu yang dibutuhkan API untuk merespon permintaan.
**Error Rate**: 
Jumlah atau persentase request yang gagal (HTTP 5xx atau 4xx).
**CPU dan Memory Usage**:
Kinerja dari server yang menangani API.
**Throughput (RPS)**: 
Jumlah request per second yang bisa ditangani sistem.
### Thresholds dalam k6
Anda juga dapat menetapkan **thresholds** untuk menentukan batas maksimal dari metrik seperti waktu respon atau error rate. Misalnya:
```javascript
export let options = {
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% permintaan harus memiliki durasi kurang dari 500ms
    http_req_failed: ['rate<0.01'],   // Kurang dari 1% permintaan harus gagal
  },
};
```