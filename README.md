# Wishlist

<a href="https://github.com/Arisamiga/wishlist//issues">
<img alt="Issues" src="https://img.shields.io/github/issues/Arisamiga/wishlist?color=0088ff" />
</a>
  
[![CodeFactor](https://www.codefactor.io/repository/github/arisamiga/wishlist/badge?s=735c3ecf603b84a7e693f20d4d06b5256f93bbc2)](https://www.codefactor.io/repository/github/arisamiga/wishlist)

### This project consists of a website and a Discord bot that work together to manage a wishlist.

<img src="https://i.imgur.com/P6cl2JD.png" alt="Wishlist" width="100%">

<img src="https://i.imgur.com/HowUixb.png" alt="Wishlist Dark Mode" width="100%">

## Project Structure

- **/Website/**: Contains the frontend code for displaying the wishlist.
    - `index.html`: The main HTML file for the website.
    - `style/index.css`: The CSS file for styling the website.

- **/Discord-Bot/**: Contains the backend code for the Discord bot.
    - `commands/utility`: Contains the utility commands for the bot.
        - `add.js`: Command to add a new item to the wishlist.
        - `remove.js`: Command to remove an item from the wishlist.
        - `items.js`: Command to list all items in the wishlist.
        - `online.js`: Command to check if the website is reachable.
        - `ping.js`: Common command to reply with "Pong!".
    - `events`: Contains the event handlers for the bot.
        - `interactionCreate.js`: Handles interactions with the bot.
        - `ready.js`: Handles the bot's ready event.
    - `index.js`: The main entry point for the bot.
    - `package.json`: The package file for the bot's dependencies.


## Website

The website displays the wishlist items in a way that is simple and quick. It supports dark mode and has a responsive design!

### Features

- Display wishlist items with their name, description (Able to include Links if you want to), and price.
- Toggle dark mode.
- Responsive design.

## Discord Bot

The Discord bot allows users to manage the wishlist through various commands and all updates will be uploaded to the Github repository.

### Commands

- `/add`: Add a new item to the wishlist.
- `/remove`: Remove an item from the wishlist.
- `/items`: List all items in the wishlist.
- `/online`: Check if the website is reachable.
- `/ping`: Replies with "Pong!".

### Event Handlers

- `interactionCreate.js`: Handles interactions with the bot, such as commands and modals.
- `ready.js`: Sets the bot's presence and logs when the bot is ready.

### Installation
```
You have to install NodeJS and Git.
Create a folder.
Open Command Prompt.
Type in: cd The path to your new folder. (Example: C:\Users\User\Desktop\New folder)
Press enter.
After that type in: git clone https://github.com/Arisamiga/wishlist.git
Press enter.
When you see all Github files in your folder you installed the bot files succesfully.
After that you would want to edit the config.json.
```

Navigate to the `Discord-Bot` directory and install the dependencies:

```bash
npm install
```

Create a `.env` file in the `Discord-Bot` directory with your Discord bot token, client ID, guild ID, owner ID, and website URL:

Get your discord token from https://discord.com/developers/applications

```
TOKEN=your-bot-token
CLIENT_ID=your-client-id
GUILD_ID=your-guild-id
OWNER_ID=your-owner-id
WEBSITE_URL=your-website-url
```

Use either use ```npm start``` or ```node index.js``` to start the bot in your command prompt!

Open `Website/index.html` in your browser to view the wishlist.

> Note: If you want you can host the website using Github Pages which you can enable in the repository settings.

## Contributing

Feel free to open issues or submit pull requests if you have any suggestions or improvements at https://github.com/Arisamiga/wishlist
