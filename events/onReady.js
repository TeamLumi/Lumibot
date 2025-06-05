module.exports = {
	name: "ready",
	once: true,

	/**
	 * @description Executes when client is ready (bot initialization).
	 * @param {import('../typings').Client} client Main Application Client.
	 */
	execute(client) {
		scheduleDailyMessage(client);
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

function scheduleDailyMessage(client) {
    const CHANNEL_ID = '1374820792168087743';
    const MESSAGE = `we're still working on it`;
  
    const now = new Date();
    const targetHour = 9;
    const targetMinute = 0;
    const targetSecond = 0;
  
    const nextTarget = new Date();
    nextTarget.setHours(targetHour, targetMinute, targetSecond, 0);
  
    if (now > nextTarget) {
      nextTarget.setDate(nextTarget.getDate() + 1);
    }
  
    const delay = nextTarget - now;
  
    setTimeout(() => {
      sendDailyMessage(client, CHANNEL_ID, MESSAGE);
  
      // Repeat every 24 hours
      setInterval(() => {
        sendDailyMessage(client, CHANNEL_ID, MESSAGE);
      }, 24 * 60 * 60 * 1000);
  
    }, delay);
}
  
  function sendDailyMessage(client, channelId, message) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.error(`Channel with ID ${channelId} not found.`);
      return;
    }
  
    channel.send(message).catch(console.error);
}
