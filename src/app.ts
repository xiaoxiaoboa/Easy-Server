import app from "./app/index.js"
import { port } from "./config/env.js"

app.listen(port, "192.168.1.104", () => console.log(`192.168.1.101:${port}`))
