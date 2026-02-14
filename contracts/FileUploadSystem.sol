// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

contract FileUploadSystem {

    struct Properties {
        uint256 time;
        string placeHolder;
        bool exists;
    }

    struct File{
        bytes32 fileHash;
        string fileName;
        string placeHolder;
        uint256 time;
    }
    
    mapping(address => mapping(bytes32 => Properties)) private User;
    mapping(address => File[]) private UserFiles;

    event UploadStatus(
        address user,
        bytes32 filehash,
        string CID,
        bool status
    );

    event DeleteStatus(
        address user,
        bytes32 filehash,
        bool status
    );

    function Upload(string memory fileName, bytes32 fileHash, string memory CID) public returns(bool){
        address owner = msg.sender;

        require(!User[owner][fileHash].exists, "File already exists");

        uint256 time = block.timestamp;
        User[owner][fileHash] = Properties({
            time: time,
            placeHolder: CID,
            exists: true
        });

        UserFiles[owner].push(File({
            fileHash: fileHash,
            placeHolder: CID,
            time: time,
            fileName: fileName
        }));

        emit UploadStatus(owner, fileHash, CID, true);
        return true;
    }

    function Read(bytes32 fileHash) public view returns(string memory){
        address owner = msg.sender;

        require(User[owner][fileHash].exists, "The file do not exist");

        return User[owner][fileHash].placeHolder;
    }

    function Delete(bytes32 fileHash) public returns(bool){
        address owner = msg.sender;

        require(User[owner][fileHash].exists, "The file do not exist");

        delete User[owner][fileHash];

        File[] storage fileList = UserFiles[owner];

        for (uint i = 0; i < fileList.length; i++) {
            if (fileList[i].fileHash == fileHash) {

                fileList[i].fileHash = fileList[fileList.length - 1].fileHash;
                fileList[i].fileName = fileList[fileList.length - 1].fileName;
                fileList[i].time = fileList[fileList.length - 1].time;
                fileList[i].placeHolder = fileList[fileList.length - 1].placeHolder;
                fileList.pop();
                break;
            }
        }

        emit DeleteStatus(owner, fileHash, true);
        return true;
    }

    function GetMyFiles() public view returns(File[] memory){
        return UserFiles[msg.sender];
    }

    function GetFileInfo(bytes32 fileHash)
        public
        view
        returns(uint256 time, string memory CID)
    {
        require(User[msg.sender][fileHash].exists, "File not exist");

        Properties memory file = User[msg.sender][fileHash];
        return (file.time, file.placeHolder);
    }
}
