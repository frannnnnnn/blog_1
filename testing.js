const express = require("express");
const router =  express.Router();

router.get("/", (req, res) => {
    res.send("Testing testing router");
})

module.exports = router
