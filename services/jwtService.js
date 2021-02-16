const appSettings = require("../configurations/appSettings")
const jwt = require('jsonwebtoken');

let sign = (sign_info, expire_time) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.sign(sign_info, appSettings.jwt.secret, { expiresIn: expire_time }, function (err, token) {
                if (err !== null) {
                    return reject({ isSuccess: false, errorMessage: "JWT can not signed!", error: err });
                }

                resolve({ isSuccess: true, data: token });
            });
        }
        catch (e) {
            return reject({ isSuccess: false, errorMessage: e.message });
        }
    });
}

let verify = access_token => {
    try {
        return { isSuccess: true, data: jwt.verify(access_token, appSettings.jwt.secret) };
    }
    catch (e) {
        return { isSuccess: false, errorMessage: e.message }
    }
}

module.exports = {
    sign: sign,
    verify: verify
}