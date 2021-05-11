import React, { useEffect, useRef, useState } from 'react'
import {
    Button,
    TextField,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    Typography,
    ListItemText,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Box,
} from '@material-ui/core'
import { MdAdd, MdDelete } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Autocomplete } from '@material-ui/lab'
import { parseDateToString } from '../../../../utils/DateTimes'
import * as ReportsServices from '../../ReportsServices'
import { useHistory } from 'react-router'
import * as ArrayUtils from '../../../../utils/Arrays'
import {} from '../../../../utils/DateTimes'
import { useAuth } from '../../../../hooks/AuthContext'
import {
    Consts,
    columns,
    RESULT,
    DESCRIPTION,
    POSITIVITY,
    DIFFICULTY,
    FUTURE_PLAN,
} from '../DialogConfig'
import { useReport } from '../../hooks/ReportContext'
import classes from './CreateReports.module.scss'

const clientSchema = yup.object().shape({
    // username: yup.string().trim().min(8).max(30).required(),
    // fullName: yup.string().trim().max(50).required(),
})

function CreateReportsForm(props) {
    const { onClose, refreshAPI, setNotify } = props
    const { headers, operations, fields } = Consts

    const { user } = useAuth()
    const history = useHistory()

    const { params } = useReport()
    const { listFilters, page, limit, column, direction, searchKey } = params

    const typingTimeoutRef = useRef({})

    const { register, errors } = useForm({
        // getValues, , setError, control, handleSubmit, formState
        resolver: yupResolver(clientSchema),
    })

    // const onSubmit = (data) => {
    //     console.log(data)
    // }

    const defaultTarget = {
        avatar: '',
        district: '',
        fullName: '',
        id: -1,
        level: '',
        note: '',
        noteBy: '',
        purpose: '',
        reprEmail: '',
        reprIsMale: false,
        reprName: '',
        reprPhone: '',
        schoolAddress: '',
        schoolId: -1,
        schoolName: '',
        schoolScale: '',
        schoolStatus: '',
        schoolType: '',
        schoolYear: '',
        userEmail: '',
        userPhone: '',
        username: '',
    }
    const defaultFormValue = {
        result: '',
        description: '',
        positivity: '',
        difficulty: '',
        futurePlan: '',
    }
    const [target, setTarget] = useState(defaultTarget)
    const [targets, setTargets] = useState([])
    const [formValue, setFormValue] = useState(defaultFormValue)

    const getListTargets = (searchKey) => {
        ReportsServices.getTargetSchools({
            username: user.username,
            schoolYear: calculateSchoolYear(),
            key: searchKey,
        })
            .then((data) => {
                setTargets(data)
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error)
                    history.push({
                        pathname: '/errors',
                        state: { error: error.response.status },
                    })
                }
            })
    }
    useEffect(() => {
        getListTargets()
        // return () => setTargets([])
    }, [])

    const onSearchTargetChange = (event) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            const searchKey = event.target.value
            // console.log('searchKey = ', searchKey)
            if (searchKey) {
                // setTarget(searchKey);
                getListTargets(searchKey)
            } else {
                getListTargets()
            }
        }, 300)
    }

    // console.log('initial value for target: ', target);

    const handleTargetChange = (event, newTarget) => {
        // console.log('handleTargetChange - event: ', event);
        if (newTarget) {
            // console.log('ko null');
            setTarget(newTarget)
        } else {
            // console.log('null roi');
            setTarget(defaultTarget)
        }
        // console.log('newTarget: ', newTarget)
    }

    const [listReports, setListReports] = useState([])

    // const listReportsData = () => {
    //     console.log('listReportsData - form value: ', formValue);
    //     console.log('listReportsData - target: ', target);

    //     const report = {
    //         username: user.username,
    //         date: parseDateToString(new Date(), 'YYYY-MM-DD'),
    //         schoolYear: calculateSchoolYear(),
    //         targetId: parseInt(target.id),
    //         schoolName: target.schoolName,
    //         level: target.level,
    //         result: formValue.result,
    //         description: formValue.description,
    //         positivity: formValue.positivity,
    //         difficulty: formValue.difficulty,
    //         futurePlan: formValue.futurePlan,
    //     }

    //     listReports.forEach(re => {
    //         if (re.targetId === report.targetId) {
    //             removeReport(re.targetId)
    //         }
    //     });
    //     setListReports([...listReports, report])
    //     resetForm()
    // }

    const addReports = (event) => {
        event.preventDefault()
        // const e = event.target;

        // const report = {
        //     username: user.username,
        //     date: parseDateToString(new Date(), 'YYYY-MM-DD'),
        //     schoolYear: calculateSchoolYear(),
        //     targetId: parseInt(e.targetId.value),
        //     schoolName: e.targetName.value,
        //     level: e.level.value,
        //     result: e.result.value,
        //     description: e.description.value,
        //     positivity: e.positivity.value,
        //     difficulty: e.difficulty.value,
        //     futurePlan: e.futurePlan.value,
        // }

        const report = {
            username: user.username,
            date: parseDateToString(new Date(), 'YYYY-MM-DD'),
            schoolYear: calculateSchoolYear(),
            targetId: parseInt(target.id),
            schoolName: target.schoolName,
            level: target.level,
            result: formValue.result,
            description: formValue.description,
            positivity: formValue.positivity,
            difficulty: formValue.difficulty,
            futurePlan: formValue.futurePlan,
        }

        listReports.forEach((re) => {
            if (re.targetId === report.targetId) {
                // Remove target cũ, ghi đè bằng target đó bản chỉnh sửa
                // console.log('Remove duplicate target ', re.targetId)
                // setListReports([
                //     ...ArrayUtils.removeItem(listReports, 'targetId', re.targetId),
                // ])
                removeReport(re.targetId) // tại sao phải viết lại 3 dòng code trên trong khi có thể gọi lại hàm này?
                // setListReports([...listReports, report])
            }
        })
        setListReports([...listReports, report]) // Để ngoài này vì có trùng hay ko thì cũng vẫn add vô list
        resetForm()

        // listReportsData()
    }

    const removeReport = (targetId) => {
        setListReports([
            ...ArrayUtils.removeItem(listReports, 'targetId', targetId),
        ])
        resetForm()
        // console.log('Remove target ', targetId)
    }

    const resetForm = () => {
        setTarget(defaultTarget)
        setFormValue(defaultFormValue)
    }

    const handleFormChange = (event, key) => {
        const value = event.target.value

        switch (key) {
            case RESULT:
                setFormValue({
                    ...formValue,
                    result: value,
                })
                break
            case DESCRIPTION:
                setFormValue({
                    ...formValue,
                    description: value,
                })
                break
            case POSITIVITY:
                setFormValue({
                    ...formValue,
                    positivity: value,
                })
                break
            case DIFFICULTY:
                setFormValue({
                    ...formValue,
                    difficulty: value,
                })
                break
            case FUTURE_PLAN:
                setFormValue({
                    ...formValue,
                    futurePlan: value,
                })
                break
            default:
                break
        }
    }

    // console.log('form value: ', formValue);

    // Click on a row in the preview table --> data is displayed in form
    const handleShowClickedRow = (event, row) => {
        const foundTarget = searchTargetSchoolById(row.targetId)
        setTarget(foundTarget)

        setFormValue({
            result: row.result,
            description: row.description,
            positivity: row.positivity,
            difficulty: row.difficulty,
            futurePlan: row.futurePlan,
        })

        // console.log('foundTarget: ', foundTarget);
        // console.log('Data of row: ', row);
    }

    const searchTargetSchoolById = (id) => {
        let foundTarget = { ...defaultTarget }

        targets.forEach((aTarget) => {
            if (aTarget.id === id) {
                foundTarget = { ...aTarget }
            }
        })

        return foundTarget
    }

    const handleCreateReport = (event) => {
        // Add to list
        // listReportsData()
        // console.log('handleCreateReport - listReports: ', listReports);
        let reports = []
        if (listReports.length === 0) {
            const report = {
                username: user.username,
                date: parseDateToString(new Date(), 'YYYY-MM-DD'),
                schoolYear: calculateSchoolYear(),
                targetId: parseInt(target.id),
                schoolName: target.schoolName,
                level: target.level,
                result: formValue.result,
                description: formValue.description,
                positivity: formValue.positivity,
                difficulty: formValue.difficulty,
                futurePlan: formValue.futurePlan,
            }
            reports.push(report)
        } else {
            reports = [...listReports]
        }

        ReportsServices.addReport(reports)
            .then((data) => {
                // console.log('data: ', data);

                if (
                    !String(data).includes('already submitted') &&
                    !String(data).includes('Created 0 records')
                ) {
                    setNotify({
                        isOpen: true,
                        message: 'Created successfully.',
                        type: 'success',
                    })
                } else if (String(data).includes('already submitted')) {
                    setNotify({
                        isOpen: true,
                        message: `Created unsuccessfully. ${data} today.`,
                        type: 'error',
                    })
                } else {
                    setNotify({
                        isOpen: true,
                        message: 'Created unsuccessfully.',
                        type: 'error',
                    })
                }
                refreshAPI(
                    page,
                    limit,
                    column,
                    direction,
                    searchKey,
                    listFilters
                )

                handleCloseDialog()
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error)
                    history.push({
                        pathname: '/errors',
                        state: { error: error.response.status },
                    })
                }
                setNotify({
                    isOpen: true,
                    message: 'Created unsuccessfully.',
                    type: 'error',
                })
                handleCloseDialog()
            })
    }

    const calculateSchoolYear = () => {
        const thisYear = new Date().getFullYear()
        const thisMonth = new Date().getMonth()
        console.log(`${thisMonth}/${thisYear}`)
        // console.log(`This school year: ${thisYear - 1}-${thisYear}`);

        // Từ tháng 5 năm nay tới tháng 5 năm sau: đi sales cho các targets theo năm học sau
        // nên report cũng tính là năm học sau.
        if (0 <= thisMonth < 4) {
            // Jan = 0, May = 4
            return `${thisYear}-${thisYear + 1}`
        } else if (4 <= thisMonth < 11) {
            return `${thisYear - 1}-${thisYear}`
        } else {
            return null
        }
    }

    const truncateString = (str) => {
        if (str) return str.length > 30 ? str.substring(0, 27) + '...' : str
        else return ''
    }

    const handleCloseDialog = () => {
        setListReports([])
        onClose()
    }

    // console.log('formvalue: ', formValue);

    return (
        <>
            <form onSubmit={addReports}>
                <DialogContent className={classes.wrapper}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={12} lg={5}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Autocomplete
                                        autoComplete
                                        autoSelect
                                        autoHighlight
                                        clearOnEscape
                                        options={targets ? targets : []}
                                        // getOptionLabel={(target) => target.schoolName}
                                        getOptionLabel={(target) =>
                                            target?.schoolName
                                                ? `${target?.level} ${target?.schoolName}`
                                                : ''
                                        }
                                        value={target || defaultTarget}
                                        // value={target || {}}
                                        renderInput={(params) => (
                                            <>
                                                <TextField
                                                    {...params}
                                                    label={
                                                        fields.schoolName.label
                                                    }
                                                    variant="outlined"
                                                    name={
                                                        fields.schoolName.name
                                                    }
                                                    // value={target}
                                                    required
                                                    inputRef={register}
                                                    error={!!errors.target}
                                                    helperText={
                                                        errors?.target?.message
                                                    }
                                                    className={
                                                        classes.autoComplete
                                                    }
                                                    onChange={
                                                        onSearchTargetChange
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={fields.level.name}
                                                    value={target?.level}
                                                />
                                            </>
                                        )}
                                        renderOption={(target) => {
                                            return (
                                                <div className={classes.item}>
                                                    <ListItemText
                                                        primary={
                                                            target?.schoolName
                                                                ? `${target?.level} ${target?.schoolName}`
                                                                : ''
                                                        }
                                                        secondary={
                                                            target?.district
                                                                ? target?.district
                                                                : ''
                                                        }
                                                        classes={{
                                                            primary:
                                                                classes.itemTextPrimary,
                                                            secondary:
                                                                classes.itemTextSecondary,
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                        onChange={(event, newTarget) =>
                                            handleTargetChange(event, newTarget)
                                        }
                                    />
                                    <input
                                        type="hidden"
                                        name={fields.id.name}
                                        value={target?.id}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField
                                        label={fields.result.label}
                                        name={fields.result.name}
                                        className=""
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={formValue.result || ''}
                                        onChange={(e, key) =>
                                            handleFormChange(e, RESULT)
                                        }
                                        inputRef={register}
                                        error={!!errors.result}
                                        helperText={errors?.result?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField
                                        label={fields.description.label}
                                        name={fields.description.name}
                                        className=""
                                        variant="outlined"
                                        type="text"
                                        required
                                        multiline
                                        rows={3}
                                        fullWidth
                                        value={formValue.description || ''}
                                        onChange={(e, key) =>
                                            handleFormChange(e, DESCRIPTION)
                                        }
                                        inputRef={register}
                                        error={!!errors.description}
                                        helperText={
                                            errors?.description?.message
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField
                                        label={fields.positivity.label}
                                        name={fields.positivity.name}
                                        variant="outlined"
                                        fullWidth
                                        value={formValue.positivity || ''}
                                        onChange={(e, key) =>
                                            handleFormChange(e, POSITIVITY)
                                        }
                                        // inputRef={register}
                                        // error={!!errors.positivity}
                                        // helperText={errors?.positivity?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField
                                        label={fields.difficulty.label}
                                        name={fields.difficulty.name}
                                        variant="outlined"
                                        fullWidth
                                        value={formValue.difficulty || ''}
                                        onChange={(e, key) =>
                                            handleFormChange(e, DIFFICULTY)
                                        }
                                        // inputRef={register}
                                        // error={!!errors.difficulty}
                                        // helperText={errors?.difficulty?.message}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <TextField
                                        label={fields.futurePlan.label}
                                        name={fields.futurePlan.name}
                                        variant="outlined"
                                        fullWidth
                                        value={formValue.futurePlan || ''}
                                        onChange={(e, key) =>
                                            handleFormChange(e, FUTURE_PLAN)
                                        }
                                        // inputRef={register}
                                        // error={!!errors.futurePlan}
                                        // helperText={errors?.futurePlan?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        flexWrap="nowrap"
                                    >
                                        <Box flexGrow={1}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                type="submit"
                                                disabled={
                                                    formValue ===
                                                    defaultFormValue
                                                }
                                                // onClick={addReports}
                                            >
                                                <MdAdd fontSize="large" />
                                            </Button>
                                        </Box>
                                        <Box>
                                            {/* <Chip
                                                label={parseDateToString(
                                                    new Date(),
                                                    'dddd, DD/MM/YYYY'
                                                )}
                                                variant="outlined"
                                                className={classes.chipDate}
                                            /> */}
                                            <Typography
                                                variant="subtitle1"
                                                className={classes.title}
                                            >
                                                {parseDateToString(
                                                    new Date(),
                                                    'dddd, DD/MM/YYYY'
                                                )}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* <Box
                                        display="flex"
                                        justifyContent="flex-end"
                                    >
                                        <Typography variant="subtitle1">
                                            {`${
                                                headers.child1
                                            } ${parseDateToString(
                                                new Date(),
                                                'dddd, DD/MM/YYYY'
                                            )}`}
                                        </Typography>
                                    </Box> */}
                                    <Typography variant="subtitle1">
                                        {headers.child1}
                                    </Typography>
                                    <TableContainer
                                        className={classes.container}
                                        component="div"
                                    >
                                        <Table
                                            className={classes.table}
                                            stickyHeader
                                            size="small"
                                        >
                                            <TableHead>
                                                <TableRow
                                                    className={classes.tHead}
                                                >
                                                    {columns.map((col) => (
                                                        <TableCell
                                                            key={col}
                                                            className={
                                                                classes.tHeadCell
                                                            }
                                                        >
                                                            {col}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {listReports.map(
                                                    (row, index) => (
                                                        <TableRow
                                                            key={row.targetId}
                                                            className={
                                                                classes.tBodyRow
                                                            }
                                                        >
                                                            <TableCell
                                                                className={
                                                                    classes.tBodyCell
                                                                }
                                                                onClick={(
                                                                    e,
                                                                    data
                                                                ) =>
                                                                    handleShowClickedRow(
                                                                        e,
                                                                        row
                                                                    )
                                                                }
                                                            >
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell
                                                                className={
                                                                    classes.tBodyCell
                                                                }
                                                                onClick={(
                                                                    e,
                                                                    data
                                                                ) =>
                                                                    handleShowClickedRow(
                                                                        e,
                                                                        row
                                                                    )
                                                                }
                                                            >
                                                                {`${row.level} ${row.schoolName}`}
                                                            </TableCell>
                                                            <TableCell
                                                                className={
                                                                    classes.tBodyCell
                                                                }
                                                                onClick={(
                                                                    e,
                                                                    data
                                                                ) =>
                                                                    handleShowClickedRow(
                                                                        e,
                                                                        row
                                                                    )
                                                                }
                                                            >
                                                                {row.result}
                                                            </TableCell>
                                                            <TableCell
                                                                className={
                                                                    classes.tBodyCell
                                                                }
                                                                onClick={(
                                                                    e,
                                                                    data
                                                                ) =>
                                                                    handleShowClickedRow(
                                                                        e,
                                                                        row
                                                                    )
                                                                }
                                                            >
                                                                {truncateString(
                                                                    row.description
                                                                )}
                                                            </TableCell>
                                                            <TableCell
                                                                className={
                                                                    classes.tBodyCell
                                                                }
                                                                align="right"
                                                            >
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(
                                                                        id
                                                                    ) =>
                                                                        removeReport(
                                                                            row.targetId
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                {/* <Divider /> */}
                <DialogActions className="">
                    <Button
                        className={classes.btnSave}
                        // type="submit"
                        // onSubmit={handleCreateReport}
                        // disabled={!formState.isDirty}
                        // onClick={handleSubmit(onSubmit)}
                        disabled={listReports.length < 1}
                        onClick={handleCreateReport}
                    >
                        {operations.save}
                    </Button>
                    <Button onClick={handleCloseDialog}>
                        {operations.cancel}
                    </Button>
                </DialogActions>
            </form>
        </>
    )
}

export default CreateReportsForm
