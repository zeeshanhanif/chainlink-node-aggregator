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
        string channelId;
        string endpoint;
    }

    APIData[] public apidata;

    mapping(bytes32 => address) requestToSender;
    mapping(bytes32 => uint256) requestToTokenId;
    mapping(bytes32 => string) requestToChannelId;
    mapping(bytes32 => string) requestToEndpoint;

    uint256 public totalListeners;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    event RequestListenerFulfilled(bytes32 indexed _requestId, uint256 indexed _listeners);
    event ListenerRequestInitiated(bytes32 indexed _requestId);

    constructor()
        ERC721("DynamicNFT", "DYNFT")
    {   
        setPublicChainlinkToken();
        // From Example
        //oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8; // kovan
        //jobId = " "; // kovan
        // our Node and Adapter
        oracle = 0xcE4452C43390842bE32B45964945276A78985E88; // kovan
        jobId = stringToBytes32("a90ac9049d3b4f5abcb315ff1a3a367a"); // kovan
        fee = 1 * 10 ** 18; // (Varies by network and job)
    }

    function requestNFTGeneration(string memory _channelId, string memory _endpoint) public returns (bytes32 requestId)  {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        //request.add("get", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        //request.add("path", "USD");
        //request.addInt("times", 100);
        
        request.add("id", _channelId);
        request.add("endpoint", _endpoint);

        // Sends the request
        requestId = sendChainlinkRequestTo(oracle, request, fee);
        emit ListenerRequestInitiated(requestId);
        requestToSender[requestId] = msg.sender;
        requestToChannelId[requestId] = _channelId;
        requestToEndpoint[requestId] = _endpoint;
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

    function fulfill(bytes32 _requestId, uint256 _listeners) public recordChainlinkFulfillment(_requestId)
    {
        totalListeners = _listeners;
        uint256 newId = apidata.length;
        apidata.push(APIData(_listeners,"Youtube",requestToChannelId[_requestId],requestToEndpoint[_requestId]));
        _safeMint(requestToSender[_requestId], newId);
        emit RequestListenerFulfilled(_requestId,totalListeners);
    }

    function getNumberOfAPIData() public view returns (uint256) {
        return apidata.length; 
    }

    function getAPIOverView(uint256 tokenId)
        public
        view
        returns (
            string memory,
            uint256,
            string memory,
            string memory
        )
    {
        return (
            apidata[tokenId].name,
            apidata[tokenId].listenrs,
            apidata[tokenId].channelId,
            apidata[tokenId].endpoint
        );
    }

    function getAPIOverViewStruct(uint256 tokenId)
        public
        view
        returns (APIData memory)
    {
        return apidata[tokenId];
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
    
}
