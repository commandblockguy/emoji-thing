const config = require('./config.json');

const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();

database = JSON.parse(fs.readFileSync('database.json'));

const invite = "https://discordapp.com/oauth2/authorize?client_id=697222942962090036&scope=bot&permissions=1141238864"

client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
	if(message.author.bot) return;
	if(!database.channels[message.channel.id]) {
		database.channels[message.channel.id] = {emoji: true, nonEmoji: true};
		update_database();
	}
	if(handle_command(message)) return;
	const emoji_regex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]|<:.*:\d+>)/g;
	const non_non_emoji_regex = / |\n|\t|\r/g;
	has_emoji = emoji_regex.test(message.content);
	emoji_removed = message.content.replace(emoji_regex, "");
	has_non_emoji = message.content.replace(emoji_regex, "").replace(non_non_emoji_regex, "") != "";
	if(has_emoji && !database.channels[message.channel.id].emoji) {
		//console.log("Contains emoji: " + message.content);
		message.author.createDM().then(dm => {dm.send("Emoji are not allowed in this channel");});
		message.delete();
	}
	if(has_non_emoji && !database.channels[message.channel.id].nonEmoji) {
		//console.log("Contains non-emoji: " + message.content);
		message.author.createDM().then(dm => {dm.send("Non-emoji are not allowed in this channel");});
		message.delete();
	}
});

function update_database() {
	fs.writeFileSync('database.json', JSON.stringify(database))
}

function require_perm(message) {
	if(message.member.permissionsIn(message.channel).has(['MANAGE_CHANNELS'])) {
		return true;
	} else {
		message.member.createDM().then(dm => {dm.send("You aren't allowed to use that here!")});
		return false;
	}
}

function handle_command(message) {
	if(!message.member) return;
	switch(message.content.toLowerCase()) {
		default: return false;
		case "emoji on":
			if(!require_perm(message)) break;
			database.channels[message.channel.id].emoji = true;
			update_database();
			message.channel.send("emoji now enabled in this channel");
			break;
		case "emoji off":
			if(!require_perm(message)) break;
                        database.channels[message.channel.id].emoji = false;
                        update_database();
			message.channel.send("emoji now disabled in this channel");
                        break;
                case "nonemoji on":
			if(!require_perm(message)) break;
                        database.channels[message.channel.id].nonEmoji = true;
                        update_database();
			message.channel.send("non-emoji now enabled in this channel");
                        break;
                case "nonemoji off":
			if(!require_perm(message)) break;
                        database.channels[message.channel.id].nonEmoji = false;
                        update_database();
			message.channel.send("non-emoji now disabled in this channel");
                        break;
		case "~help":
			message.channel.send("Use !help for help");
			break;
		case "!help":
			message.channel.send("Use ?help for help");
			break;
		case "?help":
			message.channel.send("Use /help for help");
			break;
		case "/help":
			message.channel.send("Use 'help' for help");
			break;
		case "help":
			message.channel.send("Commands: `/^([!/?~]?help|invite|privacy|(((non)?emoji) o(n|ff)))$/ig`");
			break;
		case "privacy":
			message.channel.send("All your data are belong to me.");
			break;
		case "invite":
			message.channel.send(invite);
			break;
	}
	return true;
}

client.login(config.token);
