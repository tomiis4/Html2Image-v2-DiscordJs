const axios = require('axios');
const { REST  } = require('@discordjs/rest');
const  { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, Routes, ActionRowBuilder, SelectMenuBuilder, ActivityType  } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
})

const clientId = process.env.ID;
const guildId = '941415311519916033';
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const randomColor = Math.floor(Math.random()*16777215).toString(16);
const Buffer = require('buffer').Buffer;

client.on("ready", () => {
    console.log(`[DISCORD] ${client.user.username} has been online`);
})
 
const commands = [
    {
        name: 'run',
        description: 'Compile your HTML & CSS file in to the image.',
        options: [
            {
                name: "html",
                description: "Your HTML code.",
                type: 3,
                required: true
            },
            {
                name: "css",
                description: "Your HTML code.",
                type: 3,
                required: false
            }
        ]
    },
    {
        name:  'learn',
        description: 'You can learn HTML & CSS there',
        type: 1,
        options: [
            {
                name: "language",
                description: "Select language you want learn-",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "html",
                        value: "Learn HTML"
                    },
                    {
                        name: "css",
                        value: "Learn CSS"
                    }
                ]
            }
        ]
    }
];


// Spawn commands
(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
	
        console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();



// Reply on run messages
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    let htmlInteraction = interaction.options._hoistedOptions[0]
    let cssInteraction = interaction.options._hoistedOptions[1]
    if (interaction.commandName == "run") { // if command "RUN"
        // if html and css
        if (htmlInteraction != undefined && cssInteraction != undefined) { 
            const dataSend = {
                "html": htmlInteraction.value,
                "css": cssInteraction.value
            }
            axios.post('http://localhost:3000/api', dataSend) // get data from API
                .then((res) => {
                    const image64 = Buffer.from(res.data, 'base64');
                    const image64Attachment = new AttachmentBuilder(image64, { name: "CodeResult.png"});
                    
                    const codeEmbed = new EmbedBuilder() // Create embed for code result
                        .setTitle('**Here is your code!  :eyes:**')
                        .setImage('attachment://CodeResult.png')
                        .setColor(`#${randomColor}`)
                        .setTimestamp()
                    interaction.reply({ embeds: [codeEmbed], files: [image64Attachment] })
                })
        }
        // if html
        else if (htmlInteraction != undefined) {
            const dataSend = {
                "html": htmlInteraction.value
            }
            axios.post('http://localhost:3000/api', dataSend) // get data from API
                .then((res) => {
                    const image64 = Buffer.from(res.data, 'base64');
                    const image64Attachment = new AttachmentBuilder(image64, { name: "CodeResult.png"});
                    
                    const codeEmbed = new EmbedBuilder() // Create embed for code result
                        .setTitle('**Here is your code!  :eyes:**')
                        .setImage('attachment://CodeResult.png')
                        .setColor(`#${randomColor}`)
                        .setTimestamp()
                    interaction.reply({ embeds: [codeEmbed], files: [image64Attachment] })
                })
        }
        // wrong answer  (never happend)
        else { 
            interaction.reply("Wrong format.");
        }
    }
});


client.login(process.env.TOKEN);
