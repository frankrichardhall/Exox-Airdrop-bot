# Exox Airdrop bot
Exox Airdrop Bot is a CLI-based automation tool for interacting with the Exox / Hoodi liquid staking ecosystem. It helps you run repeatable strategies such as ETH deposits, exETH withdrawals, and claim operations across multiple wallets.

## Requirements
- Node.js
- Private keys for the wallets you intend to use (stored in `privateKeys.json`).

## Menu
```
=========================================
              EXOX AIRDROP BOT           
=========================================

[→] Fetching balances (ETH Hoodi & exETH) ...

--- WALLET OVERVIEW ---
#1 0x1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ETH (Hoodi): 0.000000
   exETH      : 0.000000

#2 0x2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ETH (Hoodi): 0.000000
   exETH      : 0.000000

--- MAIN MENU ---
1. Deposit (ETH → exETH)
2. Withdraw (exETH → ETH)
3. Claim pending withdrawals
4. Daily Run (auto cycle)
5. Exit

Choose option (1-5):
```

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/frankrichardhall/Exox-Airdrop-bot.git
   cd Exox-Airdrop-bot
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Create `privateKeys.json`**:
   Create a file named `privateKeys.json` in the root directory with the following format:

   ```json
   [
     "your_private_key_1",
     "your_private_key_2"
   ]
   ```

4. **Run the Bot**:

   ```bash
   npm start
   ```

## Usage

- Use `npm start` to check the menu options available.
- Choose the appropriate command based on the network you want to use.
- The bot will automatically execute the transactions, handling any errors and retrying as needed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 