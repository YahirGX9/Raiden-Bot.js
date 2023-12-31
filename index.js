const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();


const client = new Client( {intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers,
                                      GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]} );

module.exports = { client };


client.commands = new Collection();



const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));

function commands_loader (client, commandsPath, commandFiles) {
    for (const file of commandFiles) {

        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
    
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
    
            client.commands.set(command.data.name, command);
    
        } else {
    
            console.log(`[WARNING] The command at ${filePath} is missing a requiered "data" or "execute" property.`);
    
        }
    }

    console.log('Commands loaded succesfully ✅')
}

//Load the commands
commands_loader(client, commandsPath, commandFiles)


// This loads the events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}



// Log in to Discord with your client's token
client.login(process.env.TOKEN);