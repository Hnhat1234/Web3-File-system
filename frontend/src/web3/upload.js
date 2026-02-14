import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import contractABI from "../abi/FileUploadSystem.json";
import net from "../config/config.json"

/**
 * Upload file metadata to smart contract
 * @param {string} privateKey
 * @param {File} file
 * @param {string} contractAddress
 */

export const uploadFile = async (privateKey, file, contractAddress) => {
  try {
    // Connect to local IPFS Desktop
    const ipfs = create({
      host: net.host,
      port: 5001,
      protocol: "http",
    });

    // Upload file to IPFS
    const added = await ipfs.add(file);
    const CID = added.cid.toString();

    console.log("IPFS CID:", CID);

    // Ethereum provider
    const provider = new ethers.JsonRpcProvider(
      net.URL
    );

    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      wallet
    );

    // Optional: still compute fileHash for integrity
    const arrayBuffer = await file.arrayBuffer();
    const fileHash = ethers.keccak256(new Uint8Array(arrayBuffer));

    console.log("Uploading to blockchain...");
    console.log("File Hash:", fileHash);

    // Call contract
    const tx = await contract.Upload(file.name, fileHash, CID);

    console.log("Transaction sent:", tx.hash);

    await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
      fileHash,
      CID,
    };

  } catch (err) {
    console.error("Upload failed:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
