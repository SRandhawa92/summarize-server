/**
 * Summarize API Server
 * Author: SRandhawa
 * Date: 4/1/2022
 */

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
});

app.get('/', function (req, res) {
    res.status(200)
	res.send('Summarize Service');
});


