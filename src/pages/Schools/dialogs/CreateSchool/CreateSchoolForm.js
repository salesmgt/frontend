import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Button,
    TextField,
    DialogContent,
    DialogActions,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    makeStyles,
    RadioGroup,
    Radio,
    Checkbox,
    FormLabel,
    FormControlLabel,
} from '@material-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
// import { Snackbars } from '../../../../components'
import { useApp } from '../../../../hooks/AppContext'
import * as Milk from '../../../../utils/Milk'
import { milkNames } from '../../../../constants/Generals'
import * as SchoolsServices from '../../SchoolsServices'
import { Consts } from '../DialogConfig'
import { SCHOOL_NAME_RGX, PHONE_RGX, TEL_RGX } from '../../../../utils/Regex'
import classes from './CreateSchool.module.scss'

const clientSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(30, 'Name must be at most 30 characters')
        .required('Name is required')
        .matches(SCHOOL_NAME_RGX, 'Incorrect entry'),
    address: yup.string().trim().required('Address is required'),
    phone: yup
        .string()
        .max(11, 'Tel must be at most 11 digits and has the correct format')
        .matches(TEL_RGX, 'Incorrect entry'),
    reprName: yup
        .string()
        .trim()
        .min(4, 'Name must be at least 4 characters')
        .max(30, 'Name must be at most 30 characters'),
    reprPhone: yup
        .string()
        .max(10, 'Phone must be at most 10 digits')
        .matches(PHONE_RGX, 'Incorrect entry'),
    reprEmail: yup.string().trim().email('Invalid email'),
})

const serverSchema = [
    {
        type: 'server',
        name: 'address',
        message: 'School address already exists',
    },
]

const ITEM_HEIGHT = 120
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT,
        },
    },
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
    },
    transformOrigin: {
        vertical: 'top',
        horizontal: 'center',
    },
    getContentAnchorEl: null,
}

const useStyles = makeStyles((theme) => ({
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
    formControl: {
        width: 200,
    },
}))

