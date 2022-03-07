const controller = require('./controller.js')
const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())


app.use(express.static(path.join(__dirname, '/../client')))

app.get('/', (req, res) => res.redirect('/home'))
app.get('/home', controller.serveHome)
app.get('/planner', controller.servePlanner)
app.get('/document', controller.serveDocument)

app.post('/past-trips', controller.createNewTrip)
app.get('/past-trips', controller.getPastTrips)
app.delete('/past-trips', controller.deleteTrip)

app.post('/future-trips', controller.createNewPlan)
app.get('/future-trips', controller.getFutureTrips)
app.delete('/future-trips', controller.deleteFutureTrip)
app.put('/future-trips', controller.crossOffTrip)

const port = process.env.PORT || 4005



app.listen(port, () => console.log(`Listening on port ${port}`))

//set up app.post and app.get endpoints