const Discord = require('discord.js')

module.exports = {
    name: 'kick',
    description: 'Kicks a mentioned user',
    type: 'Moderation',
    args: true,
    usage: '@[user] [reason]',
        
    async execute(client, msg, args) {
        const app = require('../bot.js');
        let config = app.config;
        if (msg.member.hasPermission('KICK_MEMBERS')) {

            let member = msg.mentions.members.first() || msg.guild.members.get(args[1]);

            if (!member)
                return msg.reply("Please mention a valid member of this server");

                if (!member.kickable)
                return msg.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

            let reason = args.slice(1).join(' ');
            if (!reason) reason = "No reason provided";

            await member.kick(reason)
                .catch(error => msg.reply(`Sorry ${msg.author} I couldn't kick because of : ${error}`));
            const kickMessage = {
                title: `Member kicked`,
                description: `${member.user.tag} has been kicked`,
                thumbnail: {
                    url: member.user.avatarURL(),
                },
                color: `${config.colordecimal}`,
                footer: {
                    text: `Author - ${config.creator}`,
                    icon_url: `${config.logo}`
                },
                "fields": [
                    {
                        "name": `Member`,
                        "value": `${member.user.tag}`,
                        "inline": false
                    },
                    {
                        "name": `Moderator`,
                        "value": `${msg.author.tag}`,
                        "inline": false
                    },
                    {
                        "name": `Reason`,
                        "value": `${reason}`,
                        "inline": false
                    }
                ]
            };
            msg.channel.send({ embed: kickMessage });
            if (settingsmap.get(member.guild.id).modLogEnabled == false) return
            const modLogChannelConst = member.guild.channels.cache.get(settingsmap.get(member.guild.id).modLogChannel);
            if (!modLogChannelConst) return;
            modLogChannelConst.send({ embed: kickMessage });
        } else return msg.reply("Sorry, you don't have permissions to use this!");
    }
}
