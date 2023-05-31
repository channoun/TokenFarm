import { Slider, Button, CircularProgress, Snackbar, Alert } from "@mui/material"
import { Token } from "../Main"
import { useEffect, useState } from "react"
import { useStake } from "../../hooks/useStake"
import { utils } from "ethers"
import { useNotifications } from "@usedapp/core"

interface StakeFormProps {
    stakedToken: Token,
    balance: number
}

export const StakeForm = ({ stakedToken, balance }: StakeFormProps) => {
    const { address } = stakedToken

    const [value, setValue] = useState<number>(0)
    const { approve, state } = useStake(address)
    const isMining = state.status === "Mining"
    const { notifications } = useNotifications()
    const handleClick = () => {
        const amountToWei = utils.parseEther(value.toString())
        approve(amountToWei.toString())
    }
    const [showApprovalSuccess, setShowApprovalSuccess] = useState(false)
    const [showStakeSuccess, setShowStakeSuccess] = useState(false)
    const handleClose = () => {
        setShowApprovalSuccess(false)
        setShowStakeSuccess(false)
    }
    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" && notification.transactionName === "Approve ERC20 token transfer"
        ).length > 0
        ) {
            setShowApprovalSuccess(true)
            setShowStakeSuccess(false)
        }
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" && notification.transactionName === "Stake ERC20 token"
        ).length > 0
        ) {
            setShowApprovalSuccess(false)
            setShowStakeSuccess(true)
        }
    }, [notifications, showApprovalSuccess, showStakeSuccess])
    return (
        <>
            <div>
                <Slider aria-label="Tokens to stake" max={balance} valueLabelDisplay="auto" step={balance / 100} onChange={(e, newValue) => { setValue(newValue as number) }}></Slider>
                <Button variant="contained" color="primary" onClick={handleClick} disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : "Stake"}
                </Button>
            </div>
            <Snackbar
                open={showApprovalSuccess}
                autoHideDuration={2500}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success">
                    ERC-20 token transfer approved. Now approve the 2nd transaction.
                </Alert>
            </Snackbar>
            <Snackbar
                open={showStakeSuccess}
                autoHideDuration={2500}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success">
                    Tokens Staked!
                </Alert>
            </Snackbar>

        </>
    )
}