import fs from "fs";

const artifactPath =
  "./artifacts/contracts/FileUploadSystem.sol/FileUploadSystem.json";

const frontendPath =
  "./frontend/src/abi/FileUploadSystem.json";

const artifact = JSON.parse(fs.readFileSync(artifactPath));

const exportData = {
  abi: artifact.abi,
  bytecode: artifact.bytecode,
};

fs.writeFileSync(
  frontendPath,
  JSON.stringify(exportData, null, 2)
);

console.log("ABI + Bytecode exported successfully!");
