import React, { useState, useEffect } from "react";
import { useQuery } from "urql";
import { userOwnedFilesQuery } from "../helpers/graph";
import { ipfsService } from "../services";
import FilesDisplay from "./FilesDisplay";
import Loading from "./Loading";

const UserOwnedFiles = ({ address, isLoggedInUser }) => {
    const [allFiles, setFiles] = useState();
    const [loading, setLoading] = useState(false);
    const [res, executeQuery] = useQuery({
        query: userOwnedFilesQuery(address)
    });

    useEffect(() => {
        async function getMetadata(file) {
            return {
                ...file,
                metadata: await ipfsService.getMetadata(file.metadataHash)
            };
        }
        async function getFiles() {
            setLoading(true);
            let files = res.data.user.filesOwned;
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
            res.data.user.filesOwned &&
            res.data.user.filesOwned.length
        ) {
            console.log("getting metadata");
            getFiles();
        }
    }, [res]);

    if (res.fetching || loading) return <Loading />;
    if (res.error) return <p>Errored!</p>;

    return (
        <div className="userOwnedFiles">
            <span className="profileTitle">Files for sale</span>
            {allFiles ? (
                <FilesDisplay allFiles={allFiles} />
            ) : isLoggedInUser ? (
                <p>{"  You have no files for sale"}</p>
            ) : (
                <p>{"  User no files for sale"}</p>
            )}
        </div>
    );
};

export default UserOwnedFiles;
