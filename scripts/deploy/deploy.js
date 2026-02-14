import { ethers } from "ethers";
import dotenv from "dotenv";
import { loadArtifact } from "../utils/loadArtifact.js";
import { networks } from "../config/networks.js";

dotenv.config();

const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function deploy() {
    const provider = new ethers.JsonRpcProvider(networks.local.url);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const artifact = loadArtifact("FileUploadSystem");

    const factory = new ethers.ContractFactory(
        artifact.abi,
        artifact.bytecode,
        wallet
    );

    console.log("Deploying FileUploadSystem...");
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log("Deployed at:", await contract.getAddress());
}

deploy().catch(console.error);
