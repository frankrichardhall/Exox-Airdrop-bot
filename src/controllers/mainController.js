const colors = require('../core/colors');
const logger = require('../core/logger');
const { delay, showCountdown } = require('../core/time');
const { loadWallets } = require('../models/walletModel');
const { showHeaderBalances } = require('../services/balanceService');
const { doDeposit, doWithdraw, doClaim } = require('../services/exoxService');
const { ask, pressEnter, showMainMenu, close } = require('../views/cliView');

async function handleDeposit(wallets) {
  const amountStr = await ask('Amount per tx (in ETH), e.g., 0.01: ');
  const timesStr = await ask('How many transactions per wallet?: ');
  const times = Math.max(1, parseInt(timesStr || '1', 10));
  const nodeOpId = 0;

  console.log();
  logger.info(`Deposit config: amount = ${amountStr} ETH, tx per wallet = ${times}`);
  console.log();

  for (const wallet of wallets) {
    console.log();
    logger.info(`--- Deposit for ${wallet.address} ---`);
    await doDeposit(wallet, amountStr, nodeOpId, times);
  }
  await pressEnter();
}

async function handleWithdraw(wallets) {
  const amountStr = await ask('Amount per tx (in exETH), e.g., 0.001: ');
  const timesStr = await ask('How many transactions per wallet?: ');
  const times = Math.max(1, parseInt(timesStr || '1', 10));

  console.log();
  logger.info(`Withdraw config: amount = ${amountStr} exETH, tx per wallet = ${times}`);
  console.log();

  for (const wallet of wallets) {
    console.log();
    logger.info(`--- Withdraw for ${wallet.address} ---`);
    await doWithdraw(wallet, amountStr, times);
  }
  await pressEnter();
}

async function handleClaim(wallets) {
  const attemptsStr = await ask('How many claims to attempt per wallet?: ');
  const attempts = Math.max(1, parseInt(attemptsStr || '1', 10));

  for (const wallet of wallets) {
    console.log();
    logger.info(`--- Claim for ${wallet.address} ---`);
    await doClaim(wallet, attempts);
  }
  await pressEnter();
}

async function handleDailyRun(wallets) {
  logger.info('--- Cycle Run Configuration ---');

  const depositAmount = await ask('Amount per deposit tx (in ETH), e.g., 0.01: ');
  const withdrawAmount = await ask('Amount per withdraw tx (in exETH), e.g., 0.001: ');
  const numCycles = Math.max(
    1,
    parseInt(
      (await ask('How many cycles to run (1 cycle = 1 deposit, 1 withdraw, 1 claim)?: ')) || '1',
      10
    )
  );

  const nodeOpId = 0;

  console.log();
  logger.success('Configuration saved! Starting run...\n');
  await delay(2000);

  for (let i = 1; i <= numCycles; i++) {
    logger.info(`${'-'.repeat(50)}`);
    logger.info(`Running Cycle ${i} of ${numCycles}`);
    logger.info(`${'-'.repeat(50)}\n`);

    try {
      logger.step(`Cycle ${i}/${numCycles}: Step 1 - Deposits`);
      for (const wallet of wallets) {
        console.log();
        logger.info(`--- Deposit for ${wallet.address} ---`);
        await doDeposit(wallet, depositAmount, nodeOpId, 1);
      }
      logger.success('All deposits for this cycle completed!\n');
      await delay(2000);

      logger.step(`Cycle ${i}/${numCycles}: Step 2 - Withdrawals`);
      for (const wallet of wallets) {
        console.log();
        logger.info(`--- Withdraw for ${wallet.address} ---`);
        await doWithdraw(wallet, withdrawAmount, 1);
      }
      logger.success('All withdrawals for this cycle submitted!\n');

      logger.info('Waiting 1 minute for withdrawal unlock...');
      await showCountdown(60);

      logger.step(`Cycle ${i}/${numCycles}: Step 3 - Claims`);
      for (const wallet of wallets) {
        console.log();
        logger.info(`--- Claim for ${wallet.address} ---`);
        await doClaim(wallet, 1);
      }

      logger.success(`Cycle ${i} of ${numCycles} completed!\n`);

      if (i < numCycles) {
        logger.info('Waiting 5 seconds before starting next cycle...');
        await showCountdown(5);
      }
    } catch (e) {
      logger.error(
        `Error during cycle ${i}: ${
          e?.reason || e?.shortMessage || e?.message || String(e)
        }`
      );
      logger.warn('Skipping to the next cycle (if any) in 10 seconds...\n');
      await showCountdown(10);
    }
  }

  logger.success('All cycles completed!\n');
  await pressEnter();
}

async function mainMenuLoop(wallets) {
  while (true) {
    await showHeaderBalances(wallets);

    showMainMenu();
    const choice = await ask('Choose option (1-5): ');

    if (choice === '5') {
      close();
      process.exit(0);
    }

    try {
      if (choice === '1') {
        await handleDeposit(wallets);
      } else if (choice === '2') {
        await handleWithdraw(wallets);
      } else if (choice === '3') {
        await handleClaim(wallets);
      } else if (choice === '4') {
        await handleDailyRun(wallets);
      } else {
        logger.error('Invalid option.');
        await pressEnter();
      }
    } catch (e) {
      logger.error(e?.reason || e?.shortMessage || e?.message || String(e));
      await pressEnter();
    }

    console.clear?.();
    logger.banner();
  }
}

function start() {
  logger.banner();

  const wallets = loadWallets();
  console.log(
    `${colors.green}[✓] Found ${wallets.length} wallet(s) in privateKeys.json${colors.reset}\n`
  );

  mainMenuLoop(wallets).catch((e) => {
    logger.error(e?.message || String(e));
    close();
    process.exit(1);
  });
}

module.exports = {
  start
};
