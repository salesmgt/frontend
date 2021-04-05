import React, { useState, useContext, createContext, useEffect, useReducer } from 'react'
import * as FiltersServices from '../../../services/FiltersServices'
import { useHistory } from 'react-router-dom'
import { TargetSchoolReducer } from './TargetSchoolReducer';
// import queryString from 'query-string'
// import { schoolYears, districts, schoolTypes, schoolLevels, schoolScales, PICs } from '../../data/mock-data'
// import { TargetSchoolReducer } from './TargetSchoolReducer'

const TargetSchoolContext = createContext()

export function useTargetSchool() {
    return useContext(TargetSchoolContext)
}

function useTargetSchoolProvider() {
    const history = useHistory()

    // Reducer
    const [params, dispatchParams] = useReducer(
        TargetSchoolReducer,
        {
            listFilters: {
                schoolYear: { filterType: 'schoolYear', filterValue: '' },
                district: { filterType: 'district', filterValue: '' },
                type: { filterType: 'type', filterValue: '' },
                level: { filterType: 'level', filterValue: '' },
                scale: { filterType: 'scale', filterValue: '' },
                PIC: { filterType: 'PIC', filterValue: null },
                purpose: { filterType: 'purpose', filterValue: '' },
            },
            searchKey: '',
            page: 0,
            limit: 10,
            column: 'id',
            direction: 'asc'
        }
    )

    // Paging
    const [page, setPage] = useState(params.page)
    const [limit, setLimit] = useState(params.limit)

    // Sorting
    const [column, setColumn] = useState(params.column)
    const [direction, setDirection] = useState(params.direction)

    //Filters
    const [schoolYear, setSchoolYear] = useState('');
    const [district, setDistrict] = useState('');
    const [schoolType, setSchoolType] = useState('');
    const [schoolLevel, setSchoolLevel] = useState('');
    const [schoolScale, setSchoolScale] = useState('');
    const [PIC, setPIC] = useState(null);
    const [purpose, setPurpose] = useState('');

    // APIs
    const [PICs, setPICs] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [schoolTypes, setSchoolTypes] = useState([]);
    const [schoolLevels, setSchoolLevels] = useState([]);
    const [schoolScales, setSchoolScales] = useState([]);

    // Search field (do not have)

    // Get filters' data
    const getSchoolYearsFilter = () => {
        FiltersServices.getSchoolYears().then((res) => {
            setSchoolYears(res.data)
        }).catch((error) => {
            if (error.response) {
                console.log(error)
                history.push({
                    pathname: '/errors',
                    state: { error: error.response.status }
                })
            }
        })
    }

    const getDistrictsFilter = () => {
        FiltersServices.getDistricts().then((res) => {
            setDistricts(res.data)
        }).catch((error) => {
            if (error.response) {
                console.log(error)
                history.push({
                    pathname: '/errors',
                    state: { error: error.response.status },
                })
            }
        })
    }
    // useEffect(getDistrictsFilter, [])

    const getSchoolTypesFilter = () => {
        FiltersServices.getSchoolTypes().then((res) => {
            // console.log('school types: ', res.data);
            // let tmp = [];
            // res.data.forEach(type => {
            //     if (type === 'CONG_LAP')
            //         tmp.push('Công lập');
            //     else if (type === 'NGOAI_CONG_LAP')
            //         tmp.push('Ngoài công lập')
            //     else if (type === 'BAN_CONG')
            //         tmp.push('Bán công')
            // });
            setSchoolTypes(res.data)
        }).catch((error) => {
            if (error.response) {
                console.log(error)
                history.push({
                    pathname: '/errors',
                    state: { error: error.response.status },
                })
            }
        })
    }
    // useEffect(getSchoolTypesFilter, [])

    const getSchoolLevelsFilter = () => {
        FiltersServices.getEducationalLevels().then((res) => {
            // console.log('school levels: ', res.data);
            // let data = [];
            // res.data.
            setSchoolLevels(res.data)
        }).catch((error) => {
            if (error.response) {
                console.log(error)
                history.push({
                    pathname: '/errors',
                    state: { error: error.response.status },
                })
            }
        })
    }
    // useEffect(getSchoolLevelsFilter, [])

    const getSchoolScalesFilter = () => {
        FiltersServices.getSchoolScales().then((res) => {
            setSchoolScales(res.data)
        }).catch((error) => {
            if (error.response) {
                console.log(error)
                history.push({
                    pathname: '/errors',
                    state: { error: error.response.status }
                })
            }
        })
    }

    const getPICsFilter = () => {
        FiltersServices.getPICs().then((res) => {
            setPICs(res.data.list)
            // console.log('list PICs = ', res.data);
        }).catch((error) => {
            if (error.response) {
                console.log(error)
                history.push({
                    pathname: '/errors',
                    state: { error: error.response.status }
                })
            }
        })
    }

    useEffect(() => {            // Ko đc gọi hết API 1 lượt trong cùng 1 useEffect
        getSchoolYearsFilter()   // vì như vậy sẽ rất khó quản lý lỗi từ thằng nào
        getDistrictsFilter()
        getSchoolTypesFilter()
        getSchoolLevelsFilter()
        getSchoolScalesFilter()
        getPICsFilter()
    }, [])


    //================Parse object "params" --> query-string================
    //........

    return {
        params, dispatchParams,
        PICs, districts, schoolYears,
        schoolTypes, schoolLevels, schoolScales,
        page, setPage, limit, setLimit,
        direction, setDirection, column, setColumn,
        schoolYear, setSchoolYear, district, setDistrict,
        schoolType, setSchoolType, schoolLevel,
        setSchoolLevel, schoolScale, setSchoolScale,
        PIC, setPIC, purpose, setPurpose
    }
}

function TargetSchoolProvider(props) {
    const { children } = props
    const targetSchool = useTargetSchoolProvider()

    return (
        <TargetSchoolContext.Provider value={targetSchool}>
            {children}
        </TargetSchoolContext.Provider>
    )
}

export default TargetSchoolProvider