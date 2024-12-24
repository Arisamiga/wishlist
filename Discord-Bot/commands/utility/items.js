const { SlashCommandBuilder } = require('@discordjs/builders');
const HTMLParser = require('node-html-parser');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('items')
        .setDescription('Get Current Wishlist Items'),
    async execute(interaction) {
        fs.readFile('../Website/index.html', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const root = HTMLParser.parse(data);
            const items = root.querySelectorAll('.wishlist-item');
            const embed = {
                title: 'Current Wishlist Items',
                fields: [],
            };
            items.forEach((item) => {
                const name = item.querySelector('.item-name').text;
                const description = item.querySelector('.item-description').text;
                const price = item.querySelector('.item-price').text;
                embed.fields.push({
                    name: name,
                    value: `${description}\nPrice: ${price}`,
                });
            });
            interaction.reply({ embeds: [embed] });
        });
    },
};