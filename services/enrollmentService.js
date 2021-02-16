const { v4: uuidv4 } = require('uuid');
const enrollments = require('../seed_data/enrollments');
var googleFirestoreService = require("./googleFirestoreService");

let add = async (enrollment) => {
    var collection = googleFirestoreService.getCollection('enrollments');
    const docRef = collection.doc(enrollment.id);
    await docRef.set(enrollment);
    return enrollment;
}

let getById = async (id) => {
    var userRef = googleFirestoreService.getCollection('enrollments');
    const snapshot = await userRef.where('id', '==', id).get();

    if (snapshot.empty) {
        return null;
    }

    let enrollment;
    snapshot.forEach(doc => {
        enrollment = doc.data();
    });
    return enrollment;
}

let getAllByUserId = async (userId) => {
    var collection = googleFirestoreService.getCollection('enrollments');
    const snapshot = await collection.where('userId', '==', userId).get();
    if (snapshot.empty) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Enrollments not found!"
        }
    }
    let enrollments = [];
    snapshot.forEach(doc => {
        var enrollment = doc.data();
        enrollments.push(enrollment);
    });
    return enrollments;
}

let getStudentAnswers = async (studentId,examId) => {

    //find enrollments which student have
    let enrollments= await getAllByUserId(studentId);

    //find exam
    var collection = googleFirestoreService.getCollection('exams');
    const snapshot = await collection.where('id', '==', examId).get();
    if (snapshot.empty) {
        return null;
    }
    let exam;
    snapshot.forEach(doc => {
        exam = doc.data();
        exam.startDate = exam.startDate.toDate();
        exam.endDate = exam.endDate.toDate();
    });

    let answers;
    let enrollment;
    //find specific enrollment and exam
    for (var each of enrollments) {
        if(each.courseId == exam.courseId){
            enrollment=each;
        }
    }
    for (var el of enrollment.exams) {
        if(el.examId==examId){
            //founded specific exam
            answers=el.answers;
        }
    }
    return answers;
}

let getStudentGrade = async (studentId,examId) => {

    //find enrollments which student have
    let enrollments= await getAllByUserId(studentId);

    //find exam
    var collection = googleFirestoreService.getCollection('exams');
    const snapshot = await collection.where('id', '==', examId).get();
    if (snapshot.empty) {
        return null;
    }
    let exam;
    snapshot.forEach(doc => {
        exam = doc.data();
        exam.startDate = exam.startDate.toDate();
        exam.endDate = exam.endDate.toDate();
    });

    let grade;
    let enrollment;
    //find specific enrollment and exam
    for (var each of enrollments) {
        if(each.courseId == exam.courseId){
            enrollment=each;
        }
    }
    for (var el of enrollment.exams) {
        if(el.examId==examId){
            //founded specific exam
            grade=el.grade;
        }
    }

    if (grade==undefined){
        return null;
    }
    return grade;
}


let getAll = async () => {

    const collection = googleFirestoreService.getCollection('enrollments');
    const snapshot = await collection.get();
    let enrollments = [];
    let enrollment;
    snapshot.forEach(doc => {
        enrollment = doc.data();
        enrollments.push(enrollment);
    });
    return enrollments;
}

let getAllByCourseId = async (courseId) => {
    var collection = googleFirestoreService.getCollection('enrollments');
    const snapshot = await collection.where('courseId', '==', courseId).get();
    if (snapshot.empty) {
        return null;
    }
    let enrollments = [];
    snapshot.forEach(doc => {
        var enrollment = doc.data();
        enrollments.push(enrollment);
    });
    return enrollments;
}

let deleteById = async (id) => {
    const collection = googleFirestoreService.getCollection('enrollments');
    await collection.doc(id).delete();
    return {
        isSuccess: true,
        errorMessage: null
    }
}


