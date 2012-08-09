var restify = require('restify'),
	cradle  = require('cradle');

var db = new(cradle.Connection)().database('branches');

//configure server

var server = restify.createServer({
  name: 'pulls',
});

server.use(restify.bodyParser());

//helpers
function exit_on_error(err, res){ if(err) console.log(err); process.exit(1); }


//gets
function branch(req, res, next){
	var	user = req.params.user,
		repo = req.params.repo,
		name = req.params.branch;

	var id = user+':'+repo+':'+name;

	db.get(id, function(err, branch){
		res.send(200, branch);
		next();
	}); 
}

server.get('/:user/:repo/:branch/', branch);


//github hooks
function pullrequest(req, res, next){
	//receive hook for github
	console.log("received a pullrequest update");
	var pr = JSON.parse(req.body);


	var	user = pr.pull_request.head.repo.owner.login,
		repo = pr.pull_request.head.repo.name,
		name = pr.pull_request.head.ref;

	var id = user+':'+repo+':'+name; 
	
	db.get(id, function (err, branch) {
	  if(err){
	  	branch = {};
	  }

	  branch.status = pr.action;
	  branch.commit = pr.pull_request.head.commit;
	  branch.pullrequest = pr.pull_request;

	  db.save(id, branch, exit_on_error);
  	});


	console.log(id);
	res.send(200, id);
	
	return next();
}

function comment(req, res, next){
	//receive hook for gihub
}

server.post('/github/pullrequest/', pullrequest);
server.post('/github/comment/', comment);


//start server
server.listen(8080);