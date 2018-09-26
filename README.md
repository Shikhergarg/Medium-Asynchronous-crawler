#Medium-Asynchronous-crawler

## Getting Started

My task was to build NodeJS based Asynchronouscrawler to crawl medium.com

### Prerequisites

What things you need to install the software and how to install them

```
Node 8
Docker
MongoDB
```

### Running Locally

Make sure you have Node.js and docker installed
Running using docker
```
docker build -t shikhergarg/crawler .
docker images
docker run -p 3000:3000 -d shikhergarg/crawler
docker ps (To check process)

```
Running without docker
```
npm install
npm start
```
To access database from Mongo shell use this url "mongo ds115353.mlab.com:15353/rentomojo -u Shikher -p 123456s"