let getAllUsersOnEnrollmentsByCourseId = async (courseId) => {
    let enrollments = await getAllByCourseId(courseId);
    if(enrollments == null || enrollments == undefined){
        return null;
    }
    let users = []
    for (var each of enrollments) {
        var userRef = googleFirestoreService.getCollection('users');
        const snapshot = await userRef.where('id', '==', each.userId).get();

        if (snapshot.empty) {
            return null;
        }

        let user;
        snapshot.forEach(doc => {
            user = doc.data();
            user.exams = each.exams;
        });
        users.push(user);
    }
    return users;
}

let getAllCoursesOnEnrollmentsByUserId = async (userId) => {
    let enrollments = await getAllByUserId(userId);
    let courses=[];
    if(enrollments == null || enrollments == undefined){
        return null;
    }
    for (var each of enrollments) {
        var userRef = googleFirestoreService.getCollection('courses');
        const snapshot = await userRef.where('id', '==', each.courseId).get();

        if (snapshot.empty) {
            return null;
        }

        let course;
        snapshot.forEach(doc => {
            course = doc.data();
        });
        courses.push(course);
    }
    return courses;
 }

let deleteByUserId = async (userId) => {
    var collection = googleFirestoreService.getCollection('enrollments');
    const snapshot = await collection.where('userId', '==', userId).get();
    if (snapshot.empty) {
        return null;
    }
    snapshot.forEach(doc => {
        doc.ref.delete();
    });
    return true;
}

let update = async (enrollmentPutModel) => {
    let enrollment =await getById(enrollmentPutModel.id);
    if (!enrollment) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Enrollment not found!"
        }
    }
    enrollment.id = enrollmentPutModel.id;
    enrollment.userId = enrollmentPutModel.userId;
    enrollment.courseId = enrollmentPutModel.courseId;
    
    //Firestore update.
    var userRef = googleFirestoreService.getCollection('enrollments').doc(enrollmentPutModel.id);
    userRef.set(enrollment);

    return {
        isSuccess: true,
        data: enrollment,
        errorMessage: null
    };
}

let uploadExam = async (PutModel) => {
    // postModel : studentId, examId, answers
    var collection = googleFirestoreService.getCollection('exams');
    const snapshot = await collection.where('id', '==', PutModel.examId).get();
    if (snapshot.empty) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Exam not found!"
        }
    }
    let exam;
    snapshot.forEach(doc => {
        exam = doc.data();
        exam.startDate = exam.startDate.toDate();
        exam.endDate = exam.endDate.toDate();
    });

    let grade=0;
    let point=100/exam.answers.length;

    for(let i=0;i<exam.answers.length;i++){
        if(exam.answers[i]==PutModel.answers[i]){
            grade=grade+point;
        }
    }

    let enrollments =await getAllByUserId(PutModel.studentId);
    let enrollment;

    if (!enrollments) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Enrollments not found!"
        }
    }
    for (var each of enrollments) {
        if(each.courseId==exam.courseId){
            enrollment=each;
        }
    }
    
    let examInfoModel = {
        examId: PutModel.examId,
        answers: PutModel.answers,
        grade: grade,
    }
    enrollment.exams.push(examInfoModel);

    //Firestore update.
    var enrollmentRef = googleFirestoreService.getCollection('enrollments').doc(enrollment.id);
    enrollmentRef.set(enrollment);

    return {
        isSuccess: true,
        data: enrollment,
        errorMessage: null
    };
}

let checkDataExists = async () => {
    var collection = googleFirestoreService.getCollection('enrollments');
    var snapshot = await collection.get();
    if (snapshot.empty)
        return false
    else
        return true
}

module.exports = {
    add: add,
    getById: getById,
    getAllByUserId: getAllByUserId,
    getAllByCourseId: getAllByCourseId,
    checkDataExists: checkDataExists,
    getAll: getAll,
    deleteById: deleteById,
    deleteByUserId: deleteByUserId,
    update: update,
    getAllUsersOnEnrollmentsByCourseId: getAllUsersOnEnrollmentsByCourseId,
    getAllCoursesOnEnrollmentsByUserId:getAllCoursesOnEnrollmentsByUserId,
    uploadExam:uploadExam,
    getStudentAnswers:getStudentAnswers,
    getStudentGrade:getStudentGrade,
};