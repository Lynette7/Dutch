import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";


export default function Home() {
    const router = useRouter();
    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const { address, isConnected } = useAccount();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
        }
    }, [address, isConnected]);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="h1">
                <h2 className={styles.title}>Split Expenses, Preserve Friendships!</h2>
                <h3>Going Dutch the Socially Acceptable Way.</h3>
            </div>
            
            <button
                className={styles.ctaButton}
                onClick={() => router.push("/dash")}
            >
            Create Expense
            </button>
            
            {isConnected ? (
                <div className="h2">
                    Your address: {userAddress}
                </div>
            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}
