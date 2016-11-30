var express = require('express');
var path = require("path");
var repositoryLibrary = require(path.resolve(__dirname, "./../lib/repo"));

var generateRouter = function(configData) {
    var router = express.Router();
    var repository = repositoryLibrary(configData.repo.type, configData.repo.uri);

    router.use(function(req,res,next) {
        repository.checkStatus()
            .then(function(status){
                if (status) {
                    return next();
                }

                return next(new Error("Repository is offline"));
            });
    });

    router.get('/', function(req, res) {
        return res.status(200).json({"message": "ok"});
    });

    router.get('/:application/:enviroment', function(req,res,next) {
        repository.getAppConfig(req.params.application, req.params.enviroment)
            .then(function(configData) {
                return res.status(200).json(configData);
            })
            .catch(function(err) {
                return next(err);
            })
    });


    return router;
};


module.exports = generateRouter;