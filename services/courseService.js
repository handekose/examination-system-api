const { v4: uuidv4 } = require('uuid');
var googleFirestoreService = require("./googleFirestoreService");

let add = async (course) => {
    if (!course.id) {
        course.id = uuidv4();
    }
    var collection = googleFirestoreService.getCollection('courses');
    const docRef = collection.doc(course.id);
    await docRef.set(course);
    return course;
}

let getById = async (id) => {
    var collection = googleFirestoreService.getCollection('courses');
    const snapshot = await collection.where('id', '==', id).get();
    if (snapshot.empty) {
        return null;
    }
    let course;
    snapshot.forEach(doc => {
        course = doc.data();
    });
    return course;
}

let getByTeacherId = async (teacherId) => {
    var collection = googleFirestoreService.getCollection('courses');
    const snapshot = await collection.where('teacherId', '==', teacherId).get();
    if (snapshot.empty) {
        return null;
    }
    let courses = [];
    let course;
    snapshot.forEach(doc => {
        course = doc.data();
        courses.push(course);
    });
    return courses; 
}

let deleteById = async (id) => {
    const collection = googleFirestoreService.getCollection('courses');
    let result = await collection.doc(id).delete();
    return {
        isSuccess: true,
        errorMessage: null
    }
}

let getAll = async () => {

    const collection = googleFirestoreService.getCollection('courses');
    const snapshot = await collection.get();
    let courses = [];
    let course;
    snapshot.forEach(doc => {
        course = doc.data();
        courses.push(course);
    });
    return courses;
}
let update = async (coursePutModel) => {
    
    let course = await getById(coursePutModel.id);
    if (!course) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Course not found!"
        }
    }
    course.id = coursePutModel.id;
    course.name = coursePutModel.name;
    course.description = coursePutModel.description;

    //Firestore update.
    var userRef = googleFirestoreService.getCollection('courses').doc(coursePutModel.id);
    userRef.set(course);

    return {
        isSuccess: true,
        data: course,
        errorMessage: null
    };
}

let checkDataExists = async () => {
    var collection = googleFirestoreService.getCollection('courses');
    var snapshot = await collection.get();
    if (snapshot.empty)
        return false
    else
        return true
}

let removeTeacher = async (teacherId) => {
    var collection = googleFirestoreService.getCollection('courses');
    const snapshot = await collection.where('teacherId', '==', teacherId).get();
    if (snapshot.empty) {
        return false;
    }

    snapshot.forEach(doc => {
        let course = doc.data();
        course.teacherId = null;
        doc._ref.set(course);
    });

    return true;
}

module.exports = {
    add: add,
    getById: getById,
    checkDataExists: checkDataExists,
    getAll: getAll,
    deleteById: deleteById,
    update: update,
    removeTeacher: removeTeacher,
    getByTeacherId:getByTeacherId,
};