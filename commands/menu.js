module.exports = {
    name: "menu",

    run: async (sock, m) => {

        let menu = `
╭━━━〔 🤖 DELUXE-BOT V4 〕━━━╮

👋 Hola @${m.sender.split("@")[0]}

╭━━〔 GENERAL 〕━━╮
┃ /menu
┃ /ping
┃ /owner
┃ /info
╰━━━━━━━━━━━━━━╯

╭━━〔 GRUPOS 〕━━╮
┃ /welcome on
┃ /welcome off
┃ /bye on
┃ /bye off
┃ /tagall
╰━━━━━━━━━━━━━━╯

╭━━〔 DIVERSIÓN 〕━━╮
┃ /ship
┃ /dado
┃ /pareja
╰━━━━━━━━━━━━━━╯

╭━━〔 UTILIDAD 〕━━╮
┃ /sticker
┃ /tts
╰━━━━━━━━━━━━━━╯

⚡ DELUXE-BOT V4
`;

        await sock.sendMessage(m.chat,{
            text: menu,
            mentions:[m.sender]
        });

    }
}
