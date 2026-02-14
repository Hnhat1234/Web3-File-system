import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { uploadFile } from "./web3/upload";
import { readFile } from "./web3/read";
import { deleteFile } from "./web3/delete";
import contractABI from "./abi/FileUploadSystem.json";
import net from "./config/config.json"

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("Root");
  const [folders] = useState(["Root"]);
  const [files, setFiles] = useState([]);

  const provide = `http://${net.host}:8545`;

  const loadFilesFromChain = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(provide);
      const wallet = new ethers.Wallet(privateKey, provider);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        wallet
      );

      const Myfile = await contract.GetMyFiles();

      const chainFiles = Myfile.map((fileat) => ({
        hash: fileat.fileHash,
        name: fileat.fileName,
        folder: "Root",
      }));

      setFiles(chainFiles);
    } catch (err) {
      console.error("Load files failed:", err);
    }
  };

  useEffect(() => {
    if (account) {
      loadFilesFromChain();
    } else {
      setFiles([]);
    }
  }, [account]);

  const login = async () => {
    try {
      if (!privateKey) {
        alert("Please enter private key");
        return;
      }

      const provider = new ethers.JsonRpcProvider(provide);
      const wallet = new ethers.Wallet(privateKey, provider);

      setAccount(wallet.address);
    } catch (err) {
      alert("Invalid private key or load failed");
    }
  };

  const logout = () => {
    setAccount(null);
    setPrivateKey("");
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !account) {
      alert("Please login first");
      return;
    }

    const result = await uploadFile(
      privateKey,
      file,
      CONTRACT_ADDRESS
    );

    if (result.success) {
      alert("Upload success");

      const newFile = {
        hash: result.fileHash,
        name: file.name,
        folder: "Root",
      };

      setFiles((prev) => [...prev, newFile]);

    } else {
      alert("Upload failed: " + result.error);
    }
  };


  const handleRead = async (hash) => {
    if (!account) {
      alert("Please login first");
      return;
    }

    const result = await readFile(
      privateKey,
      hash,
      CONTRACT_ADDRESS
    );

    if (!result.success) {
      alert("Read failed: " + result.error);
    }
  };


  const handleDelete = async (hash) => {
    if (!account) {
      alert("Please login first");
      return;
    }

    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const result = await deleteFile(
      hash,
      CONTRACT_ADDRESS,
      privateKey
    );

    if (result.success) {
      setFiles((prev) => prev.filter((f) => f.hash !== hash));
    } else {
      alert("Delete failed: " + result.error);
    }
  };


  const filteredFiles = files.filter(
    (file) => file.folder === selectedFolder
  );

  return (
    <div style={styles.app}>
      <div style={styles.navbar}>
        <h2>Web3 File System</h2>

        {!account ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Enter private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              style={{
                padding: "6px",
                borderRadius: "5px",
                border: "none",
                width: "320px",
              }}
            />
            <button style={styles.button} onClick={login}>
              Login
            </button>
          </div>
        ) : (
          <div>
            <span style={{ marginRight: 10 }}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button style={styles.button} onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <div style={styles.body}>
        <div style={styles.sidebar}>
          {folders.map((folder) => (
            <div
              key={folder}
              style={{
                ...styles.folder,
                backgroundColor:
                  selectedFolder === folder ? "#444" : "transparent",
              }}
              onClick={() => setSelectedFolder(folder)}
            >
              📁 {folder}
            </div>
          ))}
        </div>

        <div style={styles.main}>
          <h3>{selectedFolder}</h3>

          <div style={styles.uploadBox}>
            <input
              type="file"
              onChange={handleUpload}
              disabled={!account}
            />
          </div>

          <div>
            {filteredFiles.length === 0 && (
              <p style={{ opacity: 0.6 }}>
                No files found on-chain
              </p>
            )}

            {filteredFiles.map((file) => (
              <div key={file.hash} style={styles.fileItem}>
                <span>📄 {file.name}</span>
                <div>
                  <button
                    style={styles.smallButton}
                    onClick={() => handleRead(file.hash)}
                  >
                    Read
                  </button>

                  <button
                    style={{
                      ...styles.smallButton,
                      backgroundColor: "#c0392b",
                    }}
                    onClick={() => handleDelete(file.hash)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    backgroundColor: "#1e1e1e",
    color: "white",
  },
  body: {
    display: "flex",
    flex: 1,
  },
  sidebar: {
    width: "220px",
    backgroundColor: "#2c2c2c",
    color: "white",
    padding: "15px",
  },
  folder: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  main: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  uploadBox: {
    marginBottom: "20px",
  },
  fileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "white",
    marginBottom: "10px",
    borderRadius: "6px",
  },
  button: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  smallButton: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    marginLeft: "5px",
    cursor: "pointer",
  },
};

export default App;
