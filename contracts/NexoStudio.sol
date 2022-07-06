// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NexoStudio is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 internal eventLength = 0;

    constructor() ERC721("NexoStudio", "NXST") {}

    uint256 owners = 0;

    struct EventStudio {
        string title;
        string image;
        string description;
        address payable owner;
        uint256 price;
        uint256 quantity;
    }

    struct Ticket {
        uint256 tokenId;
        uint256 eventIndex;
        address payable owner;
        uint256 quantity;
    }

    mapping(uint256 => EventStudio) private events;

    mapping(uint256 => Ticket) private tickets;

    // mint an NFt
    function safeMint(
        string memory uri,
        uint256 eventIndex,
        uint256 quantity
    ) public payable returns (uint256) {
        require(bytes(uri).length > 0, "Enter valid uri");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(msg.sender, tokenId);

        _setTokenURI(tokenId, uri);
        createTicket(tokenId, eventIndex, quantity);
        return tokenId;
    }

    //Create Ticket Functionality
    function createTicket(
        uint256 tokenId,
        uint256 eventIndex,
        uint256 quantity
    ) private {
        tickets[tokenId] = Ticket(
            tokenId,
            eventIndex,
            payable(msg.sender),
            quantity
        );
    }

    // create event
    function createEvent(
        string memory title,
        string memory image,
        string memory description,
        uint256 price,
        uint256 quantity
    ) public {
        events[eventLength] = EventStudio(
            title,
            image,
            description,
            payable(msg.sender),
            price,
            quantity
        );
        eventLength++;
    }
    
    // Transfer ticket
    
    function makeTransfer
    (address from, address to, uint256 tokenId)public{
        require(tokenId >= 0, "Enter valid token id");
        require(msg.sender == ownerOf(tokenId) || msg.sender == getApproved(tokenId), "Only the owner or an approved operator can perform this action");
        require(to != address(0), "Enter a valid address");
        _transfer(from, to, tokenId);
        tickets[tokenId].owner = payable(to);
    }


    //Buy NFT Ticket Functionality
    function buyTicket(
        string memory uri,
        uint256 eventIndex,
        uint256 quantity
    ) public payable {
        address owner = events[eventIndex].owner;
        uint256 currentQuantity = events[eventIndex].quantity;

        uint amount = msg.value;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Payment failed");

        uint256 remainQuantity = currentQuantity - quantity;
        events[eventIndex].quantity = remainQuantity;

        safeMint(uri, eventIndex, quantity);
    }

    function getTicket(uint256 tokenId) public view returns (Ticket memory) {
        return tickets[tokenId];
    }

    function getEvent(uint256 index) public view returns (EventStudio memory) {
        return events[index];
    }

    function getTicketLength() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getEventLength() public view returns (uint256) {
        return eventLength;
    }

    function getOwners() public view returns (uint256) {
        return owners;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
