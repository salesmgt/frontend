import React from 'react'
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider,
    withStyles,
    Typography,
    IconButton,
} from '@material-ui/core'
import classes from './ConfirmRemove.module.scss'
import { MdClose } from 'react-icons/md';

const stylesTitle = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitleWithIconClose = withStyles(stylesTitle)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <DialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <MdClose />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
});

function ConfirmRemove(props) {
    const { open, onClose, data } = props

    const handleRemove = () => {
        // Gọi API xóa
        console.log('Remove nha');

        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitleWithIconClose onClose={onClose}>Confirm Remove</DialogTitleWithIconClose>
            {/* <Divider /> */}
            <DialogContent>
                <DialogContentText className={classes.dialogText}>
                    <p>
                        Do you really want to remove
                        <strong><em> {data.level} {data.schoolName} </em></strong>
                        from list of target schools in <strong>{data.schoolYear}</strong>?
                    </p>
                    <p>This process cannot be undone.</p>
                </DialogContentText>
            </DialogContent>
            {/* <Divider /> */}
            <DialogActions>
                <Button variant="contained" className={classes.btnRemove} onClick={handleRemove} autoFocus>
                    Remove
                </Button>
                <Button variant="contained" onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(ConfirmRemove)