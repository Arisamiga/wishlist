const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('online')
        .setDescription('Check if the website is reachable'),
    async execute(interaction) {
        fetch('https://wishlist.arisamiga.rocks')
            .then(() => {
                const embed = {
                    title: 'The website is online!',
                    color: 0x00ff00,
                };
                interaction.reply({ embeds: [embed] });
            })
            .catch((error) => {
                const embed = {
                    title: 'The website is offline!',
                    color: 0xff0000,
                };
                interaction.reply({ embeds: [embed] });
            });
    },
};