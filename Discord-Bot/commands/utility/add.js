const { ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuOptionBuilder, SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a wishlist item'),
    async execute(interaction) {
        const modal = new ModalBuilder()
        .setCustomId('newItemModal')
        .setTitle('New Wishlist Item');

        const itemName = new TextInputBuilder()
            .setCustomId('newItemName')
            .setLabel("What is the Item's Name?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const itemDescription = new TextInputBuilder()
            .setCustomId('newItemDescription')
            .setLabel("What is the Item's Description?")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const itemPrice = new TextInputBuilder()
            .setCustomId('newItemPrice')
            .setLabel("What is the Item's Price?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder()
            .addComponents(itemName);
        const secondActionRow = new ActionRowBuilder()
            .addComponents(itemDescription);
        const thirdActionRow = new ActionRowBuilder()
            .addComponents(itemPrice);
            
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};