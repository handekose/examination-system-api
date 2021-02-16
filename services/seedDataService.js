//Import seed data
var users = require("../seed_data/users");
var courses = require("../seed_data/courses");
var exams = require("../seed_data/exams");
var enrollments = require("../seed_data/enrollments");

//Import data services
var userService = require("./userService");
var courseService = require("./courseService");
var examService = require("./examService");
var enrollmentService = require("./enrollmentService");

let applySeedData = async () => {
    //Check and apply user seed data
    var isExistsUser = await userService.checkDataExists();
    if (!isExistsUser) {
        users.forEach(element => {
            userService.add(element)
        });
    }

    //Check and apply course seed data
    var isExistsCourse = await courseService.checkDataExists();
    if (!isExistsCourse) {
        courses.forEach(element => {
            courseService.add(element)
        });
    }

     //Check and apply exam seed data
     var isExistsExam = await examService.checkDataExists();
     if (!isExistsExam) {
         exams.forEach(element => {
             examService.add(element)
         });
     }
     //Check and apply enrollment seed data
     var isExistsEnrollment = await enrollmentService.checkDataExists();
     if (!isExistsEnrollment) {
         enrollments.forEach(element => {
            enrollmentService.add(element)
         });
     }
}

module.exports = {
    applySeedData: applySeedData
}