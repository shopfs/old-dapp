export const getImageUrl = profileImage => {
    return "https://ipfs.infura.io/ipfs/" + profileImage[0].contentUrl["/"];
};
