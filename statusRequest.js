import fetch from "node-fetch";
import Process from "process";
import dotenv from "dotenv";

dotenv.config({ path: '.env' });
const urlBdp = "https://192.168.63.128:9090/bdocapi/v1/jobs/"

// Disable certificate verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


export async function jobStatus(jobId)  {
    let reqStatusResp;
    do {
        reqStatusResp = await requestStatus(urlBdp + jobId);
        console.log(`Job (${jobId}) status:  ${reqStatusResp.status}`);
        //setTimeout(() => {console.log("...")}, 1000);
    } while (reqStatusResp.status === "Running");

    console.log(`Checking job (${jobId}) details`);
    await requestStatus(urlBdp + jobId + "/details");
}


async function requestStatus (url)  {
    const options = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + Process.env.JWT,
            "Accept": "*/*"
        }
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log("RESPONSE:")
            console.log(jsonResponse);
            return jsonResponse;
        } else {
            console.log("Error: " + response.status);
        }
    } catch (error) {
        console.error(error);
    }
}


