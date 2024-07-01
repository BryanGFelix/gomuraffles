import styles from './raffleForm.module.css';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { useState } from 'react';
import {
    useConnectModal,
  } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import RaffleAbi from '@/abis/Raffle.json';
import { ethers } from "ethers";
import { useRouter} from "next/navigation"
import { logTransaction, monitorTransaction, updateTransactionStatus, waitForTransactionReceipt } from '@/utils/transactions';
import { getUUIDByte16 } from '@/utils/utils';

const CreateRaffleSchema = Yup.object().shape({
    ticketPrice: Yup.number()
      .max(999, 'This price is unreasonable!')
      .min(0, 'Price must be greater than 0')
      .required('Required'),
    numWinners: Yup.number()
        .min(1, 'There must be at least one winner')
        .required('Required'),
    duration: Yup.number()
        .min(1, 'Raffle duration must be at least one hour')
        .nonNullable()
        .required('Required'),
    maxTickets: Yup.number()
        .min(2, 'Must be greater than 1')
        .nullable(),
    maxEntries: Yup.number()
        .min(1, 'Must be greater than 0')
        .nullable(),
  });

interface formikValues {
    ticketPrice: number,
    numWinners: number,
    duration: number | null,
    maxEntries: number | null,
    maxTickets: number | null,
    allowDuplicates: boolean,
    showMaxEntries: boolean,
    showMaxTickets: boolean,
}

const initialValues : formikValues = {
    ticketPrice: 0,
    numWinners: 1,
    duration: null,
    maxEntries: null,
    maxTickets: null,
    allowDuplicates: false,
    showMaxEntries: false,
    showMaxTickets: false,
}

const RaffleForm = () => {
    const account = useAccount();
    const [isCreatingRaffle, setIsCreatingRaffle] = useState(false);
    const { openConnectModal } = useConnectModal();
    const { data, writeContractAsync } = useWriteContract();

    const router = useRouter();

    const getFutureDate = (hours: number) => {
        const currentDate = moment();  // This gets the current date and time
        const futureDate = currentDate.add(hours, 'hours');  // Adds the specified number of hours
    
        return futureDate.format('MM-DD-YYYY HH:mm');  // Formatting the date-time string
    }

    const handleSubmit = async (values: formikValues) => {
        if (!account.address) {
            if (openConnectModal) {
                openConnectModal();
            }
            return;
        }

        setIsCreatingRaffle(true);

        setTimeout(() => {
            setIsCreatingRaffle(false);                      
        }, 15000)

        const ticketPriceInWei = ethers.parseEther(values.ticketPrice.toString());
        let durationToSeconds = 0;
        if (values.duration) {
            durationToSeconds = 3600 * values.duration;
        }

        const maxEntries = values.maxEntries || 0;
        const maxTickets = values.maxTickets || 0;

        try {
            const uuid = getUUIDByte16();
            // Send the transaction
            const hash = await writeContractAsync({
                address: process.env.CONTRACT_ADDRESS as `0x${string}`,
                abi: RaffleAbi,
                functionName: 'createRaffle',
                args: [ 
                    uuid,
                    ticketPriceInWei,
                    maxEntries,
                    values.numWinners,
                    durationToSeconds,
                    maxTickets,
                    values.allowDuplicates 
                ],
            });

            await logTransaction(hash, 'create_raffle', account.address, uuid);
            
            const status = await waitForTransactionReceipt(hash, 2);
            if (status === 1) {
                window.addToast(
                    'Raffle Created!',
                    'success',
                    15000,
                    {
                      label: 'View',
                      onClick: () => {
                        router.push(`/raffle/${uuid}`);
                      },
                    }
                );
            } else {
                await updateTransactionStatus(hash, 'FAILED');
            }
            
        } catch (error) {
            console.error('Error handling raffle creation:', error);
        } finally {
            setIsCreatingRaffle(false);
        }
    };

    return (
        <div className={styles.raffleFormContainer}>
            <Formik
            initialValues={initialValues}
            validationSchema={CreateRaffleSchema}
            onSubmit={handleSubmit}
            >
            {({ errors, touched, values, isSubmitting, handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                    <div className={styles.raffleForm}>
                        <div className={styles.raffleSection}>
                            <h3 className={styles.raffleSectionHeader}>Ticket Price (ETH)</h3>
                            <Field name="ticketPrice" type="number" step="any" min='0' className={styles.raffleSectionInput}/>
                            {errors.ticketPrice && touched.ticketPrice && (
                                <div className={styles.error}>{errors.ticketPrice}</div>
                            )}
                        </div>
                        <div className={styles.raffleSection}>
                            <h3 className={styles.raffleSectionHeader}>Number of Winners</h3>
                            <Field name="numWinners" type="number" step="1" min='1' className={styles.raffleSectionInput}/>
                            {errors.numWinners && touched.numWinners && (
                                <div className={styles.error}>{errors.numWinners}</div>
                            )}
                        </div>
                        <div className={styles.raffleSection}>
                            <h3 className={styles.raffleSectionHeader}>Raffle Duration (hours)</h3>
                            <Field name="duration" type="number" step="any" min='1' className={styles.raffleSectionInput}/>
                            {values.duration && <p className={styles.raffleEnd}>Your raffle will end on {getFutureDate(values.duration)}</p>}
                            {errors.duration && touched.duration && (
                                <div className={styles.error}>{errors.duration}</div>
                            )}
                        </div>
                        <div className={styles.raffleSectionCheckbox}>
                            <Field name="allowDuplicates" type="checkbox"/>
                            <p className={styles.checkboxText}>Allow duplicate winners?</p>
                        </div>
                        <div className={styles.raffleSectionCheckbox}>
                            <Field name="showMaxTickets" type="checkbox" className={styles.checkbox}
                            onChange={(e: { target: { checked: any; }; }) => {
                                setFieldValue("maxTickets", null);
                                setFieldValue("showMaxTickets", e.target.checked);
                            }}/>
                            <p className={styles.checkboxText}>Limit total tickets? (not per user)</p>
                            
                        </div>
                        {values.showMaxTickets && 
                            (
                                <div className={styles.raffleSection}>
                                    <h3 className={styles.raffleSectionHeader}>Total Tickets</h3>
                                    <Field name="maxTickets" type="number" step="any" min='2' className={styles.raffleSectionInput}/>
                                    {errors.maxTickets && touched.maxTickets && (
                                        <div className={styles.error}>{errors.maxTickets}</div>
                                    )}
                                </div>
                            )
                        }
                        <div className={styles.raffleSectionCheckbox}>
                            <Field name="showMaxEntries" type="checkbox"
                            onChange={(e: { target: { checked: any; }; }) => {
                                setFieldValue("maxEntries", null);
                                setFieldValue("showMaxEntries", e.target.checked);
                            }}/>
                            <p className={styles.checkboxText}>Limit tickets per participant?</p>
                            
                        </div>
                        {values.showMaxEntries && 
                            (
                                <div className={styles.raffleSection}>
                                    <h3 className={styles.raffleSectionHeader}>Max Tickets Per Participant</h3>
                                    <Field name="maxEntries" type="number" step="any" min='1' className={styles.raffleSectionInput}/>
                                    {errors.maxEntries && touched.maxEntries && (
                                        <div className={styles.error}>{errors.maxEntries}</div>
                                    )}
                                </div>
                            )
                        }
                    </div>
                    <button type="submit" disabled={isCreatingRaffle} className={styles.button}>Create Raffle</button>
                </Form>
            )}
        </Formik>
     </div>
    );
}

export default RaffleForm;