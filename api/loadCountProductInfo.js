var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
    var param = req.body;
    var query = "SELECT " +
        "count(*) AS count " +
        "FROM cs_product AS CSP " +
        "INNER JOIN cs_type AS CS " +
        "ON CSP.cs_type = CS.id " +
        "INNER JOIN event_type AS ET " +
        "ON CSP.event_type = ET.id " +
        "WHERE CSP.cs_type = ${csType} AND CSP.event_type = ${eventType} ${searchQuery}";

    if (typeof param.csType === "undefined")
        query = query.replace("CSP.cs_type = ${csType}", "1=1");
    else
        query = query.replace("${csType}", param.csType);

    if (typeof param.eventType === "undefined")
        query = query.replace("CSP.event_type = ${eventType}", "1=1");
    else
        query = query.replace("${eventType}", param.eventType);

    if (typeof param.searchTxt === "undefined")
        query = query.replace("${searchQuery}", "");
    else
        query = query.replace("${searchQuery}", "AND CSP.name LIKE '%" + param.searchTxt + "%' ");

    req.sql(query, function (err, rows) {
        if (err) {
            res.json({status: false, code: 1, contents: err});
            return;
        }

        res.json({status: true, code: 1, contents: rows[0]});
    });
});

module.exports = router;
