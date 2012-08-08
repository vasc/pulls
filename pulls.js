var restify = require('restify');

var server = restify.createServer({
  name: 'pulls',
});

/*
function send(req, res, next) {
   res.send({some: 24});
   return next();
}

server.post('/hello', function create(req, res, next) {
	res.send(201, Math.random().toString(36).substr(3, 8));
	return next();
});

server.put('/hello', send);
server.get('/hello/:name', send);
server.head('/hello/:name', send);
 
server.del('hello/:name', function rm(req, res, next) {
	res.send(204);
	return next();
});
*/


server.post('/github/pullrequest/', pullrequest);
server.post('/github/comment/', comment);

function pullrequest(req, res, next){

}





server.listen(8080);