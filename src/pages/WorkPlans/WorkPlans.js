import React, { useState, useEffect, useRef } from 'react'
import formatISO9075 from 'date-fns/formatISO9075'
import { useAuth } from '../../hooks/AuthContext'
import { getPICs } from '../../services/FiltersServices'
import { useHistory } from 'react-router'
import moment from 'moment'
import Schedule from './Schedule'
import * as WorkPlansServices from './WorkPlansServices'
import { roleNames } from '../../constants/Generals'

function WorkPlans() {
    const [data, setData] = React.useState([])
    const [tree, setTree] = React.useState([
        {
            id: 1,
            schoolName: 'Hiếu Thành',
        },
    ])

    const { user } = useAuth()
    const history = useHistory()
    const [filter, setFilter] = useState({
        action: 'view',
        currentDate: new Date(),
        currentView: 'Week',
        name: 'navigating',
        username: user.username,
    })
    const typingTimeoutRef = useRef({})

    // Get list PICs for autocomplete search
    const [listPICs, setListPICs] = useState([])
    const getListPICs = (e) => {
        if (user.roles[0] === roleNames.salesman) {
            getPICs({ active: true, fullName: e, role: roleNames.salesman })
                .then((data) => {
                    // console.log('data: ', data)
                    setListPICs(data)
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
        } else {
            getPICs({ active: true, fullName: e })
                .then((data) => {
                    // console.log('data: ', data)
                    setListPICs(data)
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
    }
    useEffect(() => {
        getListPICs()
        // return () => setListPICs([])
    }, [])

    //---------------------------------------------------------------------------
    // Call APIs for workplans
    async function callAPISave(e) {
        const { addedRecords } = e
        const convert = {
            ...addedRecords[0],
            startTime: formatISO9075(addedRecords[0].startTime),
            endTime: formatISO9075(addedRecords[0].endTime),
            username: user.username,
        }
        delete convert.id
        WorkPlansServices.save(convert)
            .then((data) => {
                // console.log('callAPISave success: ', data);
                callAPI(filter)
                return
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

    async function callAPIUpdateSave(e, startTime) {
        const { data } = e
        const { occurrence, parent } = data

        let date = startTime
        if (!date) {
            date = occurrence.startTime
        }
        const required = moment.utc(date).format('YYYYMMDDTHHmmssZ')
        let recurrenceExp = required.slice(0, -6) + 'Z'
        if (parent.recurrenceException) {
            recurrenceExp = parent.recurrenceException + ',' + recurrenceExp
        }

        const occurrenceObj = {
            ...occurrence,
            id: -1,
            startTime: formatISO9075(occurrence.startTime),
            endTime: formatISO9075(occurrence.endTime),
            recurrenceId: parent.id,
            recurrenceRule: null,
            recurrenceException: recurrenceExp,
            username: user.username,
        }

        WorkPlansServices.updateSave(occurrenceObj)
            .then((data) => {
                // console.log('callAPIUpdateSave success: ', data);
                callAPI(filter)
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

    async function callAPIRemove(e) {
        const { data } = e
        const items = data?.map((item) => item['id'])
        if (!items) return

        WorkPlansServices.remove(items)
            .then((data) => {
                // console.log('callAPIRemove success: ', data);
                callAPI(filter)
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

    async function callAPIRemoveUpdate(e) {
        let recurrenceExp = e.data[0].parent?.recurrenceException

        e.data.forEach((item) => {
            const date = item.occurrence.startTime
            const required = moment.utc(date).format('YYYYMMDDTHHmmssZ')
            const recurrence = required.slice(0, -6) + 'Z'
            if (recurrenceExp) recurrenceExp = recurrenceExp + ',' + recurrence
            else recurrenceExp = recurrence
        })

        let item = { ...e.data[0].parent, recurrenceException: recurrenceExp }
        delete item.recurrenceID

        item = {
            ...item,
            id: -2,
            startTime: formatISO9075(item.startTime),
            endTime: formatISO9075(item.endTime),
            username: user.username,
        }
        const { id } = e.data[0].parent
        // console.log(" heleluya ", item)

        WorkPlansServices.removeUpdate(id, item)
            .then((data) => {
                callAPI(filter)
                // console.log('callAPIRemoveUpdate success: ', data);
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

    async function callAPIUpdate(e) {
        const { data, changedRecords } = e
        let item = { ...data }
        // const id = item.id
        //  delete item.recurrenceID
        item = {
            ...item,
            isAllDay: changedRecords[0].isAllDay,
            title: changedRecords[0].title,
            startTime: formatISO9075(changedRecords[0].startTime),
            endTime: formatISO9075(changedRecords[0].endTime),
            recurrenceRule: changedRecords[0].recurrenceRule,
            username: user.username,
        }
        // console.log(" remove object nay sau khi convert ", item)

        WorkPlansServices.update(item)
            .then((data) => {
                callAPI(filter)
                // console.log('callAPIUpdate success: ', data)
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

    // Get all activities
    async function callAPI(filter2) {
        const convert = {
            ...filter2,
            currentDate: formatISO9075(filter2.currentDate, {
                representation: 'date',
            }),
        }
        WorkPlansServices.callAPI(convert)
            .then((res) => {
                res.data?.forEach((element) => {
                    if (!element.recurrenceID) delete element.recurrenceID
                    element = {
                        ...element,
                        startDate: Date(element.startTime),
                        endDate: Date(element.endTime),
                        recurrenceException: element.recurrenceException,
                    }
                })
                // console.log('callAPI success: ', res.data)
                setData(res.data)
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
    React.useEffect(() => {
        callAPI(filter)
        // return () => setData(null)
    }, [filter])

    // Get all locations
    async function callAPITree(key) {
        const convert = {
            username: user.username,
            key: key,
        }

        WorkPlansServices.callAPITree(convert)
            .then((data) => {
                data?.forEach((element) => {})
                setTree(data)
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
    React.useEffect(
        () =>
            //call api for tree
            callAPITree(null),
        []
    )

    // Change view by "Today" / "Day" / "Week" / "Month"
    const handleChangeView = (e) => {
        if (e.action === 'date') {
            setFilter({ ...filter, action: 'date', currentDate: e.currentDate })
            //    e = {...e,currentView: filter.currentView,currentDate: e.currentDate}
        }
        if (e.action === 'view') {
            setFilter({ ...filter, action: 'view', currentView: 'Month' })
            //  e= {...e,currentDate: filter.currentDate}
        }
    }

    // Controller to redirect to
    const handleRequestType = (e, startTime) => {
        if (e.requestType === 'eventCreate') {
            callAPISave(e)
        }
        if (e.requestType === 'eventRemove') {
            if (e.data[0].occurrence) {
                callAPIRemoveUpdate(e)
                return
            }
            callAPIRemove(e)
        }
        if (e.requestType === 'eventChange') {
            if (e.data.occurrence) {
                callAPIUpdateSave(e, startTime)
                return
            }

            callAPIUpdate(e)
        }
    }

    // Search in location tree
    const onSubmit = (e) => {
        callAPITree(e)
    }
    const onChange = (e) => {
        if (e) {
            setFilter({ ...filter, username: e })
            callAPI({ ...filter, username: e })
        }
    }
    const onInputChange = (e) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (e) getListPICs(e)
            else getListPICs()
        }, 300)
    }
    return (
        <Schedule
            onSubmit={onSubmit}
            filter={filter}
            data={data}
            tree={tree}
            handleRequestType={handleRequestType}
            handleChangeView={handleChangeView}
            listPICs={listPICs}
            handleOnSearchFieldChange={onChange}
            isEdit={user.username === filter.username ? false : true}
            handleInputChange={onInputChange}
        />
    )
}

export default WorkPlans
