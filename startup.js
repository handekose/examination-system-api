const express = require('express');
const seedDataService = require('./services/seedDataService');
const fs = require('fs-extra')
const appSettings = require("./configurations/appSettings")
var bodyParser = require('body-parser')
var webApi;
var cors = require('cors')

let initializeExpress = async () => {
    //Create app
    webApi = express();

    //Controllers
    const userController = require("./controllers/usersController")
    const coursesController = require("./controllers/coursesController")
    const examsController = require("./controllers/examsController")
    const enrollmentsController = require("./controllers/enrollmentsController")
    const accountController = require("./controllers/accountController")

    //Use Controllers
    webApi.use(bodyParser.urlencoded({ extended: false }))
    webApi.use(bodyParser.json())
    webApi.use(cors());
    webApi.use(express.static('public'));
    webApi.use('/users', userController)
    webApi.use('/courses', coursesController)
    webApi.use('/exams', examsController)
    webApi.use('/enrollments', enrollmentsController)
    webApi.use('/user', accountController)

    //Create web server / listener
    webApi.listen(appSettings.express.port, () => {
        console.log(`Example app listening at http://localhost:${appSettings.express.port}`)
    })
}

let initialize = async () => {
    try {
        if (appSettings.applySeedData) {
            await seedDataService.applySeedData();
        }
        await initializeExpress();
    }
    catch (e) {
        console.log(e.message)
        console.log(e.stackTrace)
    }
}

module.exports = {
    initialize
}