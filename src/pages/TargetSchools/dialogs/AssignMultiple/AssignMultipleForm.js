import React, { useState } from 'react'
import {
    Button,
    TextField,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    InputAdornment,
    ListItem,
    Avatar,
    ListItemText,
    ListItemAvatar,
    TableHead,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TableBody,
    makeStyles,
    Paper,
    Fade
} from '@material-ui/core'
import { MdAccountCircle, MdClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconButton from '@material-ui/core/IconButton';
import { Autocomplete } from '@material-ui/lab'
import { useTargetSchool } from '../../hooks/TargetSchoolContext'
import { Consts, columns } from '../FormConfig'
import Popover from '@material-ui/core/Popover';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { BiEdit } from "react-icons/bi";
import CardContent from '@material-ui/core/CardContent';
import classes from './AssignMultiple.module.scss'

const clientSchema = yup.object().shape({
    // title: yup.string().trim().max(30).required(),
    // remark: yup.string().trim().max(50).required(),
    PIC: yup.string().required(),
})

//===============Set max-height for dropdown list===============
const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 5;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
        }
    }
};

const useStyles = makeStyles((theme) => ({
    formControl: {
        // margin: theme.spacing(1),
        marginTop: '0.8rem',
        minWidth: 160,
        // maxWidth: 180
    },
    option: {
        fontSize: '0.875rem'
    },
    lastOption: {
        fontSize: '0.875rem',
        borderBottom: '0.5px solid #e0e0e0'
    },
    root: {},
    menuItemRoot: {
        '&$menuItemSelected': { backgroundColor: 'rgba(0, 0, 0, 0.08)' },
        '&$menuItemSelected:focus': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
        },
        '&$menuItemSelected:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04);',
        },
    },
    menuItemSelected: {},
    autoComplete: {
        width: 250,
        marginLeft: '0.5rem'
    },
    itemPIC: {
        padding: 0,
        margin: 0
    },
    itemTextPrimary: {
        fontSize: '0.875rem',
    },
    itemTextSecondary: {
        fontSize: '0.8rem',
    },
}));

