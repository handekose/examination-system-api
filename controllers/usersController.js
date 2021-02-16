var express = require('express');
const jwtService = require('../services/jwtService');
var router = express.Router()
var userService = require("../services/userService")

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

// get users
router.get('/', async function (req, res) {
    let users = [];
    users = await userService.getAll();
    res.send(users);
})

// get user by username
router.get('/:username', async function (req, res) {
    let user = await userService.getByUserName(req.params.username);
    res.send(user);
})

// get user by id
router.get('/:id', async function (req, res) {
    var user = await userService.getById(req.params.id);
    res.send(user);
});

// delete user by user id
router.delete('/:id', async function (req, res) {
    var response = await userService.deleteById(req.params.id);
    res.send(response);
})
// add user
router.post('/', async function (req, res) {
    var response = await userService.add(req.body);
    res.send(response);
})
// update user
router.put('/', async function (req, res) {
    var response = await userService.update(req.body);
    res.send(response);
});

module.exports = router
