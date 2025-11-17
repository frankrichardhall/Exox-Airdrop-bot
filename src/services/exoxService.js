const {
  ethers,
  ADDR,
  DEPOSIT_ABI,
  WITHDRAW_ABI,
  ERC20_ABI,
  parseUnits,
  formatEther,
  toBigInt,
  isV6
} = require('../config');
const logger = require('../core/logger');

async function ensureAllowance(tokenCtr, ownerAddr, spender, amount) {
  const current = await tokenCtr.allowance(ownerAddr, spender);
  if (toBigInt(current) >= toBigInt(amount)) return false;

  logger.step(`Approving allowance to ${spender} ...`);
  const tx = await tokenCtr.approve(spender, amount);
  const rc = await tx.wait();
  logger.success(`Approve confirmed. tx: ${isV6 ? rc.hash : tx.hash || rc.transactionHash}`);
  return true;
}

async function doDeposit(wallet, amountEth, nodeOperatorId, times) {
  const provider = wallet.provider;
  const signer = wallet.connect(provider);
  const dep = new ethers.Contract(ADDR.DEPOSIT, DEPOSIT_ABI, signer);

  const amountWei = parseUnits(amountEth, 18);

  for (let i = 1; i <= times; i++) {
    logger.step(`Deposit ${i}/${times} for ${wallet.address} ...`);

    const balEth = await provider.getBalance(wallet.address);
    if (toBigInt(balEth) < toBigInt(amountWei)) {
      logger.error(`Insufficient ETH. Needed ${amountEth}, have ${formatEther(balEth)}`);
      continue;
    }

    logger.loading(`Calling depositETH(${nodeOperatorId}) with ${amountEth} ETH ...`);
    const txDep = await dep.depositETH(nodeOperatorId, { value: amountWei });
    const rcDep = await txDep.wait();
    logger.success(`Deposit confirmed. tx: ${isV6 ? rcDep.hash : txDep.hash || rcDep.transactionHash}`);
  }
}

async function doWithdraw(wallet, amountExEth, times) {
  const provider = wallet.provider;
  const signer = wallet.connect(provider);
  const ex = new ethers.Contract(ADDR.EXETH, ERC20_ABI, signer);
  const wdr = new ethers.Contract(ADDR.WITHDRAW, WITHDRAW_ABI, signer);

  const exDec = await ex.decimals().catch(() => 18);
  const amountWei = parseUnits(amountExEth, exDec);

  for (let i = 1; i <= times; i++) {
    logger.step(`Withdraw ${i}/${times} for ${wallet.address} ...`);

    await ensureAllowance(ex, wallet.address, ADDR.WITHDRAW, amountWei);

    logger.loading(`Calling withdraw(${amountExEth} exETH, ETH) ...`);
    const txW = await wdr.withdraw(amountWei, ADDR.ETH_ADDR);
    const rcW = await txW.wait();
    logger.success(`Withdraw submitted. tx: ${isV6 ? rcW.hash : txW.hash || rcW.transactionHash}`);
    logger.info('Typical unlock to claim is ~25 minutes after withdraw.');
  }
}

async function doClaim(wallet, attempts) {
  const provider = wallet.provider;
  const signer = wallet.connect(provider);
  const wdr = new ethers.Contract(ADDR.WITHDRAW, WITHDRAW_ABI, signer);

  logger.info('Proceeding claims');
  const count = Math.max(1, parseInt(attempts || 1, 10));

  for (let idx = 0; idx < count; idx++) {
    logger.step(`Claiming index ${idx} for ${wallet.address} ...`);
    try {
      const tx = await wdr.claim(idx, wallet.address);
      const rc = await tx.wait();
      logger.success(`Claimed index ${idx}. tx: ${isV6 ? rc.hash : tx.hash || rc.transactionHash}`);
    } catch (e) {
      const msg = e?.reason || e?.shortMessage || e?.message || String(e);
      logger.warn(`Claim index ${idx} failed: ${msg}`);
    }
  }
}

module.exports = {
  doDeposit,
  doWithdraw,
  doClaim
};
