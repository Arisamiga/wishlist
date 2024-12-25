const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const HTMLParser = require('node-html-parser');
const fs = require('fs');
const simpleGit = require('simple-git');
const git = simpleGit();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a wishlist item'),
    async execute(interaction) {
        fs.readFile('../Website/index.html', 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const root = HTMLParser.parse(data);
            const items = root.querySelectorAll('.wishlist-item');
            const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
            .addOptions(items.map((item) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(item.querySelector('.item-name').text)
                    .setValue(item.querySelector('.item-name').text)
                    .setDescription(item.querySelector('.item-description').text)
            }));
            const row = new ActionRowBuilder()
			    .addComponents(select);

            const response = await interaction.reply({
                content: 'Select an item to remove',
                components: [row]
            });

            async function uploadChanges(itemRemoved) {
                try {
                    await git.add('../');
                    await git.commit(`Removed ${itemRemoved} from wishlist`);
                    await git.push('origin', 'main');
                    return true;
                } catch (err) {
                    return false;
                }
            }

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const choice = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                if (!choice.isStringSelectMenu()) {
                    await choice.reply({ content: 'Invalid selection, cancelling', ephemeral: true });
                    return;
                }

                const item = items.find(item => item.querySelector('.item-name').text === choice.values[0]);

                if (!item) {
                    await choice.reply({ content: 'Item not found, cancelling', ephemeral: true });
                    return;
                }

                item.remove();

                fs.writeFile('../Website/index.html', root.toString(), (err) => {
                    if (err) {
                        console.error(err);
                        choice.reply({ content: 'Failed to remove item', ephemeral: true });
                        interaction.editReply({ content: `Failed to Remove and Upload Item: ${choice.values[0]}`, components: [] });
                        return;
                    }
                    else{
                        if(uploadChanges(choice.values[0])) {
                            interaction.editReply({ content: `Removed Item and Updated: ${choice.values[0]}`, components: [] });
                            choice.reply({ content: 'Item removed', ephemeral: true });
                        }
                        else {
                            choice.reply({ content: 'Failed to remove item', ephemeral: true });
                            interaction.editReply({ content: `Failed to Remove and Upload Item: ${choice.values[0]}`, components: [] });
                        }
                    }
                });

                

                
            } catch (e) {
                await interaction.editReply({ content: 'Choice not received within 1 minute, cancelling', components: [] });
            }
        });
    },
};