var usersController = require("usersController")
var express = require('express');
const jwtService = require("../services/jwtService");
var router = express.Router()

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



module.exports = router