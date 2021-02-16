var express = require('express')
var router = express.Router()
var accountService = require("../services/accountService");
const jwtService = require('../services/jwtService');

// middleware that is specific to this router
router.use(async function timeLog(req, res, next) {
    next()
})

router.post("/login", async function (req, res) {
    console.log("alo");
    if(req.body.userName == null || req.body.password == null){
        res.send({
            isSuccess: false,
            message: "Missing userName or password."
        });
        return;
    }
    console.log("alo2");
    let response = await accountService.checkAccountIsValid(req.body);
    console.log("response", response);
    res.send(response);
})

module.exports = router
