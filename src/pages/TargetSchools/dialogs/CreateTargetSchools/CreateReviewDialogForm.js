import React, { useState, useRef } from 'react'
import {
    Button,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    ListItemText,
    TableHead,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TableBody,
    makeStyles,
    Paper,
    IconButton,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@material-ui/core'
import { MdClose } from 'react-icons/md'
import { previewColumns } from './CreateTargetSchoolsConfig'
import { Consts, schoolYearSubTitle } from '../DialogConfig'
import { statusNames, purposeNames, milkNames } from '../../../../constants/Generals'
import * as Milk from '../../../../utils/Milk'
import { useAuth } from '../../../../hooks/AuthContext'
import { useApp } from '../../../../hooks/AppContext'
import { useTargetForm } from './TargetFormContext'
import { getPurpsByStatus } from '../../../../utils/Sortings'
import { createTargetSchools } from '../../TargetSchoolsServices'
import classes from './CreateReviewDialogForm.module.scss'

//===============Set max-height for dropdown list===============
const ITEM_HEIGHT = 38
const ITEM_PADDING_TOP = 5
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
        },
    },
}
const useStyles = makeStyles((theme) => ({
    formControl: {
        marginTop: '0.5rem',
        minWidth: 180,
    },
    option: {
        fontSize: '0.875rem',
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
        width: 260,
        marginLeft: '0.5rem'
    },
    itemPIC: {
        padding: 0,
        margin: 0,
    },
    divItemPIC: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0,
        margin: 0,
    },
    itemTextPrimary: {
        fontSize: '0.875rem',
    },
    itemTextSecondary: {
        fontSize: '0.8rem',
    },
}))

