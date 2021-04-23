import { ApiConfig as Api } from '../../services'

export async function getTargetSchools(
    page = 0, limit = 10, column = "id", direction = "asc", searchKey = undefined, filters = undefined
) {
    let url = `/targets?page=${page}&limit=${limit}&column=${column}&direction=${direction}`;

    url = searchKey ? url.concat(`&key=${searchKey}`) : url;

    // Tiền xử lý 7 filters
    if (filters) {
        url = filters['schoolYear'].filterValue ? url.concat(`&schoolYear=${filters['schoolYear'].filterValue}`) : url;
        url = filters['district'].filterValue ? url.concat(`&district=${filters['district'].filterValue}`) : url;
        url = filters['type'].filterValue ? url.concat(`&type=${filters['type'].filterValue}`) : url;
        url = filters['level'].filterValue ? url.concat(`&level=${filters['level'].filterValue}`) : url;
        url = filters['scale'].filterValue ? url.concat(`&scale=${filters['scale'].filterValue}`) : url;
        url = filters['PIC'].filterValue ? url.concat(`&fullName=${filters['PIC'].filterValue.fullName}`) : url;
        url = filters['purpose'].filterValue ? url.concat(`&purpose=${filters['purpose'].filterValue}`) : url;
    }

    const response = await Api.get(url)
    const data = await response.data
    return data
}

//============================Chưa dùng tới============================
// export async function getTargetSchools() {
//     return await Api.get('/targets')
// }

// export async function addTargetSchools(newTargetSchools) {
//     return await Api.post('/targets', { newTargetSchools })
// }

// export async function updateTargetSchool(targetSchool) {
//     return await Api.put('/targets', { targetSchool })
// }

// export async function removeTargetSchool(targetSchoolId) {
//     return await Api.delete('/targets', { targetSchoolId })
// }


export async function getDashboardsByKeys(...keys) {
    const response = await Api.get('/dashbords', { ...keys })
    const data = await response.data

    return data
}

export async function getAllSchools() {
    const response = await Api.get('/schools');
    const data = await response.data;
    return data;
}