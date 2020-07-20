export const keysService = {
    getThreadData,
    putThreadData
};

const url =
    "http://ec2-18-222-183-167.us-east-2.compute.amazonaws.com:1880/files";

async function getThreadData(fileId) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };
    let response = await fetch(`${url}/${fileId}`, requestOptions);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return response.json();
    }
}

async function putThreadData(fileId, payload) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };
    let response = await fetch(`${url}/${fileId}`, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        console.log("success");
    }
}
