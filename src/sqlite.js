import { createDbWorker } from "sql.js-httpvfs"
import db from "../db.js";

export default async function (key='en') {
    // sadly there's no good way to package workers and wasm directly so you need a way to get these two URLs from your bundler.
    // This is the webpack5 way to create a asset bundle of the worker and wasm:
    const workerUrl = new URL(
        "/sqlite.worker.js",
        window.location.origin,
    );
    const wasmUrl = new URL(
        "/sql-wasm.wasm",
        window.location.origin,
    );
    // the legacy webpack4 way is something like `import wasmUrl from "file-loader!sql.js-httpvfs/dist/sql-wasm.wasm"`.
    // the config is either the url to the create_db script, or a inline configuration:
    const config = {
        from: "inline",
        config: {
            serverMode: "full", // file is just a plain old full sqlite database
            requestChunkSize: 8192, // the page size of the  sqlite database (by default 4096)
            url: window.location.origin.includes("localhost") ? db[key].dev : db[key].production // url to the database (relative or full)
        }
    }

    const worker = await createDbWorker(
        [config],
        workerUrl.toString(), wasmUrl.toString()
    );
    // you can also pass multiple config objects which can then be used as separate database schemas with `ATTACH virtualFilename as schemaname`, where virtualFilename is also set in the config object.
    // worker.db is a now SQL.js instance except that all functions return Promises.

    return worker;
}