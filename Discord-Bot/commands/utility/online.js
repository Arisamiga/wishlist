const { SlashCommandBuilder } = require('@discordjs/builders');
require('dotenv').config()
module.exports = {
    data: new SlashCommandBuilder()
        .setName('online')
        .setDescription('Check if the website is reachable'),
    async execute(interaction) {
        fetch(process.env.WEBSITE_URL)
            .then(() => {
                const embed = {
                    title: 'The website is online!',
                    color: 0x00ff00,
                };
                interaction.reply({ embeds: [embed] });
            })
            .catch(() => {
                const embed = {
                    title: 'The website is offline!',
                    color: 0xff0000,
                };
                interaction.reply({ embeds: [embed] });
            });
    },
};