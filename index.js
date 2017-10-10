var express = require("express");
var app = express();
var http = require("http").Server(app);
var multer = require("multer");
var storage = multer({dest:__dirname+"/"+"folder"});
var exec  = require("child_process").exec;
var fs = require("fs");
app.get("/upload", (req,res)=>{
	res.write("<form method='post' enctype='multipart/form-data' action='/upload'>");
	res.write("<input type='file' name='file'>");
	res.write("<input type='submit' value='submit'>");
	res.write("</form>");
	res.end();
});

app.post("/upload", storage.single("file"), (req,res)=>{

	var file = req.file;
	exec("/home/zonas/hadoop-2.8.1/bin/hdfs dfs -put "+file.path+" /uploaded/"+file.originalname, (err, stdout, stderr)=>{
		if(err||stderr){
			console.log(err +"\n"+stderr);
		}else{
			res.redirect("http://10.1.55.200:50070/explorer.html#/uploaded");
		}
		fs.unlinkSync(file.path);
	});
});
http.listen(10000);
