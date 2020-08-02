export const keysService = {
    getThreadData,
    putThreadData
};

const url =
    "http://ec2-18-222-183-167.us-east-2.compute.amazonaws.com:1880/files";

async function getThreadData(fileId, signature) {
    const requestOptions = {
        method: "GET",
    };
    const getURL = `${url}/${fileId}?sign=${signature}`
    console.log(getURL)
    const response = await fetch(getURL, requestOptions);
    console.log({response})
    if (!response.ok) {
        throw response.data;
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
    const postURL = `${url}/${fileId}`
    console.log(postURL)
    const response = await fetch(postURL, requestOptions);

    if (!response.ok) {
        throw response.data;
    } else {
        console.log("success");
    }
}
