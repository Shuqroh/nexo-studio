import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { ethers } from "ethers";

// initialize IPFS
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const uploadEvent = async (
  minterContract,
  performActions,
  { title, quantity, price, description, ipfsImage }
) => {
  await performActions(async (kit) => {
    const { defaultAccount } = kit;

    try {
      let transaction = await minterContract.methods
        .createEvent(title, ipfsImage, description, price, quantity)
        .send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

// mint an NFT
export const addTicket = async (
  minterContract,
  performActions,
  { eventImage, eventIndex, quantity, price }
) => {
  await performActions(async (kit) => {
    const { defaultAccount } = kit;

    // convert NFT metadata to JSON format
    const data = JSON.stringify({
      price,
      quantity,
      eventIndex,
      image: eventImage,
      owner: defaultAccount,
    });

    try {
      // save NFT metadata to IPFS
      const added = await client.add(data);

      // IPFS url for uploaded metadata
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const _price = ethers.utils.parseUnits(String(price * quantity), "ether");

      // mint the NFT and save the IPFS url to the blockchain
      let transaction = await minterContract.methods
        .buyTicket(url, eventIndex, quantity)
        .send({ from: defaultAccount, value: _price });

      return transaction;
    } catch (error) {
      console.log("Error uploading ticket: ", error);
    }
  });
};

// function to upload a file to IPFS
export const uploadToIpfs = async (file) => {
  if (!file) return;
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

// fetch all NFTs on the smart contract
export const getEvents = async (minterContract) => {
  try {
    const events = [];
    const eventLength = await minterContract.methods.getEventLength().call();
    for (let i = 0; i < Number(eventLength); i++) {
      const event = new Promise(async (resolve) => {
        const data = await minterContract.methods.getEvent(i).call();
        resolve({
          index: i,
          ...data,
        });
      });
      events.push(event);
    }
    return Promise.all(events);
  } catch (e) {
    console.log({ e });
  }
};

export const getTickets = async (minterContract) => {
  try {
    const tickets = [];
    const ticketLength = await minterContract.methods.getTicketLength().call();
    for (let i = 0; i < Number(ticketLength); i++) {
      const ticket = new Promise(async (resolve) => {
        const data = await minterContract.methods.getTicket(i).call();
        const res = await minterContract.methods.tokenURI(i).call();
        const meta = await fetchNftMeta(res);
        const owner = await fetchNftOwner(minterContract, i);
        resolve({
          index: i,
          tokenId: i,
          owner,
          eventIndex: data.eventIndex,
          quantity: data.quantity,
          image: meta.data.image,
        });
      });
      tickets.push(ticket);
    }
    return Promise.all(tickets);
  } catch (e) {
    console.log({ e });
  }
};

// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl) => {
  try {
    if (!ipfsUrl) return null;
    const meta = await axios.get(ipfsUrl);
    return meta;
  } catch (e) {
    console.log({ e });
  }
};

// get the owner address of an NFT
export const fetchNftOwner = async (minterContract, index) => {
  try {
    return await minterContract.methods.ownerOf(index).call();
  } catch (e) {
    console.log({ e });
  }
};

// get the address that deployed the NFT contract
export const fetchNftContractOwner = async (minterContract) => {
  try {
    let owner = await minterContract.methods.owner().call();
    return owner;
  } catch (e) {
    console.log({ e });
  }
};

export const getOwners = async (minterContract) => {
  try {
    const ownerCount = await minterContract.methods.getOwners().call();
    return ownerCount;
  } catch (error) {
    console.log({ error });
  }
};
