var express = require('express')
var router = express.Router()
var enrollmentService = require("../services/enrollmentService");
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

// get all enrollments 
router.get('/', async function (req, res) {
    let enrollments = [];
    enrollments = await enrollmentService.getAll();
    console.log(enrollments);
    res.send(enrollments);
})

// get enrollments by id
router.get('/:id', async function (req, res) {
    enrollment = await enrollmentService.getById(req.params.id);
    res.send(enrollment);
})

// get enrollments by user id
router.get('/getbyuserId/:userId', async function (req, res) {
    let enrollments = await enrollmentService.getAllByUserId(req.params.userId);
    res.send(enrollments);
})

// get enrollments by course id
router.get('/getbycourseId/:courseId', async function (req, res) {
    let enrollments = await enrollmentService.getAllByCourseId(req.params.courseId);
    res.send(enrollments);
})

// get all users on enrollments by course id
router.get('/getAllUsersOnEnrollmentsByCourseId/:courseId', async function (req, res) {
    let users = await enrollmentService.getAllUsersOnEnrollmentsByCourseId(req.params.courseId);
    res.send(users);
})

router.get('/getAllCoursesOnEnrollmentsByUserId/:userId', async function (req, res) {
    let courses = await enrollmentService.getAllCoursesOnEnrollmentsByUserId(req.params.userId);
    res.send(courses);
})

router.get('/studentAnswers/:studentId/exam/:examId',async function (req, res) {
    let answers = await enrollmentService.getStudentAnswers(req.params.studentId,req.params.examId);
    res.send(answers);
})

router.get('/studentGrade/:studentId/exam/:examId',async function (req, res) {
    let grade = await enrollmentService.getStudentGrade(req.params.studentId,req.params.examId);
    res.send(String(grade));
})

// delete enrollment by enrollment id
router.delete('/:id', async function (req, res) {
    let response = await enrollmentService.deleteById(req.params.id);
    res.send(response);
})

// add enrollment
router.post('/', async function (req, res) {
    let response = await enrollmentService.add(req.body);
    res.send(response);

})

// update enrollment
router.put('/', async function (req, res) {
    var response = await enrollmentService.update(req.body);
    res.send(response);
});

// update enrollment inside exam
router.put('/uploadExam', async function (req, res) {
    // postModel : studentId, examId, answers
    // find exam
    // get enrollment (studentId & courseId)
    // if all states are true
    // check enrollment has exams if not create exams, otherwise do nothing
    // check exam result and answers
    // set exam grade
    // push enrollment.exams
    // save enrollmentReference
    // return questions, answers, studentAnswers for showing result

    var response = await enrollmentService.uploadExam(req.body);
    res.send(response);
});

module.exports = router