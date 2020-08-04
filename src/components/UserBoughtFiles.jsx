import React, { useState, useEffect } from "react";
import { useQuery } from "urql";
import { userBoughtFilesQuery } from "../helpers/graph";
import { ipfsService } from "../services";
import FilesDisplay from "./FilesDisplay";
import Loading from "./Loading";

const UserBoughtFiles = ({ address, isLoggedInUser }) => {
    const [allFiles, setFiles] = useState();
    const [loading, setLoading] = useState(false);
    const [res, executeQuery] = useQuery({
        query: userBoughtFilesQuery(address)
    });

    useEffect(() => {
        async function getMetadata(file) {
            return {
                ...file,
                metadata: await ipfsService.getMetadata(file.metadataHash)
            };
        }
        async function getFiles() {
            setLoading(true)
            let files = res.data.user.filesBought;
            files = await Promise.all(
                files.map((file, i) => getMetadata(file))
            );
            console.log(files);
            setFiles(files);
            setLoading(false);
        }
        if (
            res &&
            !res.error &&
            !res.fetching &&
            res.data.user &&
            res.data.user.filesBought &&
            res.data.user.filesBought.length
        ) {
            console.log("getting metadata");
            getFiles();
        }
    }, [res]);

    if (res.fetching || loading) return <Loading />;
    if (res.error) return <p>Errored!</p>;

    return (
        <div className="userBoughtFiles">
            <span className="profileTitle">Bought Files</span>
            {allFiles ? (
                <FilesDisplay allFiles={allFiles} />
            ) : isLoggedInUser ? (
                <p> You have bought no files </p>
            ) : (
                <p> User has bought no files </p>
            )}
        </div>
    );
};

export default UserBoughtFiles;
