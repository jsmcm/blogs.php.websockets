const express = require("express");
const app = express();

const http = require("http");
const socketIo = require("socket.io");

const redis = require("redis");

const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",
	}
});

server.listen(5000);

io.on("connection", socket => {
	const subscriber = getRedisClient();

 	(async () => {
		await subscriber.connect();
	})();



	///////////////////////////////////////////////////////////////////
	//
	// TEMPERATURE EVENT - PAGE SPECIFIC
	//
	// A front end nuxt client has connected and
	// we're subscribe them to the channelName
	//
	////////////////////////////////////////////////////////////////////
	socket.on("subscribe-from-temperature-page-in-nuxt", (clientChannel) => {
		console.log("subscribe-from-temperature-page-in-nuxt: " + clientChannel);
 		subscriber.subscribe(clientChannel, (message, channel) => {
			console.log(`Received ${message} from ${channel}`);
			socket.emit(clientChannel, message);
		});

		console.log("let nuxt know that its subscribed to subscribed to " + clientChannel);
		socket.emit(clientChannel, "subscribed to " + clientChannel);
	});



	///////////////////////////////////////////////////////////////////
	//
	// GENERAL EVENT
	//
	// A front end nuxt client has connected and
	// we're subscribe them to the channelName
	//
	////////////////////////////////////////////////////////////////////
	socket.on("subscribe-from-general-page-in-nuxt", (clientChannel) => {
		console.log("subscribe-from-general-page-in-nuxt on channel: " + clientChannel);
 		subscriber.subscribe(clientChannel, (message, channel) => {
			console.log(`Received ${message} from ${channel}`);
			socket.emit(clientChannel, message);
		});

		console.log("let nuxt know that its subscribed to subscribed to " + clientChannel);
		socket.emit(clientChannel, "subscribed to " + clientChannel);
	});



	socket.on("disconnect", () => {
		console.log("disconnected");
		subscriber.quit();
	});

	socket.emit("connected");
 });


const getRedisClient = () => {
	const redisClient = redis.createClient({
		socket: {
			host: "localhost",
			port: 6379,
		},
	});

	redisClient.on("error", function(err) {
		console.error("redis error: ", err);
	});

	redisClient.on("ready", () => {
		console.log("connected to redis");
	});

	return redisClient;
}

