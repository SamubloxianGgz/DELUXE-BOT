const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const fs = require("fs")
const config = require("./config")

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState("session")

  const commands = {}

  fs.readdirSync("./commands").forEach(file => {
    let command = require("./commands/" + file)
    commands[command.name] = command
  })

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false,
    browser: ["DELUXE-BOT V4", "Chrome", "1.0.0"]
  })


  sock.ev.on("creds.update", saveCreds)


  if (!state.creds.registered) {

    setTimeout(async () => {

      let phone = "573137072076"

      let code = await sock.requestPairingCode(phone)

      console.log("🔑 CODIGO DE PAREO:", code)

    }, 3000)

  }


  sock.ev.on("connection.update", (update) => {

    const { connection, lastDisconnect } = update

    if (connection === "open") {
      console.log("✅ DELUXE-BOT V4 conectado")
    }

    if (connection === "close") {

      const reason = lastDisconnect?.error?.output?.statusCode

      if (reason !== DisconnectReason.loggedOut) {
        startBot()
      }

    }

  })


  sock.ev.on("messages.upsert", async ({ messages }) => {

    let m = messages[0]

    if (!m.message) return

    let text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      ""


    if (!text.startsWith(config.prefix)) return


    let commandName = text
      .slice(config.prefix.length)
      .trim()
      .split(" ")[0]
      .toLowerCase()


    if (commands[commandName]) {

      await commands[commandName].run(sock, {

        chat: m.key.remoteJid,

        sender: m.key.participant ||
        m.key.remoteJid

      })

    }

  })

}


startBot()
