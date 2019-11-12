var db = require("redis-client").createClient();
require("http").createServer(function(request, response) {
    db.incr("count",function(err, reply) {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write(reply.toString());
        response.end();
    });
}).listen(8181);