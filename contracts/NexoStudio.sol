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
    Counters.Counter private eventLength;
    Counters.Counter private owners;

    constructor() ERC721("NexoStudio", "NXST") {}

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
    mapping(uint256 => bool) private eventExists;

    mapping(uint256 => Ticket) private tickets;

    event Bought(uint256 eventId, address user, uint256 ticketId);
    event EventCreated(uint256 eventId, address owner);
    event TransferTicket(uint256 ticketId, uint256 eventId, address to);

    modifier canMint(
        string memory uri,
        uint256 eventIndex,
        uint256 quantity
    ) {
        require(bytes(uri).length > 0, "Enter valid uri");
        require(
            quantity <= events[eventIndex].quantity,
            "Number of tickets available is less than requested amount"
        );
        _;
    }

    modifier eventExist(uint256 eventId) {
        require(eventExists[eventId], "Query of non existent event");
        _;
    }

    // mint an NFt
    function safeMint(
        string memory uri,
        uint256 eventIndex,
        uint256 quantity
    )
        internal
        eventExist(eventIndex)
        canMint(uri, eventIndex, quantity)
        returns (uint256)
    {
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
    ) private eventExist(eventIndex) {
        require(_exists(tokenId));
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
        require(bytes(title).length > 0, "Invalid title");
        require(bytes(image).length > 0, "Invalid image");
        require(bytes(description).length > 0, "Invalid description");
        require(price > 0, "Invalid price");
        require(quantity > 0, "Invalid quantity");
        uint256 id = eventLength.current();
        eventLength.increment();
        events[id] = EventStudio(
            title,
            image,
            description,
            payable(msg.sender),
            price,
            quantity
        );
        owners.increment();
        eventExists[id] = true;
        emit EventCreated(id, msg.sender);
    }

    function addTickets(uint256 eventIndex, uint256 amount)
        public
        eventExist(eventIndex)
    {
        require(
            events[eventIndex].owner == msg.sender,
            "Only the owner can do that"
        );
        events[eventIndex].quantity += amount;
    }

    // Transfer ticket
    function makeTransfer(
        address from,
        address to,
        uint256 tokenId
    ) public {
        require(tokenId >= 0 && _exists(tokenId), "Enter valid token id");
        require(
            msg.sender == ownerOf(tokenId) ||
                msg.sender == getApproved(tokenId),
            "Only the owner or an approved operator can perform this action"
        );
        require(to != address(0), "Enter a valid address");
        _transfer(from, to, tokenId);
        tickets[tokenId].owner = payable(to);
        emit TransferTicket(tokenId, tickets[tokenId].eventIndex, to);
    }

    //Buy NFT Ticket Functionality
    function buyTicket(
        string memory uri,
        uint256 eventIndex,
        uint256 quantity
    ) public payable canMint(uri, eventIndex, quantity) eventExist(eventIndex) {
        EventStudio storage currentEvent = events[eventIndex];
        uint256 amount = getTicketPrice(eventIndex, quantity);
        require(
            currentEvent.owner != msg.sender,
            "You can't buy tickets from your own event"
        );
        require(amount == msg.value, "Insufficient funds to buy tickets");
        (bool success, ) = currentEvent.owner.call{value: amount}("");
        require(success, "Payment failed");
        currentEvent.quantity -= quantity;
        safeMint(uri, eventIndex, quantity);
    }

    function getTicket(uint256 tokenId) public view returns (Ticket memory) {
        require(_exists(tokenId));
        return tickets[tokenId];
    }

    function getTicketPrice(uint256 eventId, uint256 quantity)
        public
        view
        eventExist(eventId)
        returns (uint256)
    {
        return events[eventId].price * quantity;
    }

    function getEvent(uint256 index)
        public
        view
        eventExist(index)
        returns (EventStudio memory)
    {
        return events[index];
    }

    function getTicketLength() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getEventLength() public view returns (uint256) {
        return eventLength.current();
    }

    function getOwners() public view returns (uint256) {
        return owners.current();
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
