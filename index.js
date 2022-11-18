const Discord = require("discord.js"); // Ne Pas Toucher !
const gamedig = require("gamedig"); // Ne Pas Toucher !
const chalk = require('chalk'); // Ne Pas Toucher !
const client = new Discord.Client(); // Ne Pas Toucher !
const fs = require("fs");

const month = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aôut","Septembre","Octobre","Novembre","Décembre"]; // Ne Pas Toucher !

var channelId= ""; // Channel ou le message dois apparaitre

var serverIp = ""; // Ip du serveur gmod

var serverPort = "27025"; // Port du serveur gmod

var guildId = "" // Id du serveur en question 

var gm = "DarkRP - Nom du serveur"; // Nom du serveur
var messageId = "PasTouche";

var players = 0;  // Ne Pas Toucher !
var max = 0; // Ne Pas Toucher !

var boutiqueURL = "https://taboutique.fr"; // Url de ta boutique


const QueryGM = async () => {

	const channel = client.channels.cache.get(channelId);

	if (messageId == 'PasTouche') {
		client.channels.cache.get(channelId).send("ㅤ").then(sduck => {
			console.log(chalk.green("[GStatus] Status initialisé redémarrer le bot maitenant !"))
			fs.writeFileSync("messageId.txt", sduck.id);
			setTimeout(function(){ 
			    process.exit()
			}, 2000);
		})
	}else{
		const stats = await gamedig.query({
    	    type: "garrysmod",
    	    host: serverIp,
    	    port: serverPort
		}).catch(err => {
			var guildDet = client.guilds.cache.get(guildId)
			var serverIcon = guildDet.iconURL();
			var mi = new Date()
			var dateEmbed = mi.getDate() + " "+ month[mi.getMonth()] + " à " + mi.getHours() + ":" + mi.getMinutes() + "h."
			var thumb = `https://cdn.discordapp.com/icons/${guildDet.id}/${guildDet.icon}.png?size=128`

			const embedlol = new Discord.MessageEmbed()
			embedlol.setColor(5763719)
			embedlol.setTitle(gm)
			embedlol.setURL(boutiqueURL) 
			embedlol.setThumbnail(thumb)
			embedlol.addFields(
				{ name: '📡 - Status du serveur.', value: "```Serveur déconnecté 🔴 ("+ gm +").```", inline: true },
				{ name: '👥 - Joueurs en ligne(s).', value: "```?/? (?%)```", inlined: true },
			)
			embedlol.setFooter("🚀 Dernière actualisation le " + dateEmbed, serverIcon  );
			channel.messages.fetch(messageId).then(message => {
    	        message.edit(embedlol);
    	    }).catch(err => {
    	        console.error(err);
    	    });
			players = "0"
			max = "0"
			client.user.setStatus("dnd");
		});



		
    	if (stats) {
			var guildDet = client.guilds.cache.get(guildId)
			var serverIcon = guildDet.iconURL();
			var mi = new Date()
			var dateEmbed = mi.getDate() + " "+ month[mi.getMonth()] + " à " + mi.getHours() + ":" + mi.getMinutes() + "h."
			var pourcent = (100 / stats.maxplayers) * stats.raw.numplayers
			var thumb = `https://cdn.discordapp.com/icons/${guildDet.id}/${guildDet.icon}.png?size=128`

			const embedlol = new Discord.MessageEmbed()
			embedlol.setColor(5763719)
			embedlol.setTitle(gm)
			embedlol.setDescription("||**"+ stats.name + "**  (*__"+ stats.map +"__*)||")
			embedlol.setURL(boutiqueURL) 
			embedlol.setThumbnail(thumb)
			embedlol.addFields(
				{ name: '📡 - Status du serveur.', value: "```Serveur en ligne 🟢 ("+ gm + ").```", inline: true },
				{ name: '👥 - Joueurs en ligne(s).', value: "```"+stats.raw.numplayers +"/"+ stats.maxplayers + " ("+ Math.round(pourcent) +"%)```", inlined: true },
			)
			embedlol.setFooter("🚀 Dernière actualisation le " + dateEmbed, serverIcon  );
			channel.messages.fetch(messageId).then(message => {
    	        message.edit(embedlol);
    	    }).catch(err => {
    	        console.error(err);
    	    });
			players = stats.raw.numplayers
			max = stats.maxplayers
		}
	}
};

const StatusGM = async () => {
	client.user.setActivity(`👥 ${players} joueur(s) en ligne.`, { type: "WATCHING"})
}

client.on("ready", () => {
	console.log(chalk.red("["+ client.user.username +"] Connect to Query API Garry's Mod."));
	fs.readFile('messageId.txt', 'utf8', function(err, contents) {
	   // console.log(contents)
	   messageId = contents
	});
	setInterval(QueryGM, 5000);
	setInterval(StatusGM, 6000);
});

client.login("");
