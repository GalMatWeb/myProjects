var http = require('http')
    , url = require('url')
    , fs = require('fs')
    , server;
var newData = "";

/*
* using only http and url to server side loading files and saveing files*/
server = http.createServer(function(req,res){

    var myPath = url.parse(req.url).pathname;

    var isJs = myPath.indexOf(".js");
    var isHtml = myPath.indexOf(".html");
    var isCss = myPath.indexOf(".css");
    var isMain = myPath == "/";
    var isImage = myPath.indexOf(".png") + myPath.indexOf(".jpg") + myPath.indexOf(".gif") ;
    var loadData = myPath.indexOf("loadData");
    var saveData = myPath.indexOf("saveData");


    if(isJs != -1) {

        fs.readFile(__dirname + myPath, function (err, data) {
            //if (err) return send404(res);
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(data, 'utf-8');
        });
    }
    else {
        if(isHtml  != -1 || isMain==true) {

            if(isMain) {
                myPath = "/index.html";
            }
            fs.readFile(__dirname + myPath, function (err, data) {
                //if (err) return send404(res);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
        }
        else {
            if(isCss  != -1) {

                fs.readFile(__dirname + myPath, function (err, data) {
                    //if (err) return send404(res);
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.end(data, 'utf-8');
                });
            }
            else {
                if(isImage > 0 ) {
                    fs.readFile(__dirname + myPath, function (err, data) {
                        //if (err) return send404(res);
                        if(myPath.indexOf("jpg")) {
                            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                        }
                        if(myPath.indexOf("png")) {
                            res.writeHead(200, { 'Content-Type': 'image/png' });
                        }
                        if(myPath.indexOf("gif")) {
                            res.writeHead(200, { 'Content-Type': 'image/gif' });
                        }

                        res.end(data, 'utf-8');
                    });
                }
                else {
                    if(loadData!=-1) {
                        fs.readFile(__dirname + "/Data/data.json", function (err, data) {
                            //if (err) return send404(res);
                            if(!err) {
                                newData = data;
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end(newData, 'utf-8');
                            }
                        });
                    }
                    else {
                        if(saveData!=-1) {
                            var body = "",fileContent="";
                            req.on('data', function(data) {
                                body += data;
                            fs.writeFile(__dirname + "/Data/data.json",
                                body, 'utf8', function(err,success){
                                    console.log("ok");
                            });

                                res.write(body);
                                res.end();

                            });
                        }
                        else {
                            console.log("404");
                            res.writeHead(404, {'Content-Type': 'text/html'});
                            res.write("404", 'utf8');
                            res.end();
                        }

                    }

                }

            }
        }
    }
});
server.listen(3000);