function AssignMultipleForm(props) {
    const styles = useStyles();
    const { onClose, rows } = props
    const [rowsState,setRowsState] = React.useState(rows)
    const { operations } = Consts
    const [object,setObject] = React.useState(null)
    const { register, handleSubmit, errors } = useForm({  // getValues, , setError
        resolver: yupResolver(clientSchema),
    })

    const { PICs } = useTargetSchool()

    const [PIC, setPIC] = useState(null)
    // Hiện tại chỉ lưu đc purpose của 1 trường
    // Tức là mỗi lần chọn nó sẽ đè gtri mới lên nhau. Sau này update lên là 1 [] các purpose hoặc
    // cứ để 1 obj cũng đc nhưng cần ghi lại cái trường này vao đâu đó luôn để gửi cho API còn Assign.

    const onSubmit = (data) => {
        console.log(data)
        onClose()
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event,row) => {
      setAnchorEl(event.currentTarget);
      setObject(row)
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handlePICChange = (event, newPIC) => {
        setPIC(newPIC);
    };
    const open = Boolean(anchorEl);
    
    const handleOnRemove = (e,row)=>{
        let newSelected = []
        const selectedIndex = rowsState.indexOf(row)
        if (selectedIndex === 0) {
            newSelected = newSelected.concat(rowsState.slice(1))
        } else if (selectedIndex ===rowsState.length - 1) {
            newSelected = newSelected.concat(rowsState.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                rowsState.slice(0, selectedIndex),
                rowsState.slice(selectedIndex + 1)
            )
        }
        console.log("mảng ",newSelected)
        setRowsState(newSelected)
    }
    const onBlur = (e,row) =>{
        // console.log(rowsState)
        // console.log(row)
       const object = rowsState.findIndex(obj =>obj.id === row.id)
        //const item ={...rowsState[object],note: e.target.value}
        let array =[null]
        array =[...rowsState]
        console.log("indedx ",rowsState[object])
        array[object] =  {...array[object],note: e.target.value ? e.target.value : null}
        console.log("text ",e.target.value)
        console.log(array)
        setRowsState(array)
    } 
    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <DialogContent className={classes.wrapper}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Grid container>
                            <Grid item xs={12} sm={7} md={6} lg={5}>
                                <Autocomplete
                                    autoComplete
                                    autoSelect
                                    autoHighlight
                                    clearOnEscape
                                    options={PICs ? PICs : []}
                                    getOptionLabel={(pic) =>
                                        pic.fullName ? pic.fullName : ''
                                    }
                                    value={PIC}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="PICs"
                                            name="PIC"
                                            inputRef={register}
                                            error={!!errors.PIC}
                                            helperText={errors?.PIC?.message}
                                            margin="normal"
                                            placeholder="PIC will be assigned"
                                            // ref={params.InputProps.ref}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <MdAccountCircle />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    }
                                    renderOption={(option) => {
                                        return (
                                            <ListItem className={classes.itemPIC} key={option.username}>
                                                <ListItemAvatar>
                                                    <Avatar src={option.avatar} />
                                                </ListItemAvatar>
                                                <ListItemText primary={option.fullName} classes={{ primary: classes.itemTextPrimary }} />
                                            </ListItem>
                                        );
                                    }}
                                    className={styles.autoComplete}
                                    onChange={(event, newPIC) => handlePICChange(event, newPIC)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant='subtitle1'>List of assigned schools:</Typography>
                        <TableContainer className={classes.container} component={Paper}>
                            <Table className={classes.table} stickyHeader size="small">
                                <TableHead>
                                    <TableRow className={classes.tHead}>
                                        {columns.map(col => (
                                            <TableCell
                                                key={col}
                                                className={classes.tHeadCell}
                                                align={col === 'no' ? 'center' : 'left'}
                                            >
                                                {col}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody className={classes.tBody}>
                                    {rowsState.map((row, index) => (
                                        <TableRow key={row.id}  >
                                            <TableCell align="center" width='5%'>{index + 1}</TableCell>
                                            <TableCell width='30%' className={classes.tBodyCell}>
                                                <ListItemText
                                                    primary={row.schoolName}
                                                    secondary={row.district}
                                                    classes={{
                                                        primary: classes.itemTextPrimary,
                                                        secondary: classes.itemTextSecondary
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center" width='30%' className={classes.tBodyCell}>
                                                {PIC ? (
                                                    <ListItem className={classes.itemPIC}>
                                                        <ListItemAvatar><Avatar src={PIC.avatar} /></ListItemAvatar>
                                                        <ListItemText
                                                            primary={PIC.fullName}
                                                            secondary={PIC.username}
                                                            classes={{
                                                                primary: classes.itemTextPrimary,
                                                                secondary: classes.itemTextSecondary
                                                            }}
                                                        />
                                                    </ListItem>
                                                ) : ''}
                                            </TableCell>
                                            <TableCell align='center' width='40%' className={classes.tBodyCell}>
                                              <IconButton onClick={(e)=>handleClick(e,row)} >
                                                <Badge invisible={!row.note} color="secondary" variant="dot"><BiEdit/></Badge>
                                              </IconButton>
                                               <Popover
                                                open={open}
                                                onClose={handleClose}
                                                anchorEl={anchorEl}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                >
                                               
                                                <TextField 
                                                    onBlur={(e)=>onBlur(e,object)}
                                                    onChange={e => setObject({...object,note:e.target.value})}  
                                                    value={object?.note && object?.note  } 
                                                    multiline
                                                    autoFocus
                                                    rows={4}
                                                   placeholder='Type note here'
                                                    variant="outlined"
                                                />
                                                    </Popover>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={e=>handleOnRemove(e,row)} ><MdClose/></IconButton>
                                            </TableCell>
                                        </TableRow>
                                        
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="">
                <Button type="submit" onClick={handleSubmit(onSubmit)} className={classes.btnSave}>
                    {operations.save}
                </Button>
                <Button onClick={onClose}>
                    {operations.cancel}
                </Button>
            </DialogActions>
        </form>
    )
}

export default AssignMultipleForm