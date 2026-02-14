# Web3 File Storage System (IPFS + Ethereum)

A decentralized file sharing system built with IPFS and Ethereum Smart Contracts.

This project demonstrates how blockchain can be used to manage file ownership while IPFS handles decentralized storage.

# 🚀 Overview

Traditional file systems rely on centralized servers.

This application:

- Stores files on IPFS (InterPlanetary File System)

- Stores file metadata (CID, owner) on Ethereum Smart Contract

- Allows users to:

    - Upload files

    - Read files

    - Delete file references

- Supports multi-node IPFS demonstration in LAN environment

# 🏗 Architecture

User → React Frontend → IPFS → Smart Contract → Hardhat Network

Components

- Frontend: React + Ethers.js

- Blockchain: Hardhat local node

- Smart Contract: Solidity

- Storage: IPFS

- Gateway Access: http://IP:8080/ipfs/CID

# 🔐 How It Works

1. User logs in using private key

2. File is uploaded to IPFS

3. IPFS returns a CID

4. CID is stored on-chain

5. Other users can access file via:

    - IPFS Gateway

    - ipfs cat CID

Ownership is managed by the smart contract.

# 📦 Installation

1️⃣ Clone repository

``
git clone <your-repo-url>
cd <project-folder>
``

2️⃣ Install dependencies

``
npm install
``

3️⃣ Start Hardhat node

``
npx hardhat node --hostname 0.0.0.0
``

4️⃣ Deploy Smart Contract

``
npx hardhat run scripts/deploy/deploy.js --network localhost
``


Copy deployed contract address to:

``
App.jsx
``

5️⃣ Start IPFS daemon

``
ipfs daemon
``


If running multi-node demo:

- ipfs config Addresses.API "/ip4/0.0.0.0/tcp/5001"
- ipfs config Addresses.Gateway "/ip4/0.0.0.0/tcp/8080"


Restart daemon after config.

6️⃣ Start React App

If using Vite:

``
npm run dev -- --host
``


If using CRA:

``
HOST=0.0.0.0 npm start
``

# 🌐 Accessing from Another Machine

Ensure Hardhat runs on 0.0.0.0

Ensure IPFS Gateway runs on 0.0.0.0

Open required firewall ports:

- 8545 (RPC)

- 5001 (IPFS API)

- 8080 (IPFS Gateway)

- 3000 or 5173 (Frontend)

Access via:

- http://SERVER_IP:3000

# 🧪 Demo: Multi-Node IPFS

Machine A uploads file

Machine B runs ipfs daemon

Machine B fetches file:

ipfs cat <CID>


This demonstrates distributed storage.

# 📂 Project Structure
/contracts
  FileUploadSystem.sol

/scripts
  deploy.js

/src
  App.jsx
  web3/
    upload.js
    read.js
    delete.js

# 🛠 Smart Contract Features

Upload file metadata

Retrieve user files

Delete file reference

Ownership-based access

# ⚠ Notes

IPFS does not support deletion of content globally

Deleting a file removes reference from smart contract

This project runs on local Hardhat network

Designed for research and demonstration purposes

# 📈 Future Improvements

Access control list (ACL)

Encryption before IPFS upload

Deploy to public testnet

Use Pinning service (Pinata, Web3.Storage)

Replace private key login with MetaMask

# 🎓 Research Context

This project is developed for academic research in:

Secure Data Storage on Web3 using Blockchain Technology

It demonstrates decentralized storage principles and ownership management using smart contracts.

📜 License

MIT License
