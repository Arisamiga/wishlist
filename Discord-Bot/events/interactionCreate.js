const { Events, MessageFlags } = require('discord.js');
const HTMLParser = require('node-html-parser');
const fs = require('fs');
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()){

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                }
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'newItemModal') {
                fs.readFile('../Website/index.html', 'utf8', async (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    const root = HTMLParser.parse(data);
                    const name = interaction.fields.getTextInputValue('newItemName');
                    let description = interaction.fields.getTextInputValue('newItemDescription');
                    const price = interaction.fields.getTextInputValue('newItemPrice');

                    // Check if name already exists
                    const items = root.querySelectorAll('.wishlist-item');
                    const itemExists = items.find(item => item.querySelector('.item-name').text === name);
                    if (itemExists) {
                        await interaction.reply({ content: `Item: ${name} Already Exists!`, ephemeral: true });
                        return;
                    }

                    const item = root.querySelector('.wishlist-item').clone();
                    item.querySelector('.item-name').set_content(name);

                    // Check if the description has a link then add the link
                    if (description.includes('http')) {
                        description = description.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
                        item.querySelector('.item-description').set_content(description);
                    } else {
                        item.querySelector('.item-description').set_content(description);
                    }
                    item.querySelector('.item-price').set_content("€" + price);
                    root.querySelector('.wishlist').appendChild(item);

                    async function uploadChanges(itemRemoved) {
                        try {
                            await git.add('../');
                            await git.commit(`Added ${itemRemoved} to the wishlist`);
                            await git.push('origin', 'main');
                            await interaction.reply({ content: `Item: ${name} Added and Uploaded!`, ephemeral: false });
                        } catch (err) {
                            await interaction.reply({ content: `Failed to Update and Upload Item: ${name}`, ephemeral: true });
                        }
                    }

                    fs.writeFile('../Website/index.html', root.toString(), (err) => {
                        if (err) {
                            console.error(err);

                            interaction.reply({ content: `Failed to Update and Upload Item: ${name}`, ephemeral: true });
                            return;
                        }
                        else{
                            uploadChanges(name);
                        }
                    });
                });
            }
        }
    },
};