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
    const dirRes = await client.listDirectories({
        bucket: bucketName
    });
    const entriesList = dirRes.getEntriesList();
    const path = entriesList[0].getPath();

    // bucket sharing details to be saved in  3box/any other alternative
    const sharingResponse = await client.shareBucket({ bucketName });
    const threadInfo = sharingResponse.getThreadinfo();
    return {
        threadInfo: {
            key: threadInfo.getKey(),
            addresses: threadInfo.getAddressesList()
        },
        path
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
    return;
}

async function openFile(bucket, path) {
    console.log({bucket, path})
    const openFileRes = await client.openFile({
        bucket,
        path
    });

    const location = openFileRes.getLocation();
    console.log(location);
    return location;
}
