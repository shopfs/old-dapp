import { SpaceClient } from '@fleekhq/space-client';

const client = new SpaceClient({
  // url: 'http://ec2-3-17-128-193.us-east-2.compute.amazonaws.com:9998',
  url: 'http://localhost:9998',
});

export const daemonService = {
    uploadFile,
    openFile
};

const folderName = "folderName";

const getEntryObject = entry => ({
    path: entry.getPath(),
    name: entry.getName(),
    isDir: entry.getIsdir(),
    created: entry.getCreated(),
    updated: entry.getUpdated(),
    ipfsHash: entry.getIpfshash(),
    sizeInBytes: entry.getSizeinbytes(),
    fileExtension: entry.getFileextension()
});

async function uploadFile(bucket, filePath) {
    // uploading file to bucket have to integrate with button
    console.log({ bucket, filePath });
    await client.createBucket({ slug: bucket });
    console.log("bucket created");
    await client.createFolder({ bucket, path: folderName });
    console.log("folder created: ", folderName);
    await client.addItems({
        bucket,
        targetPath: folderName, // path in the bucket to be saved
        sourcePaths: [filePath]
    });
    console.log("file added!");

    const sharingResponse = await client.shareBucket({ bucket });
    console.log("bucket shared");
    const threadInfo = sharingResponse.getThreadinfo();
    return {
        key: threadInfo.getKey(),
        addressList: threadInfo.getAddressesList(),
        addresses: threadInfo.getAddressesList().join(", ")
    };
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function openFile(bucket, threadInfo) {
    const payload = {
        bucket,
        threadInfo: {
            key: threadInfo.key,
            addresses: threadInfo.addresses.replace(" ", "").split(",")
        }
    };
    console.log({ payload });
    try {
        const res = await client.joinBucket(payload);
        console.log("bucket joined: ", res.getResult());
    } catch (error) {
        console.log({joinError: error});
        if (error.code !== 2 || error.message !== "db already exists")  {
            throw error
        }
    }
    const input0 = {
        bucket,
        path: ""
    };
    console.log({ input0 });
    await timeout(15000)
    console.log("timeout done, listing");
    const dirRes0 = await client.listDirectory(input0);
    const entryList0 = dirRes0.getEntriesList();
    const entries0 = entryList0.map(entry => getEntryObject(entry));

    console.log({ entries0 });
    const input1 = {
        bucket,
        path: folderName
    };
    console.log({ input1 });
    const dirRes1 = await client.listDirectory(input1);
    const entryList1 = dirRes1.getEntriesList();
    const entries1 = entryList1.map(entry => getEntryObject(entry));

    console.log({ entries1 });

    const path = entries1[1].path;
    console.log({ path });
    console.log({ bucket, path });
    const openFileRes = await client.openFile({
        bucket,
        path
    });

    const location = openFileRes.getLocation();
    console.log("file opened");
    console.log({ location });
    return location;
}
