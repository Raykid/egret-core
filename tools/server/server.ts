﻿/// <reference path="../lib/types.d.ts" />

import http = require('http');
import events = require('events');
import utils = require('../lib/utils');
import fs = require('fs');
import cp = require('child_process');
import url = require('url');
import path = require('path');


var PORT = 3000;
var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};


export function startServer(args: egret.ToolArgs, startupUrl: string) {

    let ips = getLocalIPAddress();
    var server = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        var realPath = path.join(args.projectDir, pathname);
        //console.log(realPath);
        var ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : 'unknown';
        fs.exists(realPath, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                fs.readFile(realPath, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err);
                    } else {
                        var contentType = mine[ext] || "text/plain";
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        response.write(file, "binary");
                        response.end();
                    }
                });
            }
        });
    });
    server.listen(PORT);
    console.log("Server runing at port: " + PORT + ".");
    if (!args.serverOnly) {
        utils.open(startupUrl);
    }

}


function getLocalIPAddress() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ips = ['localhost', '127.0.0.1'];
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            ips.push(iface.address);
        });
    });

    return ips;
}