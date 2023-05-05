import app from "./app/index.js"
import { port, baseUrl } from "./config/env.js"

app.listen(port, baseUrl, () => console.log(`${baseUrl}:${port}`))
