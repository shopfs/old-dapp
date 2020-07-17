import SpaceClient from "@fleekhq/space-client";

const client = new SpaceClient({ url: `http://0.0.0.0:9998` });

export const daemonService = {
    createBucket,
    shareBucket,
    uploadFile
};

async function createBucket(bucketName) {
    const bucketResponse = await client.createBucket({ slug: bucketName });
    return bucketResponse.getBucket();
}

async function shareBucket(bucketName) {
    // bucket sharing details to be saved in  3box/any other alternative
    const sharingResponse = await client.shareBucket({ bucketName });
    const threadInfo = sharingResponse.getThreadinfo();
    return { key: threadInfo.getKey(), addresses: threadInfo.getAddressesList() };
}

async function uploadFile(bucketName, filePath) {
    // uploading file to bucket have to integrate with button
    const stream = await client.addItems({
        bucket: bucketName,
        targetPath: "/", // path in the bucket to be saved
        sourcePaths: [filePath]
    });
    // events to capture the file uploading journey
    await stream.on("data", data => {
        console.log("data: ", data);
    });

    await stream.on("error", error => {
        console.error("error: ", error);
    });

    return await new Promise(resolve => {
        stream.on("end", () => {
            console.log("end");
            resolve();
        });
    });
}
