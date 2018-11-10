var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
    var param = req.query;
    var query = "SELECT " +
        "CS.name AS csName, " +
        "ET.name AS eventName, " +
        "CSP.name AS productName, " +
        "CSP.price AS price, " +
        "CSP.image AS image " +
        "FROM cs_product AS CSP " +
        "INNER JOIN cs_type AS CS " +
        "ON CSP.cs_type = CS.id " +
        "INNER JOIN event_type AS ET " +
        "ON CSP.event_type = ET.id " +
        "WHERE CSP.cs_type = ${csType} AND CSP.event_type = ${eventType}";

    if (typeof param.csType === "undefined")
        query = query.replace("CSP.cs_type = ${csType}", "1=1");
    else
        query = query.replace("${csType}", param.csType);

    if (typeof param.eventType === "undefined")
        query = query.replace("CSP.event_type = ${eventType}", "1=1");
    else
        query = query.replace("${eventType}", param.eventType);

    req.sql(query, function (err, rows) {
        if (err) {
            res.json({status: false, code: 1, contents: err});
            return;
        }

        res.json({status: true, code: 1, contents: rows});
    });
});

module.exports = router;
