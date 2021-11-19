const express = require("express");
const statusRequest = require("./statusRequest.js");

const nowTime = () => {
    let d = new Date(Date.now());
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};
const app = express();
app.listen(3000, () => {
    console.log(nowTime() + " Server startup...");
    console.log(nowTime() + " Server ready: listening on port 3000.");
});

// Notify route
app.get("/notify", (req, res) => {
    //res.send('Notify Me!');
    res.status(200).json({ jobId: req.query.jobId });

    statusRequest.jobStatus(req.query.jobId).then(() => {
        console.log(nowTime() + " Notification finished.");
    });
});
