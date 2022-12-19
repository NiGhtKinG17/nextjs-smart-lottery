import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState(0)
    const {
        runContractFunction: enterLottery,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const dispatch = useNotification()

    async function updateUi() {
        const fee = await getEntranceFee()
        const players = (await getNumberOfPlayers()).toString()
        const recWinner = await getRecentWinner()
        setEntranceFee(fee.toString())
        setNumPlayers(players)
        setRecentWinner(recWinner)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "🔔",
        })
    }

    return (
        <div className="p-5">
            {lotteryAddress ? (
                <div>
                    Lottery Entrance
                    <br />
                    Entrance Fee:{" "}
                    {ethers.utils.formatUnits(entranceFee, "ether")} eth <br />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4 "
                        onClick={async function () {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (e) => console.log(e),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        Enter Lottery
                    </button>
                    <br />
                    <div>Number of players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Lottery Detected</div>
            )}
        </div>
    )
}
