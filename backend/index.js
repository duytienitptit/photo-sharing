const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const dbConnect = require('./db/dbConnect')
const UserRouter = require('./routes/UserRouter')
const PhotoRouter = require('./routes/PhotoRouter')
const CommentRouter = require('./routes/CommentRouter')

dbConnect()

app.use(cors())
app.use(express.json())

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, '../frontend/public')))

app.use('/api/users', UserRouter)
app.use('/api/photos', PhotoRouter)
app.use('/api/comments', CommentRouter)

app.get('/', (request, response) => {
  response.send({ message: 'Hello from photo-sharing app API!' })
})

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`)
})
