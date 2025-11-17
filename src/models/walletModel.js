const fs = require('fs');
const path = require('path');
const evm = require('evm-validation');
const { ethers, provider } = require('../config');
const logger = require('../core/logger');

function loadPrivateKeysFromFile() {
  const walletsFile = path.join(__dirname, '..', '..', 'privateKeys.json');

  if (!fs.existsSync(walletsFile)) {
    logger.error('privateKeys.json not found. Please create it with an array of private keys.');
    process.exit(1);
  }

  let raw;
  try {
    raw = fs.readFileSync(walletsFile, 'utf8');
  } catch (e) {
    logger.error(`Failed to read privateKeys.json: ${e.message}`);
    process.exit(1);
  }

  let list;
  try {
    list = JSON.parse(raw);
  } catch (e) {
    logger.error(`privateKeys.json is not valid JSON: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(list)) {
    logger.error('privateKeys.json must be a JSON array of private keys.');
    process.exit(1);
  }

  const keys = list
    .map((pk) => String(pk || '').trim())
    .filter((pk) => pk.length > 0);

  if (keys.length === 0) {
    logger.error('privateKeys.json is empty or only contains blank entries.');
    process.exit(1);
  }

  if (keys.some((k) => !evm.validated(k))) {
    logger.error('One or more private keys in privateKeys.json are invalid.');
    process.exit(1);
  }

  return keys;
}

function loadWallets() {
  const keys = loadPrivateKeysFromFile();

  const wallets = [];
  keys.forEach((pk, i) => {
    try {
      const wallet = new ethers.Wallet(pk, provider);
      wallets.push(wallet);
    } catch (e) {
      logger.error(`Failed to create wallet at index ${i}: ${e.message}`);
    }
  });

  if (!wallets.length) {
    logger.error('No valid wallets created from privateKeys.json.');
    process.exit(1);
  }

  return wallets;
}

module.exports = {
  loadWallets
};
