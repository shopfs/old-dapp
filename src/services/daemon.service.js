import SpaceClient from "@fleekhq/space-client";

const client = new SpaceClient({ url: `http://localhost:9998` });

export const daemonService = {
    createBucket,
    shareBucket,
    uploadFile,
    joinBucket,
    openFile
};

async function createBucket(bucketName) {
    const bucketResponse = await client.createBucket({ slug: bucketName });
    return bucketResponse.getBucket();
}

async function shareBucket(bucketName) {
    // bucket sharing details to be saved in  3box/any other alternative
    const sharingResponse = await client.shareBucket({ bucketName });
    const threadInfo = sharingResponse.getThreadinfo();
    return {
        key: threadInfo.getKey(),
        addresses: threadInfo.getAddressesList()
    };
}

async function uploadFile(bucketName, filePath) {
    let uploadData;
    // uploading file to bucket have to integrate with button
    const stream = await client.addItems({
        bucket: bucketName,
        targetPath: "/", // path in the bucket to be saved
        sourcePaths: [filePath]
    });

    await stream.on("error", error => {
        console.error("error: ", error);
    });

    return await new Promise(resolve => {
        stream.on("data", data => {
            console.log("data: ", data);
            resolve(data.array[0][1]);
        });
    });
}

async function joinBucket(bucketName, threadInfo) {
    const bucket = await client.joinBucket({ bucket: bucketName, threadInfo });
    console.log({ bucket });
    return;
}

async function openFile(bucket) {
    const openFileRes = await client.openFile({
        bucket,
        path: "/"
    });

    const location = openFileRes.getLocation();
    console.log(location);
    return location;
}
