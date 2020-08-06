import React, { useState, useEffect } from "react";
import FilesDisplay from "../components/FilesDisplay";
import Loading from "../components/Loading";
import { allFilesQuery } from "../helpers/graph";
import { ipfsService } from "../services";
import { useQuery } from "urql";
import "../assets/scss/filesPage.scss";

const FilesPage = () => {
    const [allFiles, setFiles] = useState();
    const [res, executeQuery] = useQuery({
        query: allFilesQuery,
        requestPollicy: 'network-only'
    });

    useEffect(() => {
        async function getMetadata(file) {
            return {
                ...file,
                metadata: await ipfsService.getMetadata(file.metadataHash)
            };
        }
        async function getFiles() {
            let files = res.data.files;
            files = await Promise.all(
                res.data.files.map((file, i) => getMetadata(file))
            );
            console.log(files);
            setFiles(files);
        }
        if (res && !res.error && !res.fetching && res.data.files) {
            console.log("getting metadata");
            getFiles();
        }
    }, [res]);

    if (res.fetching) return <Loading />;
    if (res.error) return <p>Errored!</p>;

    return (
        <div className="filesPage">
            {allFiles && <FilesDisplay allFiles={allFiles} />}
        </div>
    );
};

export default FilesPage;
