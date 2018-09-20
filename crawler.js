const request = require('request'),
async = require('async'),
fs = require('fs'),
cheerio = require('cheerio');


const Sequelize = require('sequelize')

const db = new Sequelize('nodejs', 'shikher', 'password', {
    dialect: 'sqlite',
    host: 'localhost',
    
    storage: './URLS.db',
	logging: false
})

const URLS = db.define('URLS', {
   
    URL: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: true,
    }
	
})

const MAX_WORKERS = 5;
let URLmap = {};
let linkqueue=[];
let running = 0;


db.sync().then(()=>console.log("data created")).catch((err)=>console.log("Database error"))
let url='https://medium.com/'
linkqueue.push(url);
URLmap[url]=true;
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
					var linkwithoutparam=arr[i].split("?")
					URLmap[arr[i]]=true;
                    linkqueue.push(arr[i]);
					URLS.findOne({ where: {URL: arr[i]} }).then(obj => {
						if(obj==null)
						{
							URLS.create({
								URL:linkwithoutparam[0],
								count:1
							})
						}
						else
						{
							URLS.increment('count', { where: { URL: arr[i] }});
						}
  
					})
					URLS.create({
						URL:arr[i],
						count:1
					})
                }
				else
				{
					URLS.increment('count', { where: { URL: arr[i] }});
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