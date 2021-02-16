var express = require('express')
var router = express.Router()
var courseService = require("../services/courseService")
const jwtService = require('../services/jwtService')

// middleware that is specific to this router
router.use(async function timeLog(req, res, next) {
    if (!req.headers || !req.headers.authorization) {
        return res.sendStatus(401);//401 Not Authorized
    }

    let authInfo = req.headers.authorization.split(" ");
    console.log("authInfo", authInfo)
    //[0] => Bearer, [1] => AccessToken
    var result = jwtService.verify(authInfo[1]);
    console.log(result)
    if (!result.isSuccess) {
        return res.sendStatus(401);//401 Not Authorized
    }

    next()
})

// get all courses
router.get('/', async function (req, res) {
    let courses = [];
    courses = await courseService.getAll();
    res.send(courses);
})
// get course by id
router.get('/:id', async function (req, res) {
    let response = await courseService.getById(req.params.id);
    res.send(response);
})
// get courses by teacher id
router.get('/getbyteactherid/:teacherId', async function (req, res) {
    let courses = [];
    courses = await courseService.getByTeacherId(req.params.teacherId);
    res.send(courses);
})
// delete course by id
router.delete('/:id', async function (req, res) {
    var response = await courseService.deleteById(req.params.id);
    res.send(response);
})
// add course
router.post('/', async function (req, res) {
    var response = await courseService.add(req.body);
    res.send(response);
})
// update course
router.put('/', async function (req, res) {
    var response = await courseService.update(req.body);
    res.send(response);
});

module.exports = router