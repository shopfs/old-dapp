export const keysService = {
    getThreadData,
    putThreadData
};

const url =
    "http://ec2-18-222-183-167.us-east-2.compute.amazonaws.com:1880/files";

async function getThreadData(fileId, signature) {
    const requestOptions = {
        method: "GET"
    };
    const getURL = `${url}/${fileId}?sign=${signature}`;
    const response = await fetch(getURL, requestOptions);

    if (!response.ok) {
        return handleError(response)
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
    const postURL = `${url}/${fileId}`;
    const response = await fetch(postURL, requestOptions);

    if (!response.ok) {
        return handleError(response)
    } else {
        console.log("success");
    }
}

function handleError(response) {
    switch (response.status) {
        case 401:
            throw "Unauthorized Access"
        case 404:
            throw "File not found"
        case 500:
        default:
            throw "Internal Server Error"
    }
}
