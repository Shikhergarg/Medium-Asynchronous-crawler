const request = require('request'),
fs = require('fs'),
cheerio = require('cheerio');

var mongoose = require('mongoose');
mongoose.connect('mongodb://Shikher:123456s@ds115353.mlab.com:15353/rentomojo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function ()
{
	console.log("Connected correctly to server");
	//app.emit("app_started");
});

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


let url='https://medium.com/'
linkqueue.push(url);
URLmap[url]=true;
function crawl() {
	
    const url = linkqueue.shift();
    running++;
    request(url, async (error, response, html) => {
        if (!error) {
            const $ = cheerio.load(html);
            let arr = [];
            $('a').filter(function(output) {
                let data = $(this);
                arr.push(data.attr().href);
            });

            
            for (let i = 0; i < arr.length; i++) {
				
				
                if (arr[i] in URLmap === false && isURL(arr[i])) {
					URLmap[arr[i]]=true;
					linkqueue.push(arr[i]);
					var linkwithoutparam=arr[i].split("?")
					
					await URLS.find({URL: linkwithoutparam[0]}).then(obj => {
						
						//console.log("fasfasdf",obj);
						if(obj.length>0)
						{
							if(linkwithoutparam[1]!=undefined)
							{	
								var paramlist=linkwithoutparam[1].split("&")
								for(var j=0;j<paramlist.length;j++)
								{
									var finparam=paramlist[j].split("=")
									obj[0].param.push(finparam[0]);
								}
							}//obj[0].param.push()
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
								if(linkwithoutparam[1]!=undefined)
								{
									var paramlist=linkwithoutparam[1].split("&")
									for(var j=0;j<paramlist.length;j++)
									{
										var finparam=paramlist[j].split("=")
										obj.param.push(finparam[0]);
									}
									obj.save((err,obj)=>{});
								}
								
								
							}).catch((err)=>{
							})
						}
  
					});
                }
				else if(isURL(arr[i]))
				{
					var linkwithoutparam=arr[i].split("?");
					await URLS.update({URL: linkwithoutparam[0]},{$inc : {"count" : 1} });
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