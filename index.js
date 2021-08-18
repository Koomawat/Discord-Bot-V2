// Command handling setup from:
// https://discordjs.guide/command-handling/#individual-command-files

// Node's native file system module
const fs = require('fs');

// Collections being used as they extend JS's native Map class, i.e. more extensive and useful
const { Client, Collection, Intents } = require('discord.js');

// Getting the bot token from config.json
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

// Reading in the command files (filtered using .js extension)
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Creating the command collection where the key is the name and the value is exported module
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Ready check 
client.once('ready', () => {
	console.log('Ready!');
});

// Using our client.commands collection to dynamically retrieve and execute commands
client.on('interactionCreate', async interaction => {
	console.log(interaction.commandName)

	// Checking if command exists
	if (!interaction.isCommand()) return;

	// Checking if there is an interaction
	if (!client.commands.has(interaction.commandName)) return;

	// Command exists so we try execute the interaction
	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);

		// If an error occurs the user of the command will be notified, ephemeral so only the sender can see the message
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Logging in with the provided bot token
client.login(token);