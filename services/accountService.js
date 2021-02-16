var googleFirestoreService = require("./googleFirestoreService");
var jwtService = require("./jwtService");

let checkAccountIsValid = async (loginModel) => {
    console.log(loginModel);
    var userRef = googleFirestoreService.getCollection('users');
    const snapshot = await userRef.where('userName', '==', loginModel.userName).get();
    if (snapshot.empty) {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Account couldn't found!"
        }
    }
    let user;
    snapshot.forEach(doc => {
        user = doc.data();
    });
    //Check Account
    if (user.password == loginModel.password) {
        delete user.password
        var jwtResponse = await jwtService.sign({ id: user.id, userName: user.userName, userType: user.type }, "1h");
        if (!jwtResponse.isSuccess) {
            return {
                isSuccess: false,
                data: null,
                errorMessage: "Unexpected error => " + jwtResponse.errorMessage
            }
        }

        return {
            isSuccess: true,
            data: {
                accessToken: jwtResponse.data,
                user: user
            },
            errorMessage: null,
        }
    }
    else {
        return {
            isSuccess: false,
            data: null,
            errorMessage: "Username or password is incorrect!"
        }
    }
}

module.exports = {
    checkAccountIsValid: checkAccountIsValid,
}