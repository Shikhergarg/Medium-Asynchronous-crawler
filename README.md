#Medium-Asynchronous-crawler

## Getting Started

My task was to build NodeJS based Asynchronouscrawler to crawl medium.com

### Prerequisites

What things you need to install the software and how to install them

```
Node 8
Docker
SQLITE
```

### Running Locally

Make sure you have Node.js and docker installed
Running using docker
```
git clone
cd Microservices-Imagecompression-JsonPatch
cd auth_service
docker build -t shikhergarg/authservice .
docker images
docker run -p 3000:3000 -d shikhergarg/authservice
cd ..
cd image_service
docker build -t shikhergarg/imageservice .
docker images
docker run -p 8000:8000 -d shikhergarg/imageservice
cd ..
cd patch_service
docker build -t shikhergarg/patchservice .
docker images
docker run -p 8080:8080 -d shikhergarg/patchservice
```
Running without docker
```
npm install
npm start
```
Both options will generate a URLS.db.
There are two coloumns in the database.
1-URLS
2-Count



