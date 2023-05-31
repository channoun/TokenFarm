import { useEthers, useNotifications } from "@usedapp/core";
import { WalletBalanceProps } from "../Wallet/WalletBalance";
import { useFarmBalance } from "../../hooks/useFarmBalance";
import { formatUnits } from "ethers/lib/utils";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { useUnstake } from "../../hooks/useUnstake";
import { useEffect, useState } from "react";

export const FarmBalance = ({ selectedToken }: WalletBalanceProps) => {
    const { account } = useEthers()
    const { name, address } = selectedToken
    const isConnected = account !== undefined && account !== null
    const { value, error } = useFarmBalance(address) ?? {}
    const balance = value?.[0]
    const parsedBalance = balance !== undefined ? parseFloat(formatUnits(balance, 18)) : 0
    const { state, send } = useUnstake()
    const isMining = state.status === "Mining"
    const { notifications } = useNotifications()
    const handleClick = () => {
        send(address)
    }
    const [showSuccess, setShowSuccess] = useState(false)
    const handleClose = () => {
        setShowSuccess(false)
    }
    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" && notification.transactionName === "Unstake Token Balance"
        ).length > 0
        ) {
            setShowSuccess(true)
        }
    }, [notifications, showSuccess])

    return (
        <>
            {isConnected ? (
                <>
                    <h2>
                        {`You have ${parsedBalance} ${name} staked.`}
                    </h2>
                    <Button color="primary" onClick={handleClick} disabled={isMining}>
                        {isMining ? <CircularProgress size={26} /> : "Unstake tokens"}
                    </Button>
                    <Snackbar
                        open={showSuccess}
                        autoHideDuration={2500}
                        onClose={handleClose}
                    >
                        <Alert onClose={handleClose} severity="success">
                            Tokens Unstaked!
                        </Alert>
                    </Snackbar>
                </>
            ) : (
                <h2>
                    Nothing to show
                </h2>
            )}
        </>
    )
}