function CreateReviewDialogForm(props) {
    const styles = useStyles()
    const { onClose, schoolStatus, refreshAPI } = props
    const [rowsState, setRowsState] = React.useState(props.rows)
    const { fields, operations } = Consts
    const [object, setObject] = React.useState(null)
    const [purpose, setPurpose] = useState(null)

    const { salesPurps } = useApp()
    const { params, dispatchParams, setFilter } = useTargetForm()
    const { page, limit, column, direction, searchKey, listFilters } = params

    // 1 năm học sẽ kéo dài từ tháng 5 năm nay tới tháng 5 năm sau
    const calculateSchoolYear = () => {
        const thisYear = new Date().getFullYear()
        const thisMonth = new Date().getMonth()

        if (0 <= thisMonth < 4) {   // Jan = 0, May = 4
            return `${thisYear}-${thisYear + 1}`
        } else if (4 <= thisMonth < 11) {
            return `${thisYear - 1}-${thisYear}`
        } else {
            return null
        }
    }
    const schoolYear = calculateSchoolYear()
    
    const bakSalesPurps = salesPurps ? salesPurps : Milk.getMilk(milkNames.salesPurps)
    const purpsByStatus = getPurpsByStatus(schoolStatus, bakSalesPurps)

    const handleSubmit = () => {
        let array = []
        rowsState.map((item) => {
            item = { ...item, purpose: purpose,schoolYear: schoolYear, schoolId: item.id }
            array.push(item)
        })
        createTargetSchools(array).then(res => {
            // console.log('Created. res = ', res);
            setRowsState([]);
            refreshAPI(schoolYear, page, limit, column, direction, searchKey, listFilters)
            onClose()
        })

        // console.log(array)
        // assignMulti(array).then((res) => {
        //     props.setNotify({
        //         isOpen: true,
        //         message: 'Assigned successfully',
        //         type: 'success',
        //     })
        //     props.setRows([])
        //     refreshAPI(page, limit, column, direction, searchKey, listFilters)

        //     onClose()
        // })
    }

    const handleOnRemove = (e, row) => {
        let newSelected = []
        const selectedIndex = rowsState.indexOf(row)
        if (selectedIndex === 0) {
            newSelected = newSelected.concat(rowsState.slice(1))
        } else if (selectedIndex === rowsState.length - 1) {
            newSelected = newSelected.concat(rowsState.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                rowsState.slice(0, selectedIndex),
                rowsState.slice(selectedIndex + 1)
            )
        }
        setRowsState(newSelected)
        if (newSelected.length === 0) {
            onClose()
        }
    }

    const handlePurposeChange = (event) => {
        setPurpose(event.target.value)
    }

    const setStatusChipColor = (status) => {
        switch (status) {
            case statusNames.lead:
                return <Chip label={status} className={classes.chipLead} />
            case statusNames.customer:
                return <Chip label={status} className={classes.chipCustomer} />
            default:
                break
                // return <Chip label={status} />
        }
    }

    const setPurposeChipColor = (purpose) => {
        switch (purpose) {
            case purposeNames.purp1:
                return <Chip label={purpose} className={classes.chipSalesMoi} />
            case purposeNames.purp2:
                return <Chip label={purpose} className={classes.chipTheoDoi} />
            case purposeNames.purp3:
                return <Chip label={purpose} className={classes.chipTiemNang} />
            case purposeNames.purp4:
                return <Chip label={purpose} className={classes.chipChamSoc} />
            case purposeNames.purp5:
                return <Chip label={purpose} className={classes.chipTaiKy} />
            case purposeNames.purp6:
                return <Chip label={purpose} className={classes.chipKyMoi} />
            default:
                break
                // return <Chip label={purpose} /> // #5c21f3
        }
    }
   
    //     const object = rowsState.findIndex((obj) => obj.id === row?.id)
    //     //const item ={...rowsState[object],note: e.target.value}
    //     let array = [null]
    //     array = [...rowsState]
    //     array[object] = {
    //         ...array[object],
    //         note: e.target.value ? e.target.value : null,
    //         noteBy: e.target.value ? user.username : null,
    //     }
    //     console.log(array)
    //     setRowsState(array)
    // }
    
    return (
        <>
            <DialogContent className={classes.wrapper}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box display="flex" flexDirection="row" flexWrap="nowrap">
                            <Box flexGrow={1}>
                                <FormControl className={styles.formControl}>
                                    <InputLabel>{fields.purpose.label}</InputLabel>
                                    <Select
                                        value={purpose || ''}
                                        onChange={handlePurposeChange}
                                        MenuProps={MenuProps}
                                    >
                                        <MenuItem
                                            value=""
                                            className={styles.option}
                                            classes={{
                                                root: styles.menuItemRoot,
                                                selected: styles.menuItemSelected,
                                            }}
                                        >
                                            {fields.purpose.options.none}
                                        </MenuItem>
                                        {purpsByStatus?.map((purp) => (
                                            <MenuItem
                                                key={purp}
                                                value={purp}
                                                className={styles.option}
                                                classes={{
                                                    root: styles.menuItemRoot,
                                                    selected:
                                                        styles.menuItemSelected,
                                                }}
                                            >
                                                {purp}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" className={classes.title}>
                                    {schoolYearSubTitle(schoolYear)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="subtitle1">
                            List of assigned schools:
                        </Typography>
                        <TableContainer className={classes.container} component={Paper}>
                            <Table className={classes.table} stickyHeader size="small">
                                <TableHead>
                                    <TableRow className={classes.tHead}>
                                        {previewColumns.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                className={classes.tHeadCell}
                                                align={col.align}
                                                width={col.width}
                                            >
                                                {col.name}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody className={classes.tBody}>
                                    {rowsState?.map((row, index) => (
                                        <TableRow key={row?.id}>
                                            <TableCell className={classes.tBodyCell}>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className={classes.tBodyCell}>
                                                <ListItemText
                                                    primary={`${row?.educationalLevel} ${row?.name}`}
                                                    secondary={row?.district}
                                                    classes={{
                                                        primary:
                                                            classes.itemTextPrimary,
                                                        secondary:
                                                            classes.itemTextSecondary,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tBodyCell}>
                                                {setStatusChipColor(row?.status)}
                                            </TableCell>
                                            <TableCell className={classes.tBodyCell}>
                                                {setPurposeChipColor(purpose)}
                                            </TableCell>
                                            <TableCell className={classes.tBodyCell}>
                                                <IconButton
                                                    onClick={(e) => handleOnRemove(e, row)}
                                                >
                                                    <MdClose />
                                                </IconButton>
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
                <Button
                    type="submit"
                    onClick={handleSubmit}
                     disabled={!purpose}
                    className={classes.btnSave}
                >
                    {operations.save}
                </Button>
                <Button onClick={onClose}>{operations.cancel}</Button>
            </DialogActions>
        </>
    )
}

export default CreateReviewDialogForm