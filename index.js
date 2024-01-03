const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = express()
const cors = require("cors")
const FoodshopRouter = require('./routes/ShopsRouter')

dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log('DB Connected')).catch((err) => console.log(err))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors());

app.use(FoodshopRouter);

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))