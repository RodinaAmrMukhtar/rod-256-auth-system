const {
  generateId,
  getLedger: storageGetLedger,
  insertLedgerBlock
} = require("../utils/storage");

const { rod256Hash } = require("../utils/rod256Runner");

const ZERO_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

async function createLedgerBlock(username, eventType, status, ipAddress) {
  const ledger = await storageGetLedger();

  const previousBlock = ledger.length > 0 ? ledger[ledger.length - 1] : null;
  const previousHash = previousBlock ? previousBlock.currentHash : ZERO_HASH;

  const block = {
    id: generateId("block"),
    index: ledger.length,
    username,
    eventType,
    status,
    ipAddress,
    timestamp: new Date().toISOString(),
    previousHash,
    currentHash: ""
  };

  const blockData = JSON.stringify({
    index: block.index,
    username: block.username,
    eventType: block.eventType,
    status: block.status,
    ipAddress: block.ipAddress,
    timestamp: block.timestamp,
    previousHash: block.previousHash
  });

  block.currentHash = rod256Hash(blockData, previousHash);

  await insertLedgerBlock(block);

  return block;
}

async function getLedger() {
  return await storageGetLedger();
}

async function verifyLedger() {
  const ledger = await storageGetLedger();

  for (let i = 0; i < ledger.length; i++) {
    const block = ledger[i];

    const expectedPreviousHash =
      i === 0 ? ZERO_HASH : ledger[i - 1].currentHash;

    if (block.previousHash !== expectedPreviousHash) {
      return {
        valid: false,
        brokenAtIndex: i,
        reason: "Previous hash does not match"
      };
    }

    const blockData = JSON.stringify({
      index: block.index,
      username: block.username,
      eventType: block.eventType,
      status: block.status,
      ipAddress: block.ipAddress,
      timestamp: block.timestamp,
      previousHash: block.previousHash
    });

    const recalculatedHash = rod256Hash(blockData, block.previousHash);

    if (block.currentHash !== recalculatedHash) {
      return {
        valid: false,
        brokenAtIndex: i,
        reason: "Current hash was changed or block data was modified"
      };
    }
  }

  return {
    valid: true,
    blocks: ledger.length
  };
}

module.exports = {
  createLedgerBlock,
  getLedger,
  verifyLedger
};
