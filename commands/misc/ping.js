module.exports = {
	data: {
		name: "ping"
	},

	execute(message, args) {
		message.channel.send({ content: "Pong." });
	},
};
