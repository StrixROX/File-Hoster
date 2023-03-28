const express = require("express")
const path = require("path")
const fileupload = require("express-fileupload")
const stream = require("stream")

const app = express()
const PORT = 5031

app.use(fileupload())
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

let hostedFiles = {}

app.post("/upload", (req, res) => {
  const files = req.files["files[]"]
  console.clear()
  console.log(
    "Files received:",
    files.map((el) => el.name)
  )

  files.map((el) => {
    hostedFiles[el.name] = el
  })
})

app.get("/file/:filename", (req, res) => {
  const filename = req.params.filename

  const file = hostedFiles[filename]

  // SOURCE:
  // https://stackoverflow.com/questions/45922074/node-express-js-download-file-from-memory-filename-must-be-a-string
  const fileContent = Buffer.from(file.data, "base64")

  const readStream = new stream.PassThrough()
  readStream.end(fileContent)

  res.set("Content-disposition", "attachment; filename=" + filename)
  res.set("Content-Type", file.mimetype)

  readStream.pipe(res)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
