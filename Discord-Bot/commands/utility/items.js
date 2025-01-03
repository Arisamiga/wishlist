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
            const embeds = [];
            items.forEach((item) => {
                const name = item.querySelector('.item-name').text;
                const description = item.querySelector('.item-description').text;
                const image = item.querySelector('.item-img > img').getAttribute('src');
                const price = item.querySelector('.item-price').text;

                const embed = {
                    title: name,
                    description: `${description}\nPrice: ${price}`,
                    image: {
                        url: image
                    }
                };

                embeds.push(embed);
            });

            interaction.reply({ embeds: embeds });
        });
    },
};