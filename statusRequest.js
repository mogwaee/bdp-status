const fetch = require("node-fetch");
require("dotenv").config({ path: ".env" });
const createFile = require("./createFile.js");

const urlBdp = process.env.URLBDP + "/bdocapi/v1/jobs/";

// Disable certificate verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nowTime = () => {
    let d = new Date(Date.now());
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};

async function jobStatus(jobId, jobBranch) {
    let reqStatusResp;
    let reqDetailsResp;
    // Ajouter un setTimeout ici afin de ne pas boucler trop fréquemment
    do {
        reqStatusResp = await requestStatus(urlBdp + jobId);
        if (!("status" in reqStatusResp)) {
            return;
        }
        console.log(`Job (${jobId}) status:  ${reqStatusResp.status}`);
    } while (reqStatusResp.status === "Running");

    setTimeout(async () => {
        console.log(`Checking job (${jobId}) details`);
        reqDetailsResp = await requestStatus(urlBdp + jobId + "/details");
        createFile.flag(reqDetailsResp, jobBranch);
        console.log(nowTime() + " Notification finished.");
    }, 2000);
}

async function requestStatus(url) {
    const options = {
        method: "GET",
        headers: {
            Authorization: "Bearer " + process.env.JWT,
            Accept: "*/*",
        },
    };

    console.log("URL: " + url);

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log("RESPONSE:");
            console.log(jsonResponse);
            return jsonResponse;
        } else {
            console.log("Error: " + response.status);
            // Return json error message
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { jobStatus };
