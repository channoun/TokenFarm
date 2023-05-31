import { makeStyles } from "@mui/styles";
import { useEthers } from "@usedapp/core";
import Button from "@mui/material/Button"

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        justifyContent: "flex-end",
    }
}))

export const Header = () => {
    const { account, activateBrowserWallet, deactivate } = useEthers();
    const isConnected = account !== undefined;
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {
                isConnected ?
                    (<Button variant="contained" onClick={deactivate}>Disconnect</Button >)
                    :
                    (<Button variant="contained" color="primary" onClick={() => { activateBrowserWallet() }}>Connect</Button>)
            }
        </div>
    )
}