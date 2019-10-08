module.exports = function (server) {
    const WebSocket = require("ws");
    const config = require("../config");

    var count = 0;

    var wss = new WebSocket.Server({
        server
    });

    wss.on('connection', function (ws,req) {
        ws.on("message",function (message) {
            try {
                var event = JSON.parse(message);
                if(event.type ==="countOfUsers")
                {
                    if(req.headers.sec_websocket_protocol ==="hugerain") {
                        count++;
                    }
                    ws.send(JSON.stringify({type:"countOfUsers",count:count}).toString());
                }
            } catch (e) {
                ws.close();
            }
        });
        ws.on("close",function () {
            if(req.headers.sec_websocket_protocol) {
                count--;
            }
        })
    });
};