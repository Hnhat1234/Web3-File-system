import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import contractABI from "../abi/FileUploadSystem.json";
import net from "../config/config.json"

/**
 * Delete file from smart contract + IPFS
 * @param {string} fileHash
 * @param {string} contractAddress
 * @param {string} privateKey
 */
export const deleteFile = async (
  fileHash,
  contractAddress,
  privateKey
) => {
  try {
    const provider = new ethers.JsonRpcProvider(
      net.URL
    );

    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(
      contractAddress,
      contractABI.abi,
      wallet
    );

    console.log("Deleting file:", fileHash);

    //CID
    const CID = await contract.Read(fileHash);
    console.log("CID to unpin:", CID);

    //IPFS Desktop
    const ipfs = create({
      host: net.host,
      port: 5001,
      protocol: "http",
    });

    // Unpin file in IPFS node
    await ipfs.pin.rm(CID);
    console.log("Unpinned from IPFS");

    //Delete on-chain
    const tx = await contract.Delete(fileHash);

    console.log("Transaction sent:", tx.hash);

    await tx.wait();

    return {
      success: true,
      txHash: tx.hash,
    };

  } catch (err) {
    console.error("Delete failed:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
