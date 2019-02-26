var http = require("http");
var url = require("url");
var fs = require('fs')
var mysql = require('mysql');
var querystring = require('querystring');
//var sleep = require('sleep');



var connection = mysql.createConnection({
	host	: 'localhost',
	user     : 'root',
	password : 'root',
	database : 'project'
});
connection.connect();

function handle_incoming_request(req, res){
	//console.log("处理");

	req.parsed_url = url.parse(req.url,true);
	//console.log(req.parsed_url);
	
	var core_url =req.parsed_url.pathname;
	//console.log(core_url);
	//console.log(typeof core_url);
	var post = '';
	if(core_url=='/index.html'){
		show_index(req,res);
	}
	else if(core_url == '/page.json'){
		handle_list_page(req,res);
	}else if(core_url == '/addtolist')
	{
		var post = '';
		console.log("post");
		req.on('data',function(chunk){
			//console.log('ondata');
				//console.log(chunk);
				post += chunk;
		});
		req.on('end',function(){
			post = decodeURI(post);
			//console.log(post);
			post=JSON.parse(post);
			//console.log(post);
			//console.log(post["src"]);
			//console.log(post["src"]["src"]);
			var src=post["src"]["src"];
			var name=post["src"]["name"];
			//console.log(src);
			//console.log(typeof src);
			connection.query("INSERT INTO list0(src,name) VALUES('"+src+"','"+name+"')");
           // post = querystring.parse(post);
           // console.log(post);
            //console.log('收到参数:'+post['email']+'\n');
            //console.log('收到参数:'+post['name']+'\n');
			// res.writeHead(200, {
			// 'Access-Control-Allow-Origin':'*',
			// 'Access-Control-Allow-Headers':'*',
			// 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				// });
			// res.end();
        })
	}
	else if(core_url == '/deletFromList'){
		var post ='';
		//console.log("post");
		req.on('data',function(chunk){
				post += chunk;
		});
		req.on('end',function(){
			post = decodeURI(post);
			post=JSON.parse(post);
			var src=post["src"]["src"];
			var name=post["src"]["name"];
			//console.log(src);
			//console.log(typeof src);
			connection.query("DELETE FROM list0 where src='"+src+"'");
/* 			res.writeHead(200, {
			'Access-Control-Allow-Origin':'*',
			'Access-Control-Allow-Headers':'*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				});
			res.end(); */
        })
	}
	else if(core_url.indexOf('.js')>=0){
		handle_script(req,res,core_url);
	}
	else if(core_url.indexOf('img')>=0){
		handle_img(req,res,core_url);
	}
	else if(core_url.indexOf('music')>=0){
		handle_music(req,res,core_url);
	}
	else{
		send_failure(res, 404, invalid_resource());
	}
}

function handle_script(req,res,core_url){
	console.log(core_url);
	res.writeHead(200,{'Content-Type':'text/javascript'})
	fs.readFile(core_url.slice(1),'utf-8',function(err,data){
		if(err){
			throw err ;
		}
		res.end(data);
	});
}

function handle_img(req,res,core_url){
	res.writeHead(200,{'Content-Type':'image/png'})
	fs.readFile(core_url.slice(1),function(err,data){
		if(err){
			throw err ;
		}
		res.end(data);
	});
}

function readRangeHeader(range, totalLength) {  
        /*  
         * Example of the method &apos;split&apos; with regular expression.  
         *   
         * Input: bytes=100-200  
         * Output: [null, 100, 200, null]  
         *   
         * Input: bytes=-200  
         * Output: [null, null, 200, null]  
         */ 
   
    if (range == null || range.length == 0)  
        return null;  
   
    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);  
    var start = parseInt(array[1]);  
    var end = parseInt(array[2]);  
    var result = {  
        Start: isNaN(start) ? 0 : start,  
        End: isNaN(end) ? (totalLength - 1) : end  
    };  
       
    if (!isNaN(start) && isNaN(end)) {  
        result.Start = start;  
        result.End = totalLength - 1;  
    }  
   
    if (isNaN(start) && !isNaN(end)) {  
        result.Start = totalLength - end;  
        result.End = totalLength - 1;  
    }  
   
    return result;  
} 

function handle_music(req,res,core_url){
	var filename=core_url.slice(1);
	var stat = fs.statSync(filename);  
	var rangeRequest = readRangeHeader(req.headers['range'], stat.size)
	console.log('handlemusic');
	if (rangeRequest == null) {  
		res.writeHead(200,{'Content-Type':'audio/mpeg',
							'Content-Length': stat.size,
							'Accept-Ranges': 'bytes'
							})
		fs.readFile(filename,function(err,data){
			if(err){
				throw err ;
			}
			res.end(data);
		});
	}
	var start = rangeRequest.Start;  
    var end = rangeRequest.End;
	var responseHeaders = {}; 
	responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;  
    responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);  
    responseHeaders['Content-Type'] = 'audio/mpeg';  
    responseHeaders['Accept-Ranges'] = 'bytes';  
    responseHeaders['Cache-Control'] = 'no-cache';  
   
    // Return the 206 'Partial Content'.  
    sendResponse(res, 206, responseHeaders, fs.createReadStream(filename, { start: start, end: end }));  	
	console.log('handlemusicend');
}

function sendResponse(response, responseStatus, responseHeaders, readable) {  
    response.writeHead(responseStatus, responseHeaders);  
   
    if (readable == null)  
        response.end();  
    else 
        readable.on("open", function () {  
            readable.pipe(response);  
        });  
   
    return null;  
}  

function show_index(req,res){
	//console.log("index");
	res.writeHead(200,{'Content-Type':'text/html'})
	fs.readFile('player.html','utf-8',function(err,data){
		if(err){
			throw err ;
		}
		res.end(data);
	});

}

function handle_list_page(req,res){
	var query=req.parsed_url.query;
	var listID = parseInt(query["listID"]);

	
	console.log('分割线------------------------------------');
	var sql="SELECT src,`name` FROM `list"+listID+"` ORDER BY `order` DESC"
	connection.query(sql,function(err, rows, fields){
		if(err)
			throw err;
		var string=JSON.stringify(rows); 
		res.writeHead(200, {
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Headers':'*',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			});
		res.write(string);
		res.end();
	})
}

function invalid_resource(){
	return make_error("the requested resource does not exist");
}

function make_error(msg){
	var e=new Error(msg);
	return e;
}

function send_failure(res,code,err){
	res.writeHead(code,
	{
		"Content-Type":"applicaation/json",
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Allow-Headers':'*'
	});
	res.end(JSON.stringify({error:code,message:err.message})+"\n");
}
	// fs.readFile('json/musicList.json',function(err,data){
		// if (err){
			// console.log("错误");
			// return console.error(err);
		// }else{	

			// res.writeHead(200, {
			// 'Access-Control-Allow-Origin':'*',
			// 'Access-Control-Allow-Headers':'*',
			// 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		
				// });
			// string = data.toString();
			// res.write(string);
			// res.end();
		// }
	// });


var s=http.createServer(handle_incoming_request);
s.listen(8080);


// fs.readFile('json/musicList.json',function(err,data){
  // if (err){
    // return console.error(err);
  // }else{
    //console.log("异步读取: " + typeof(data));
	// var string = data.toString();
	// json = JSON.parse(string);
	// var container = new Array();
	// container.push(json[0]);
	// container.push(json[1]);
	// console.log(string);
	// console.log(container);
	// console.log(JSON.stringify(container));
	//console.log(typeof(JSON.stringify(json[1])));
  // }
// })
