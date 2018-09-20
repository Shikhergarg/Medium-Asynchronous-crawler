const request = require('request'),
async = require('async'),
fs = require('fs'),
cheerio = require('cheerio'),
csvWriter = require('csv-write-stream');

const writer = csvWriter({
    headers: ['link','count']
});
writer.pipe(fs.createWriteStream('URLS.csv'), {
    flags: 'a'
});
const MAX_WORKERS = 5;
let URLmap = {};
let linkqueue=[];
let running = 0;

linkqueue.push('https://medium.com/');

function crawl() {
    const url = linkqueue.shift();
    running++;
    request(url, (error, response, html) => {
        if (!error) {
            const $ = cheerio.load(html);
            let arr = [];
            $('a').filter(function(output) {
                let data = $(this);
                arr.push(data.attr().href);
            });

            
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] in URLmap === false && isURL(arr[i])) {
                    linkqueue.push(arr[i]);
                    writer.write([arr[i],0]);
                }
            }
            while (linkqueue.length && running < MAX_WORKERS) {
                crawl();
            }
            running--;
			console.log(`Proccessed URL ${url}`);
        }else{
        	console.error(error);
        }
    });
}

crawl();

function isURL(url){
    if(url!=undefined&&url.substring(0,5) === 'https'){
        return true;
    }else{
        return false;
    }
}