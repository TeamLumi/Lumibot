module.exports = {
	name: "messageCreate",
  
	async execute(message) {
	  // Deconstructed client from message object.
	  const args = message.content.split(/ +/);
  
	  // Checks if the trigger author is a bot. Comment this line if you want to reply to bots as well.
	  if (message.author.bot) return;
  
	  // Checking ALL triggers using a for...of loop and breaking out if a trigger was found.
	  let triggered = false;
  
	  for (const trigger of message.client.triggers.values()) {
		if (triggered) break;
  
		for (const name of trigger.data.name) {
		  if (triggered) break;
  
		  // If validated, it will try to execute the trigger.
		  if (message.content.toLowerCase().includes(name)) {
			try {
			  await trigger.execute(message, args);
			} catch (error) {
			  // If the trigger fails, reply back!
			  console.error(error);
			  message.reply({
				content: "There was an error trying to execute that trigger!",
			  });
			}
  
			// Set the trigger to be true and break out of the loop.
			triggered = true;
			break;
		  }
		}
	  }
	},
  };
  