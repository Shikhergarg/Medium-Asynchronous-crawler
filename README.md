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
docker build -t shikhergarg/crawler .
docker images
docker run -p 3000:3000 -d shikhergarg/crawler
docker ps (To check process)
docker cp <Container name>:URLS.db URLS.db (To copy URLS.db file from container to Host)

```
Running without docker
```
npm install
Add your database connection string in the sixth line of the crawler.js
npm start
```
Both options will generate a URLS.db.
There are two coloumns in the database.
1-URLS
2-Count



