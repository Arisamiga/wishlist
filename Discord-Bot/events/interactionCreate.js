require('dotenv').config()
const { Events, MessageFlags } = require('discord.js');
const HTMLParser = require('node-html-parser');
const fs = require('fs');
const simpleGit = require('simple-git');
const git = simpleGit();
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.guild) return;
        if (interaction.user.id !== process.env.OWNER_ID) {
            interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
            return;
        }

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
                    const image = interaction.fields.getTextInputValue('newItemImage');
                    const price = interaction.fields.getTextInputValue('newItemPrice');

                    // Check if the image is a valid URL
                    if (!image.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/)) {
                        await interaction.reply({ content: `Invalid Image URL. Make sure to use either (.jpeg, .jpg, .gif, .png, or .webp)`, ephemeral: true });
                        return;
                    }

                    // Check if name already exists
                    const items = root.querySelectorAll('.wishlist-item');
                    const itemExists = items.find(item => item.querySelector('.item-name').text === name);
                    if (itemExists) {
                        await interaction.reply({ content: `Item: ${name} Already Exists!`, ephemeral: true });
                        return;
                    }

                    const wishlist = root.querySelector('.wishlist-item').clone();
                    wishlist.querySelector('.item-img > img').setAttribute('src', image);
                    const item = wishlist.querySelector('.item-details')
                    item.querySelector('.item-name').set_content(name);

                    // Check if the description has a link then add the link
                    if (description.includes('http')) {
                        description = description.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
                        item.querySelector('.item-description').set_content(description);
                    } else {
                        item.querySelector('.item-description').set_content(description);
                    }
                    item.querySelector('.item-price').set_content("€" + price);
                    root.querySelector('.wishlist').appendChild(wishlist);

                    async function uploadChanges(itemRemoved) {
                        try {
                            // Check if there are any updates to the repo then pull
                            await git.pull('origin', process.env.GIT_BRANCH);

                            await git.add('../');
                            await git.commit(`Added ${itemRemoved} to the wishlist`);
                            await git.push('origin', process.env.GIT_BRANCH);
                            return true;
                        } catch (err) {
                            console.error(err);
                            return false;
                        }
                    }

                    fs.writeFile('../Website/index.html', root.toString(), (err) => {
                        if (err) {
                            console.error(err);

                            interaction.reply({ content: `Failed to Update and Upload Item: ${name}`, ephemeral: true });
                            return;
                        }
                        else {
                            const enableGitUpdates = process.env.ENABLE_GIT_UPDATES && process.env.ENABLE_GIT_UPDATES.toLowerCase() !== 'false';
                            if (!enableGitUpdates) {
                                interaction.reply({ content: `Item: ${name} Added!`, ephemeral: false });
                                return;
                            }

                            if(uploadChanges(name))
                                interaction.reply({ content: `Item: ${name} Added and Uploaded!`, ephemeral: false });
                            else
                                interaction.reply({ content: `Failed to Update and Upload Item: ${name}`, ephemeral: true });
                        }
                    });
                });
            }
        }
    },
};