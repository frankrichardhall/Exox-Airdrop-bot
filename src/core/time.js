const colors = require('./colors');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatCountdown(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function showCountdown(totalSeconds) {
  let remaining = totalSeconds;

  while (remaining > 0) {
    process.stdout.write(
      `\r${colors.cyan}[⏱] Next run in: ${formatCountdown(remaining)}${colors.reset}`
    );
    await delay(1000);
    remaining--;
  }

  process.stdout.write('\n');
}

module.exports = {
  delay,
  formatCountdown,
  showCountdown
};
