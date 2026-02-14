import fs from "fs";

export function loadArtifact(name) {
    const path = `./artifacts/contracts/${name}.sol/${name}.json`;
    return JSON.parse(fs.readFileSync(path, "utf8"));
}
