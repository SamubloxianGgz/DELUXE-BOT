const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const config = require("./config")

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("session")

const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update)=>{
    const {connection,lastDisconnect} = update

    if(connection === "open"){
        console.log("✅ DELUXE-BOT conectado")
    }

    if(connection === "close"){
        const reason = lastDisconnect?.error?.output?.statusCode

        if(reason !== DisconnectReason.loggedOut){
            startBot()
        }
    }
})

}

startBot()
