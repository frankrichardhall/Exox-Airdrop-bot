const readline = require('readline');
const colors = require('../core/colors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) =>
  new Promise((resolve) => rl.question(q, (ans) => resolve(ans.trim())));

const pressEnter = () => ask('\nPress Enter to return to the main menu...');

function showMainMenu() {
  console.log(`${colors.white}--- MAIN MENU ---${colors.reset}`);
  console.log(`${colors.cyan}1${colors.reset}. Deposit (ETH → exETH)`);
  console.log(`${colors.cyan}2${colors.reset}. Withdraw (exETH → ETH)`);
  console.log(`${colors.cyan}3${colors.reset}. Claim pending withdrawals`);
  console.log(`${colors.cyan}4${colors.reset}. Daily Run (auto cycle)`);
  console.log(`${colors.cyan}5${colors.reset}. Exit`);
  console.log();
}

function close() {
  rl.close();
}

module.exports = {
  ask,
  pressEnter,
  showMainMenu,
  close
};
