export const keysService = {
    getThreadData,
    putThreadData
};

const url =
    "http://ec2-18-222-183-167.us-east-2.compute.amazonaws.com:1880/files";

async function getThreadData(fileHash) {
    const requestOptions = {
        method: "GET",
    };
    const getURL = `${url}/${fileHash}`
    console.log(getURL)
    const response = await fetch(getURL, requestOptions);
    console.log({response})
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        return response.json();
    }
}

async function putThreadData(fileHash, payload) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    };
    const postURL = `${url}/${fileHash}`
    console.log(postURL)
    const response = await fetch(postURL, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        console.log("success");
    }
}
