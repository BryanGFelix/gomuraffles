import styles from './raffleForm.module.css';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { useState } from 'react';
import {
    useConnectModal,
  } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract } from 'wagmi';
import RaffleAbi from '../../abis/Raffle.json';
import { ethers } from "ethers";
import { contract } from '@/utils/contract';
import { useRouter} from "next/navigation"
import axiosInstance from "@/utils/axios";

const CreateRaffleSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, 'Title must be at least 2 characters')
      .max(30, 'Title must be less than 30 characters')
      .required('Required'),
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

const RaffleForm = () => {
    const account = useAccount();
    const [isCreatingRaffle, setIsCreatingRaffle] = useState(false);
    const { openConnectModal } = useConnectModal();
    const { data: hash, writeContractAsync } = useWriteContract()

    const router = useRouter();

    const getFutureDate = (hours: number) => {
        const currentDate = moment();  // This gets the current date and time
        const futureDate = currentDate.add(hours, 'hours');  // Adds the specified number of hours
    
        return futureDate.format('MM-DD-YYYY HH:mm');  // Formatting the date-time string
    }
    

    return (
        <div className={styles.raffleFormContainer}>
            <Formik
            initialValues={{
                title: '',
                description: '',
                ticketPrice: 0,
                numWinners: 1,
                duration: null,
                maxEntries: null,
                maxTickets: null,
                allowDuplicates: false,
                showMaxEntries: false,
                showMaxTickets: false,
            }}
            validationSchema={CreateRaffleSchema}
            onSubmit={(values, actions) => {
                if (!account.address) {
                    if(openConnectModal) {
                        openConnectModal();
                    }  
                } else {
                    try {
                        setIsCreatingRaffle(true);
                        // same shape as initial values
                        const ticketPriceInWei = ethers.parseEther(values.ticketPrice.toString());
                        let durationToSeconds = 0;
                        if (values.duration) {
                            durationToSeconds = 3600 * values.duration;
                        }
        
                        const maxEntries = values.maxEntries ? BigInt(values.maxEntries) : 0;
                        const maxTickets = values.maxTickets ? BigInt(values.maxTickets) : 0;

                        writeContractAsync({
                            address: process.env.CONTRACT_ADDRESS as `0x${string}`,
                            abi: RaffleAbi,
                            functionName: 'createRaffle',
                            args: [ ticketPriceInWei, maxEntries, values.numWinners, durationToSeconds, maxTickets, values.allowDuplicates ],
                        }).catch(() => {
                            setIsCreatingRaffle(false);
                        })

                        contract.on("RaffleCreated", (id, owner, ticketPrice, allowDuplicates, maxTickets, maxEntries, numWinners, isActive, duration, timeStarted) => {
                            axiosInstance.post('/createRaffle', {
                                raffleID: Number(id),
                                owner,
                                ticketPrice: ticketPrice.toString(),
                                allowDuplicates,
                                maxTickets: Number(maxTickets),
                                maxEntries: Number(maxEntries),
                                numWinners: Number(numWinners),
                                isActive,
                                duration: Number(duration),
                                timeStarted: Number(timeStarted),
                                title: values.title,
                                description: values.description,
                            }).then(() => {
                                setIsCreatingRaffle(false);
                                router.push(`/raffle/${id}`);
                            }).finally(() => {
                                setIsCreatingRaffle(false);
                                contract.removeAllListeners('RaffleCreated');
                            });;
                        });

                        setTimeout(() => {
                            setIsCreatingRaffle(false);                      
                        }, 15000)
                    } catch {
                        setIsCreatingRaffle(false);
                    }
                }
            }}
            >
            {({ errors, touched, values, isSubmitting, handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                    <div className={styles.raffleForm}>
                        <div className={styles.raffleSection}>
                            <h3 className={styles.raffleSectionHeader}>Raffle Title</h3>
                            <Field name="title" type="string" className={styles.raffleSectionInput}/>
                            {errors.title && touched.title && (
                                <div className={styles.error}>{errors.title}</div>
                            )}
                        </div>
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