# Install Go
https://go.dev/doc/install
go version

# Install Docker
https://docs.docker.com/compose/install/
docker --version

# k6 Build
go install go.k6.io/xk6/cmd/xk6@latest
xk6 build --with github.com/grafana/xk6-output-influxdb
if error run: export PATH=$(go env GOPATH)/bin:$PATH

# Install docker-compose
brew install docker-compose
docker-compose --version
create docker-compose.yaml
```
version: '3'
services:
  influxdb:
    image: influxdb:latest
    container_name: influxdb
    ports:
      - 8086:8086
    volumes:
      - influxdb:/var/lib/influxdb
  grafana:
    container_name: grafana
    image: grafana/grafana:latest
    ports:
      - 3000:3000
    volumes:
      - grafana:/var/lib/grafana
volumes:
  influxdb:
  grafana:
```
run: docker-compose up -d

# Setup InfluxDB User
open: localhost:xxxx
username: xxxx
password: xxxx
database: xxxx
organization: xxxx
user id: xxxx
organization id: xxxx
API token influxdb: 
xxxx

open: localhost:8086
username: xxxx
password: xxxx
database: xxxx
organization: xxxx
user id: xxxx
organization id: xxxx
API token influxdb: 
xxxx
Token xxxx

# Add Grafana Datasource
open: localhost:3000
username: xxxx.xxxx
password: xxxx

# Install Influxdb from Homebrew
brew install influxdb
brew services start influxdb

# Install Grafana from Homebrew
brew install grafana
brew services start grafana