import { useWaitForTransactionReceipt } from "wagmi";
import axiosInstance from "./axios";
import { provider } from "./contract";

export const logTransaction = async (hash: `0x${string}`, type: string, address: string, raffleID : string | null, amount: string | null = '0') => {
    return await axiosInstance.post('/sendTransaction', {
        hash,
        type,
        address,
        raffleID: raffleID,
        status: 'pending',
        amount,
    }).then((response) => {
        return response.data;
    }).catch((error) => {
        throw error;
    });
};

export const monitorTransaction = async (hash: `0x${string}`) => {
    const { data: receipt, isError } = await useWaitForTransactionReceipt({
        hash: hash,
        confirmations: 1,
    });

    if (isError) {
        console.error('Transaction failed:', receipt);
        return { status: 'FAILED', receipt };
    } else {
        console.log('Transaction confirmed:', receipt);
        return { status: 'CONFIRMED', receipt };
    }
};

export const waitForTransactionReceipt = async (hash: string, confirmations = 2) => {
    try {
        const receipt = await provider.waitForTransaction(hash, confirmations);
        return receipt?.status;
    } catch (error) {
        console.error('Error waiting for transaction receipt:', error);
        throw error;
    }
};



export const updateTransactionStatus = async (hash: `0x${string}`, status: string) => {
    try {
        const response = await axiosInstance.put('/updateTransaction', {
            hash,
            status,
            updatedAt: new Date(),
        });
        return response.data;
    } catch (error) {
        console.error('Error updating transaction status:', error);
        throw error; // Re-throw error to handle it in calling function
    }
};

