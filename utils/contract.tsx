import { ethers } from 'ethers';
import RaffleAbi from '../abis/Raffle.json';

export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as `0x${string}`;
export const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_PROVIDER_SEPOLIA);
export const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as `0x${string}`, provider);
export const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS as `0x${string}`, RaffleAbi, wallet);