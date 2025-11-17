const ethersLib = require('ethers');

const ethers = ethersLib.ethers ? ethersLib.ethers : ethersLib;
const isV6 = !!ethers.parseEther;

const Provider    = isV6 ? ethers.JsonRpcProvider : ethers.providers.JsonRpcProvider;
const toBigInt    = (n) => (isV6 ? n : BigInt(n?.toString?.() ?? String(n)));
const parseUnits  = (v, d) => (isV6 ? ethers.parseUnits(v, d) : ethers.utils.parseUnits(v, d));
const formatUnits = (v, d) => (isV6 ? ethers.formatUnits(v, d) : ethers.utils.formatUnits(v, d));
const formatEther = (v)    => (isV6 ? ethers.formatEther(v) : ethers.utils.formatEther(v));

const RPC_URL = 'https://rpc.hoodi.ethpandaops.io';

const ADDR = {
  DEPOSIT:  '0x9E2DDb3386D5dCe991A2595E8bc44756F864C6E3',
  WITHDRAW: '0x1D150609EE9EdcC6143506Ba55A4FAaeDd562Cd9',
  EXETH:    '0x4d38Bd670764c49Cce1E59EeaEBD05974760aCbD',
  ETH_ADDR: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
};

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

const DEPOSIT_ABI = [
  "function depositETH(uint256 nodeOperatorId) external payable"
];

const WITHDRAW_ABI = [
  "function withdraw(uint256 _amount, address _assetOut) external",
  "function claim(uint256 requestID, address requester) external"
];

const provider = new Provider(RPC_URL);

module.exports = {
  ethers,
  isV6,
  Provider,
  toBigInt,
  parseUnits,
  formatUnits,
  formatEther,
  RPC_URL,
  ADDR,
  ERC20_ABI,
  DEPOSIT_ABI,
  WITHDRAW_ABI,
  provider
};
