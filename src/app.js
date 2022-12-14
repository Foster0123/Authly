// src/app.js
// Common Core Modules
const path = require('path')

// External Modules/Dependencies
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const { v5: uuidv5 } = require("uuid")
const pgStore = require('connect-pg-simple')(session)
const { client } = require('./app/utils/db');

// Utilities
const server = require('./app/utils/server')
const { sessionOptions } = require('./app/utils/session');
const { routes } = require('./app/utils/route');

// Module Implementation
const app = express()
const router = express.Router()

// Global Config
app.use(session(sessionOptions))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, process.env.VIEWS_DIR))
app.use(express.static(path.join(__dirname, process.env.PUBLIC_DIR)))
app.use(express.static(path.join(__dirname, process.env.STATIC_DIR)))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use((req, res, next) => {
    console.log(`Method:${req.method} | Url:${req.url}`)
    next()
})

router.use('/', routes.homeRoute)
router.use('/signin', routes.signinRoute)
router.use('/signup', routes.signupRoute)
router.get("/signout", (req, res) => {
    req.session.auth = false;
    req.session.destroy();
    res.redirect("/");
    res.end()
})
router.use('/account', routes.accountRoute)
let auth = true;
app.use("/384534983hg89h34g349", (req, res) => {
    res.render('templates/base.pug', { auth: auth })
})

app.use(router)
app.use("*", (_, res) => {
    res.render('pages/notfound.pug')
})
app.listen(process.env.APP_PORT, server);