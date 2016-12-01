var express = require('express');
var path = require("path");
var repositoryLibrary = require(path.resolve(__dirname, "./../lib/repo"));
var outConverterLibrary = require(path.resolve(__dirname, "./../lib/output-converter"));

var generateRouter = function(configData) {
    var router = express.Router();
    var repository = repositoryLibrary(configData.repo.type, configData.repo.options);

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
                var outType = req.query.type || "json";
                res.contentType("text/" + outType);
                return res.status(200).send(outConverterLibrary(configData,outType));
            })
            .catch(function(err) {
                return next(err);
            })
    });


    return router;
};


module.exports = generateRouter;