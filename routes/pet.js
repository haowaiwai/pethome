var express = require('express');
var router = express.Router();

router.post('/info', function(req, res, next) {
	json = '';
        res.send('post petinfo');
});

router.post('/list', function(req, res, next) {
	json = '{ \
    "total_results": "number",\
    "page": "number",\
    "results": [ \
        { \
            "latitude": "string",\
            "longitude": "string",\
            "date": "date",\
            "id": "number",\
            "address": "string",\
            "nickName": "string",\
            "thumbUrl": "string",\
            "title?": "string",\
            "year": "number",\
            "sex": "number",\
            "sterilization": "bool",\
            "category?": "number",\
            "hearRateArray?": [\
                "number",\
                "number"\
            ],\
            "temperatureArray?": [\
                "number",\
                "number"\
            ],\
            "lastVaccinateTime?": "date",\
            "lastVaccine?": "string",\
            "vaccinate?": "string",\
            "vaccinateTime?": "date",\
            "hasAlert": "bool",\
            "mode": "string"\
        }\
    ]\
}'
        page = req.body.page;
        page = parseInt(page);
	json = JSON.stringify(json);
	res.send(json);
});

module.exports = router;

