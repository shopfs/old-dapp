export const getImageUrl = profileImage => {
    return "https://ipfs.infura.io/ipfs/" + profileImage[0].contentUrl["/"];
};

export const getThreadName = ({ fileId, metadataHash }) => {
    return `3box_thread_${fileId}_${metadataHash}`;
};
