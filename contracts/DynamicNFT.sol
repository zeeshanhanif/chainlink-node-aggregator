// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DynamicNFT is ERC721URIStorage, ChainlinkClient, Ownable {
    using Strings for string;
    using Chainlink for Chainlink.Request;

    struct APIData {
        uint256 listenrs; // 400000
        string name; // youtube
    }

    APIData[] public apidata;

    mapping(bytes32 => address) requestToSender;
    mapping(bytes32 => uint256) requestToTokenId;

    uint256 public volume;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor()
        ERC721("DynamicNFT", "DYNFT")
    {   
        setPublicChainlinkToken();
        oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8; // kovan
        jobId = "d5270d1c311941d0b08bead21fea7747"; // kovan
        fee = 0.1 * 10 ** 18; // (Varies by network and job)
    }

    function requestNFTGeneration() public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        request.add("path", "USD");
        request.addInt("times", 100);
        
        // Sends the request
        requestId = sendChainlinkRequestTo(oracle, request, fee);
        requestToSender[requestId] = msg.sender;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        _setTokenURI(tokenId, _tokenURI);
    }

    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
        uint256 newId = apidata.length;
        apidata.push(APIData(volume,"Youtube"));
        _safeMint(requestToSender[_requestId], newId);
    }

    function getNumberOfAPIData() public view returns (uint256) {
        return apidata.length; 
    }

    function getAPIOverView(uint256 tokenId)
        public
        view
        returns (
            string memory,
            uint256
        )
    {
        return (
            apidata[tokenId].name,
            apidata[tokenId].listenrs
        );
    }

    
}
