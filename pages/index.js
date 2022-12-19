import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../Components/Header"
import LotteryEntrance from "../Components/LotteryEntrance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Hardhat Smart Lottery</title>
                <meta name="description" content="Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
