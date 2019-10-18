var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var topic = '';
var broadcastData = '';
var ws = new WebSocketServer({
	port: port
});
var messages = [];

console.log('websockets server started');

ws.on('connection', function (socket) {
	console.log('client connection established');

	if (topic) {
		socket.send('*** Topic is\'' + topic + '\'');
	}

	messages.forEach(function (msg) {
		socket.send(msg);
	});

	socket.on('message', function (data) {
		console.log('message received: ' + data);

		if (data.indexOf('/topic') == 0) {
			topic = data.slice(6);
			broadcastData = 'Topic has changed to\'' + topic + '\'';
		} else {
			broadcastData = data;
			messages.push(broadcastData);
		}
		ws.clients.forEach(function (clientSocket) {
			clientSocket.send(broadcastData);
		});
	});
});
