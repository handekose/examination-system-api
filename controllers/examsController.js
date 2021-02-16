var express = require('express')
var router = express.Router()
var examService = require("../services/examService");
const jwtService = require('../services/jwtService');

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

// get all exams
router.get('/', async function (req, res) {
    let exams = [];
    exams = await examService.getAll();
    res.send(exams);
})

// get exam by id
router.get('/:id', async function (req, res) {
    let exam = await examService.getById(req.params.id);
    res.send(exam);
})

// get exams by teacher id
router.get('/getByTeacherId/:teacherId', async function (req, res) {
    let exams = await examService.getByTeacherId(req.params.teacherId);
    res.send(exams);
})

// get exams by course id
router.get('/getByCourseId/:courseId', async function (req, res) {
    let exams = await examService.getByCourseId(req.params.courseId);
    res.send(exams);
})

router.get('/getByUserId/:userId', async function (req, res) {
    let exams=[];
    exams = await examService.getByUserId(req.params.userId);
    res.send(exams);
})

// delete exam by exam id
router.delete('/:id', async function (req, res) {
    var response = await examService.deleteById(req.params.id);
    res.send(response);
})

// add exam
router.post('/', async function (req, res) {
    var response = await examService.add(req.body);
    res.send(response);
})

// update exam
router.put('/', async function (req, res) {
    var response = await examService.update(req.body);
    res.send(response);
});

module.exports = router