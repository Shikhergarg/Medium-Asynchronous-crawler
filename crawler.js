const request = require('request'),
async = require('async'),
fs = require('fs'),
cheerio = require('cheerio');

var mongoose = require('mongoose');
mongoose.connect('mongodb://Shikher:123456s@ds151892.mlab.com:51892/socialcopsassignment');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function ()
{
	console.log("Connected correctly to server");
	//app.emit("app_started");
});

// const Sequelize = require('sequelize')

// const db = new Sequelize('nodejs', 'shikher', 'password', {
    // dialect: 'sqlite',
    // host: 'localhost',
    
    // storage: './URLS.db',
	// logging: false
// })


// const URLS = db.define('URLS', {
   
    // URL: {
        // type: Sequelize.STRING,
        // allowNull: true,
    // },
    // count: {
        // type: Sequelize.INTEGER,
        // allowNull: true,
    // }
	
// })
const URLSchema=mongoose.Schema({
	URL:{
		type:String,
		unique:true
	},
	count:{
		type:Number
	},
	param :[String]
})
const URLS=mongoose.model('URL',URLSchema);
URLS.remove({}, function(err) { 
   console.log('Previous collection removed')
   crawl();
});
const MAX_WORKERS = 5;
let URLmap = {};
let linkqueue=[];
let running = 0;


// db.sync().then(()=>console.log("data created")).catch((err)=>console.log("Database error"))
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
					
					URLS.find({URL: linkwithoutparam[0]}).then(obj => {
						
						//console.log("fasfasdf",obj);
						if(obj.length>0)
						{
							var paramlist=linkwithoutparam[1].split("&")
							for(var j=0;j<paramlist.length;j++)
							{
								var finparam=paramlist[j].split("=")
								obj[0].param.push(finparam[0]);
							}
							//obj[0].param.push()
							obj[0].count++;
							obj[0].save((err,obj)=>{
								// if(err)
									// console.log(err);
								
							});
							
							
						}
						else
						{
							URLS.create({
								URL:linkwithoutparam[0],
								count:1,
								param:[]
							}).then((obj)=>{
								var paramlist=linkwithoutparam[1].split("&")
								for(var j=0;j<paramlist.length;j++)
								{
									var finparam=paramlist[j].split("=")
									obj.param.push(finparam[0]);
								}
								obj[0].save((err,obj)=>{
								// if(err)
									// console.log(err);
								
								});
								
								
							}).catch((err)=>{
								//console.log("-----------------------",obj,err)
							})
							//URLS.update({URL: linkwithoutparam[0]},{$inc : {"count" : 1} }})
							//URLS.increment('count', { where: { URL: linkwithoutparam[0] }});
						}
  
					})
                }
				else if(isURL(arr[i]))
				{
					var linkwithoutparam=arr[i].split("?");
					URLS.update({URL: linkwithoutparam[0]},{$inc : {"count" : 1} });
					//URLS.increment('count', { where: { URL: linkwithoutparam[0] }});
				}
            }
            while (linkqueue.length && running < MAX_WORKERS) {
                crawl();
            }
            running--;
			console.log(`Proccessed URL ${url}`);
        }
		else{
        	console.error(error);
        }
    });
}



function isURL(url){
    if(url!=undefined&&url.substring(0,5) === 'https'){
        return true;
    }else{
        return false;
    }
}