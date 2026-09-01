const { REST, Routes } = require('discord.js');
const { token, 'client-id': clientId, 'guild-id': guildId} = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');

function carregarComandos(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'utility') continue;
            carregarComandos(fullPath);
            continue;
        }

        if (!entry.isFile() || !entry.name.endsWith('.js')) continue;

        const command = require(fullPath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[AVISO] O arquivo em ${fullPath} não exporta "data" e "execute".`);
        }
    }
}

carregarComandos(foldersPath);

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Iniciando a atualização de ${commands.length} comandos (/)...`);

        const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

        console.log(`Comandos (/) atualizados com sucesso!`);
    } catch (error) {
        console.error(error);
    }
})();