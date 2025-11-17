const { ethers, ADDR, ERC20_ABI, formatEther, formatUnits } = require('../config');
const colors = require('../core/colors');
const logger = require('../core/logger');

async function showHeaderBalances(wallets) {
  logger.loading('Fetching balances (ETH Hoodi & exETH) ...');

  const provider = wallets[0].provider;
  const exToken = new ethers.Contract(ADDR.EXETH, ERC20_ABI, provider);

  const exDec = await exToken.decimals().catch(() => 18);
  const exSym = await exToken.symbol().catch(() => 'exETH');

  console.log();
  console.log(`${colors.white}--- WALLET OVERVIEW ---${colors.reset}`);

  const labelEth = 'ETH (Hoodi)';
  const labelEx = exSym;
  const labelWidth = Math.max(labelEth.length, labelEx.length);
  const padLabel = (s) => s.padEnd(labelWidth, ' ');

  let idx = 1;
  for (const w of wallets) {
    const [ethBal, exBal] = await Promise.all([
      provider.getBalance(w.address),
      exToken.balanceOf(w.address)
    ]);

    const ethStr = Number(formatEther(ethBal)).toFixed(6);
    const exStr = Number(formatUnits(exBal, exDec)).toFixed(6);

    console.log(`${colors.cyan}#${idx}${colors.reset} ${colors.bold}${w.address}${colors.reset}`);
    console.log(`   ${padLabel(labelEth)}: ${ethStr}`);
    console.log(`   ${padLabel(labelEx)}: ${exStr}`);
    console.log();
    idx++;
  }
}

module.exports = {
  showHeaderBalances
};
