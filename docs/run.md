# K6
## Setup Project
create: folder
npm init
change package.json: "type": "module"

## Install K6
npm install k6
npm install --save-dev @types/k6

## Create Test
k6 new src/BebasApps/1journey.js

## Run Test
k6 run src/BebasApps/1journey.js

## Run Test with Summary
k6 run src/BebasApps/1journey.js --summary-export report/output.json

## Run Test with CSV and JSON Realtime Output Results
k6 run --out csv=realtime-output.csv src/BebasApps/1journey.js
k6 run --out json=realtime-output.json src/BebasApps/1journey.js

## Run Test and Upload to Cloud Prometheus 
K6_PROMETHEUS_RW_USERNAME=1678899 \
K6_PROMETHEUS_RW_PASSWORD=xxxx \
K6_PROMETHEUS_RW_SERVER_URL=https://prometheus-prod-37-prod-ap-southeast-1.grafana.net/api/prom/push \
k6 run -o experimental-prometheus-rw src/BebasApps/1journey.js

## Enable Dashboard in Localhost
export K6_WEB_DASHBOARD=true
k6 run --out web-dashboard src/BebasApps/1journey.js
k6 run src/BebasApps/1journey.js

k6 run src/BebasApps/1journey.js \
--out json=reportK6.json \
--out influxdb=http://localhost:3000/k6
runnig :
K6_WEB_DASHBOARD=true k6 run src/BebasApps/1journey.js

## Run Test with InfluxDB
K6_INFLUXDB_ORGANIZATION=xxxx \
K6_INFLUXDB_BUCKET=report \
K6_INFLUXDB_TOKEN=xxxx \
./k6 run -o xk6-influxdb=http://localhost:8086 src/BebasApps/1journey.js


## Run file
K6_INFLUXDB_ORGANIZATION="naufalpry" \
K6_INFLUXDB_BUCKET="reportDB" \
K6_INFLUXDB_TOKEN="xxxx" \
K6_INFLUXDB_ADDR="http://localhost:8086" \
./k6 run src/BebasApps/oneJourneyParallel.js -o xk6-influxdb



docker-compose run k6 run src/BebasApps/1journey.js
docker-compose run --rm k6

2587 >> id dashboard grafana k6 report