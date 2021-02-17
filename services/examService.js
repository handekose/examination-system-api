const { v4: uuidv4 } = require('uuid');
var googleFirestoreService = require("./googleFirestoreService");
var courseService = require("../services/courseService");
var enrollmentService = require("../services/enrollmentService");

let add = async (exam) => {
    if (!exam.id) {
        exam.id = uuidv4();
    }

    var collection = googleFirestoreService.getCollection('exams');
    const docRef = collection.doc(exam.id);

    await docRef.set(exam);
    return exam;
}

let getById = async (id) => {
    var collection = googleFirestoreService.getCollection('exams');
    const snapshot = await collection.where('id', '==', id).get();
    if (snapshot.empty) {
        return null;
    }
    let exam;
    snapshot.forEach(doc => {
        exam = doc.data();
        exam.startDate = exam.startDate.toDate();
        exam.endDate = exam.endDate.toDate();
    });
    return exam;
}

let getByCourseId = async (courseId) => {
    const collection = googleFirestoreService.getCollection('exams');
    const snapshot = await collection.where('courseId', '==', courseId).get();
    let exams = [];
    snapshot.forEach(doc => {
        let exam = doc.data();     
        exam.startDate = exam.startDate.toDate();
        exam.endDate = exam.endDate.toDate();
        exams.push(exam);
    });
    return exams;
}

let getByTeacherId = async (teacherId) => {
    let courses = [];
    courses = await courseService.getByTeacherId(teacherId);
    if (courses == null) {
        return [];
    }

    let exams = [];
    for (let element of courses) {
        const collection = googleFirestoreService.getCollection('exams');
        const snapshot = await collection.where('courseId', '==', element.id).get();
        snapshot.forEach(doc => {
            let exam = doc.data();
            exam.startDate = exam.startDate.toDate();
            exam.endDate = exam.endDate.toDate();
            exams.push(exam);
        });
    }

    return exams;
}

let getByUserId = async (userId) => {
    let enrollments = await enrollmentService.getAllByUserId(userId);
    if (enrollments == null || enrollments == undefined) {
        return null;
    }
    let exams = []
    for (var each of enrollments) {
        var userRef = googleFirestoreService.getCollection('exams');
        const snapshot = await userRef.where('courseId', '==', each.courseId).get();
        if (snapshot.empty) {
            return null;
        }

        let exam;
        snapshot.forEach(doc => {
            exam = doc.data();
            exam.startDate = exam.startDate.toDate();
            exam.endDate = exam.endDate.toDate();
            exams.push(exam);
        });
    }
    return exams;
}

let getAll = async () => {

    const collection = googleFirestoreService.getCollection('exams');
    const snapshot = await collection.get();
    let exams = [];
    let exam;
    snapshot.forEach(doc => {
        exam = doc.data();      
        exam.startDate = exam.startDate.toDate();
        exam.endDate = exam.endDate.toDate();
        exams.push(exam);
    });
    return exams;
}

let deleteById = async (id) => {
    const collection = googleFirestoreService.getCollection('exams');
    await collection.doc(id).delete();
    return {
        isSuccess: true,
        errorMessage: null
    }
}

let update = async (examPutModel) => {
    let exam = await getById(examPutModel.id);
    if (!exam) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Exam not found!"
        }
    }
    exam.name = examPutModel.name;
    exam.courseId = examPutModel.courseId;   
    exam.startDate = examPutModel.startDate.toDate();
    exam.endDate = examPutModel.endDate.toDate();
    exam.questions = examPutModel.questions;
    exam.answers = examPutModel.answers;

    //Firestore update.
    var userRef = googleFirestoreService.getCollection('exams').doc(examPutModel.id);
    userRef.set(exam);

    return {
        isSuccess: true,
        data: exam,
        errorMessage: null
    };
}

let checkDataExists = async () => {
    var collection = googleFirestoreService.getCollection('exams');
    var snapshot = await collection.get();
    if (snapshot.empty)
        return false
    else
        return true
}

module.exports = {
    add: add,
    getById: getById,
    checkDataExists: checkDataExists,
    getAll: getAll,
    deleteById: deleteById,
    getByCourseId: getByCourseId,
    update: update,
    getByTeacherId: getByTeacherId,
    getByUserId: getByUserId,
};