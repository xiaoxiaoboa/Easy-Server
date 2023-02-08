import app from "./app/index.js"
import { port } from "./config/env.js"

app.listen(port, () => console.log(`http://localhost:${port}`))