function CreateSchoolForm(props) {
    const { onClose, setNotify } = props
    const { operations, fields } = Consts
    const styles = useStyles()

    const { dists, schEduLvls, schTypes, schScales, schStatus } = useApp()
    const bakDists = dists ? dists : Milk.getMilk(milkNames.dists)
    const bakSchEduLvls = schEduLvls
        ? schEduLvls
        : Milk.getMilk(milkNames.eduLvls)
    const bakSchTypes = schTypes ? schTypes : Milk.getMilk(milkNames.types)
    const bakSchScales = schScales ? schScales : Milk.getMilk(milkNames.scales)
    const bakSchStatus = schStatus ? schStatus : Milk.getMilk(milkNames.status)

    const history = useHistory()

    // const [notify, setNotify] = useState({
    //     isOpen: false,
    //     message: '',
    //     type: '',
    // })

    const defaultValues = {
        name: '',
        address: '',
        district: bakDists[0],
        phone: '',
        educationalLevel: bakSchEduLvls[0],
        type: bakSchTypes[0],
        scale: bakSchScales[0],

        showRep: false,
    }

    const {
        control,
        handleSubmit,
        errors,
        setError,
        formState,
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(clientSchema),
        defaultValues: defaultValues,
    })

    const repWatch = watch('showRep')

    const onSubmit = (data) => {
        const model = { ...data, status: bakSchStatus[0] }
        delete model.showRep

        SchoolsServices.createSchool(model)
            .then((res) => {
                setNotify({
                    isOpen: true,
                    message: 'Created Successfully',
                    type: 'success',
                })
                // reset({
                //     name: '',
                //     address: '',
                //     district: bakDists[0],
                //     phone: '',
                //     educationalLevel: bakSchEduLvls[0],
                //     type: bakSchTypes[0],
                //     scale: bakSchScales[0],

                //     showRep: false,
                // })
                onClose()
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error)
                    if (error.response.status === 409) {
                        serverSchema.forEach(({ name, type, message }) =>
                            setError(name, { type, message })
                        )
                    } else {
                        history.push({
                            pathname: '/errors',
                            state: { error: error.response.status },
                        })
                    }
                }
                setNotify({
                    isOpen: true,
                    message: 'Create Unsuccessful',
                    type: 'error',
                })
            })

        // alert(JSON.stringify(model))
    }

    return (
        <>
            <DialogContent className={classes.dialogCont}>
                <form
                    noValidate
                    // onSubmit={handleSubmit(onSubmit)}
                >
                    <Grid container spacing={2} className={classes.wrapper}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ value, onChange }) => (
                                    <TextField
                                        label={fields.name.title}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        autoFocus
                                        value={value}
                                        onChange={onChange}
                                        error={!!errors.name}
                                        helperText={errors?.name?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7}>
                            <Controller
                                name="address"
                                control={control}
                                render={({ value, onChange }) => (
                                    <TextField
                                        label={fields.addr.title}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={value}
                                        onChange={onChange}
                                        error={!!errors.address}
                                        helperText={errors?.address?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={5} md={5} lg={5}>
                            <InputLabel>{fields.dist.title}</InputLabel>
                            <Controller
                                name="district"
                                control={control}
                                render={({ value, onChange }) => (
                                    <Select
                                        value={value}
                                        onChange={onChange}
                                        MenuProps={MenuProps}
                                        disableUnderline
                                    >
                                        {bakDists.map((data) => (
                                            <MenuItem
                                                key={data}
                                                value={data}
                                                classes={{
                                                    root: styles.menuItemRoot,
                                                    selected:
                                                        styles.menuItemSelected,
                                                }}
                                            >
                                                {data}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ value, onChange }) => (
                                    <TextField
                                        label={fields.tel.title}
                                        variant="outlined"
                                        fullWidth
                                        value={value}
                                        onChange={onChange}
                                        error={!!errors.phone}
                                        helperText={errors?.phone?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <InputLabel>{fields.eduLvl.title}</InputLabel>
                            <Controller
                                name="educationalLevel"
                                control={control}
                                render={({ value, onChange }) => (
                                    <Select
                                        value={value}
                                        onChange={onChange}
                                        MenuProps={MenuProps}
                                        disableUnderline
                                    >
                                        {bakSchEduLvls.map((data) => (
                                            <MenuItem
                                                key={data}
                                                value={data}
                                                classes={{
                                                    root: styles.menuItemRoot,
                                                    selected:
                                                        styles.menuItemSelected,
                                                }}
                                            >
                                                {data}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <InputLabel>{fields.type.title}</InputLabel>
                            <Controller
                                name="type"
                                control={control}
                                render={({ value, onChange }) => (
                                    <Select
                                        value={value}
                                        onChange={onChange}
                                        MenuProps={MenuProps}
                                        disableUnderline
                                    >
                                        {bakSchTypes.map((data) => (
                                            <MenuItem
                                                key={data}
                                                value={data}
                                                classes={{
                                                    root: styles.menuItemRoot,
                                                    selected:
                                                        styles.menuItemSelected,
                                                }}
                                            >
                                                {data}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <InputLabel>{fields.scale.title}</InputLabel>
                            <Controller
                                name="scale"
                                control={control}
                                render={({ value, onChange }) => (
                                    <Select
                                        value={value}
                                        onChange={onChange}
                                        MenuProps={MenuProps}
                                        disableUnderline
                                    >
                                        {bakSchScales.map((data) => (
                                            <MenuItem
                                                key={data}
                                                value={data}
                                                classes={{
                                                    root: styles.menuItemRoot,
                                                    selected:
                                                        styles.menuItemSelected,
                                                }}
                                            >
                                                {data}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <FormLabel>{operations.WithData}</FormLabel>
                            <Controller
                                name="showRep"
                                control={control}
                                render={({ value, onChange }) => (
                                    <Checkbox
                                        onChange={(e) =>
                                            onChange(e.target.checked)
                                        }
                                        checked={value}
                                    />
                                )}
                            />
                        </Grid>

                        {repWatch && (
                            <>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Controller
                                        name="reprName"
                                        control={control}
                                        defaultValue=""
                                        render={({ value, onChange }) => (
                                            <TextField
                                                label={fields.repName.title}
                                                variant="outlined"
                                                fullWidth
                                                value={value}
                                                onChange={onChange}
                                                error={!!errors.reprName}
                                                helperText={
                                                    errors?.reprName?.message
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <InputLabel>
                                        {fields.repGender.title}
                                    </InputLabel>
                                    <Controller
                                        name="reprIsMale"
                                        control={control}
                                        defaultValue={String(true)}
                                        render={({ value, onChange }) => (
                                            <RadioGroup
                                                value={value}
                                                onChange={onChange}
                                                row
                                            >
                                                <FormControlLabel
                                                    label={
                                                        fields.repGender.male.lb
                                                    }
                                                    value={
                                                        fields.repGender.male
                                                            .value
                                                    }
                                                    control={<Radio />}
                                                />
                                                <FormControlLabel
                                                    label={
                                                        fields.repGender.female
                                                            .lb
                                                    }
                                                    value={
                                                        fields.repGender.female
                                                            .value
                                                    }
                                                    control={<Radio />}
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Controller
                                        name="reprPhone"
                                        control={control}
                                        defaultValue=""
                                        render={({ value, onChange }) => (
                                            <TextField
                                                label={fields.repPhone.title}
                                                variant="outlined"
                                                fullWidth
                                                value={value}
                                                onChange={onChange}
                                                error={!!errors.reprPhone}
                                                helperText={
                                                    errors?.reprPhone?.message
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Controller
                                        name="reprEmail"
                                        control={control}
                                        defaultValue=""
                                        render={({ value, onChange }) => (
                                            <TextField
                                                label={fields.repEmail.title}
                                                variant="outlined"
                                                fullWidth
                                                value={value}
                                                onChange={onChange}
                                                error={!!errors.reprEmail}
                                                helperText={
                                                    errors?.reprEmail?.message
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions className={classes.dialogAct}>
                <Button
                    className={classes.btnSave}
                    // type="submit"
                    disabled={!formState.isDirty}
                    onClick={handleSubmit(onSubmit)}
                >
                    {operations.save}
                </Button>
                <Button
                    onClick={() => {
                        reset({
                            errors: false,
                            name: '',
                            address: '',
                            district: bakDists[0],
                            phone: '',
                            educationalLevel: bakSchEduLvls[0],
                            type: bakSchTypes[0],
                            scale: bakSchScales[0],

                            showRep: false,
                        })
                        onClose()
                    }}
                >
                    {operations.cancel}
                </Button>
            </DialogActions>

            {/* <Snackbars notify={notify} setNotify={setNotify} /> */}
        </>
    )
}

export default CreateSchoolForm
