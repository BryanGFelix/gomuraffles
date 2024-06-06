import React from 'react';
import Image from "next/image";
import styles from './nav.module.css';
import Link from 'next/link'
import Button from '../Button/Button';
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Nav = () => {
    return (
        <div className={styles.navContainer}>
            <Link href='/'>
                <Image
                    src="/logo.png"
                    width={80}
                    height={80}
                    alt="Picture of the author"
                />
            </Link>
            <div className={styles.actionContainer}>
                <Link href='/' className={styles.link}>
                    Create Raffle
                </Link>
                <Link href='/myraffles' className={styles.link}>
                    My Raffles
                </Link>
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                        return (
                            <div
                                {...(!ready && {
                                'aria-hidden': true,
                                'style': {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                        <Button onClick={openConnectModal} className='buttonNav'>
                                            Connect Wallet
                                        </Button>
                                        );
                                    }

                                    if (chain.unsupported) {
                                        return (
                                        <Button onClick={openChainModal} className='buttonNav'>
                                            Wrong network
                                        </Button>
                                        );
                                    }

                                    return (
                                        <div className={styles.buttonContainer}>
                                            <Button onClick={openAccountModal} className='buttonNav'>
                                                {account.displayName}
                                                {account.displayBalance
                                                ? ` (${account.displayBalance})`
                                                : ''}
                                            </Button>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </div>
        </div>
    )
}

export default Nav;