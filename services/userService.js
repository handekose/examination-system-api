const { v4: uuidv4 } = require('uuid');
var googleFirestoreService = require("./googleFirestoreService");
const appSettings = require("../configurations/appSettings")
var enrollmentService = require("./enrollmentService") 
var courseService = require("./courseService") 

let add = async (user) => {
    if (!user.id) {
        user.id = uuidv4();
    }
    var collection = googleFirestoreService.getCollection('users');
    const docRef = collection.doc(user.id);
    await docRef.set(user);
    return user;
}

let getByUserName = async (userName) => {
    var collection = googleFirestoreService.getCollection('users');
    const userRef = collection.doc(userName);
    const doc = await userRef.get();
    if (!doc.exists) {
        return null;
    } else {
        let user = doc.data();
        return user;
    }
}

let getById = async (id) => {
    var userRef = googleFirestoreService.getCollection('users');
    const snapshot = await userRef.where('id', '==', id).get();

    if (snapshot.empty) {
        return null;
    }

    let user;
    snapshot.forEach(doc => {
        user = doc.data();
    });
    return user;
}

let getAll = async () => {

    const collection = googleFirestoreService.getCollection('users');
    const snapshot = await collection.get();
    let users = [];
    let user;
    snapshot.forEach(doc => {
        user = doc.data();
        users.push(user);
    });
    return users;
}

let deleteById = async (id) => {
    if (id == appSettings.adminId) {
        return {
            isSuccess: false,
            errorMessage: "Admin can not delete!"
        }
    }

    let user = await getById(id);
    if (!user) {
        return false
    }

    //Delete related user data
    if(user.type == "student")
        await enrollmentService.deleteByUserId(id);
    else if(user.type == "teacher")
        await courseService.removeTeacher(id);

    const collection = googleFirestoreService.getCollection('users');
    await collection.doc(id).delete();
    
    return true;
}

let update = async (userPutModel) => {
    if (userPutModel.id == appSettings.adminId) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Admin can not update!"
        }
    }

    let user = await getById(userPutModel.id);
    if (!user) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "User not found!"
        }
    }

    user.type = userPutModel.type;
    user.userName = userPutModel.userName;
    user.info.name = userPutModel.name;
    user.info.surname = userPutModel.surname;
    user.info.mail = userPutModel.mail;
    user.info.schoolNumber = userPutModel.schoolNumber;

    //Firestore update.
    var userRef = googleFirestoreService.getCollection('users').doc(userPutModel.id);
    userRef.set(user);

    return {
        isSuccess: true,
        data: user,
        errorMessage: null
    };
}

let checkDataExists = async () => {
    var userRef = googleFirestoreService.getCollection('users');
    var snapshot = await userRef.get();
    if (snapshot.empty)
        return false
    else
        return true
}

module.exports = {
    add: add,
    getByUserName: getByUserName,
    getById: getById,
    checkDataExists: checkDataExists,
    getAll: getAll,
    deleteById: deleteById,
    update: update,
};

