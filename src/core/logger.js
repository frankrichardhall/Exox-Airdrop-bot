const colors = require('./colors');

const logger = {
  info:    (msg) => console.log(`${colors.green}[✓] ${msg}${colors.reset}`),
  warn:    (msg) => console.log(`${colors.yellow}[⚠] ${msg}${colors.reset}`),
  error:   (msg) => console.log(`${colors.red}[✗] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}[✅] ${msg}${colors.reset}`),
  loading: (msg) => console.log(`${colors.cyan}[→] ${msg}${colors.reset}`),
  step:    (msg) => console.log(`${colors.white}[➤] ${msg}${colors.reset}`),
  banner:  () => {
    console.clear?.();
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`=========================================`);
    console.log(`              EXOX AIRDROP BOT           `);
    console.log(`=========================================${colors.reset}`);
    console.log();
  }
};

module.exports = logger;
