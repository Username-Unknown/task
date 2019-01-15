var http = require("http");                       // 用于web服务器
var static = require('node-static');              // 用于提供静态资源
var url = require("url");
var staticServer = new static.Server('./public'); // 将public目录作为静态资源目录
var data=["Shaunview","East Cole","Edisonshire","Everettbury","Senger - Bode","Kiribati","South Wallace","Bedfordshire"]

function handleStaticRequest(req, res) {      // 处理静态资源请求
  console.log('静态请求')                         
  req.addListener('end', function () {            // 监听HTTP请求结束事件
      staticServer.serve(req, res);               // 提供静态资源服务
  }).resume();
}
function handleAjaxRequest(req, res){
  var query=url.parse(req.url,true).query
 // console.log(typeof query.key);
 // console.log(query.key);
  var key=query.key.toUpperCase()
  //console.log('ajax请求');


  var filtered=data.filter(function(s){
      if(s.toUpperCase().indexOf(key)===0)
        return true;
      return false;
    })
  console.log(filtered)
  res.writeHead(200, {
    'Access-Control-Allow-Origin':'http://localhost:8080',
    'Content-Type': 'text/plain; charset=UTF-8',// text/plain
      });
    res.write(filtered.toString());
    res.end();
}

var resource = http.createServer(function(req, res) {  // 创建WEB服务器
  handleStaticRequest(req, res);                  // 处理静态资源请求
});
var dynamic = http.createServer(function(req, res){
  console.log(req.headers.origin);
  console.log('ajax请求');
	handleAjaxRequest(req, res); 
});
resource.listen(8080, function(){                      // 监听8080端口
	console.log("listen at port http://localhost:8080");
});
dynamic.listen(8081, function(){                      // 监听8081端口
	console.log("listen at port http://localhost:8081");
});