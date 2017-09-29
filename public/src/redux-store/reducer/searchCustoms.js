import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    hamonizeList: [],
    hamonizeGroupList: [],
    companyList: [],
    countryList: [],
    searchList: [],
    settingSearch: {}
}

export function searchCustomsReducer(state = initialState, action) {

    switch (action.type) {
        case 'GET_SEARCH_CUSTOMS_HAMONIZE':
            return Object.assign({}, state, { hamonizeList: action.payload });
        case 'GET_SEARCH_CUSTOMS_HAMONIZE_GROUP':
            return Object.assign({}, state, { hamonizeGroupList: action.payload });
        case 'GET_SEARCH_CUSTOMS_COMPANY':
            return Object.assign({}, state, { companyList: action.payload });
        case 'GET_SEARCH_CUSTOMS_COUNTRY':
            return Object.assign({}, state, { countryList: action.payload });
        case 'GET_SEARCH_CUSTOMS_ALL':
            return Object.assign({}, state, { searchCustomsList: action.payload });
        case 'SET_SEARCH':
            return Object.assign({}, state, { settingSearch: action.payload });
        default:
            return state
    }

}

export function searchCustomsAction(store) {
    return [commonAction(), {
        GET_SEARCH_CUSTOMS_HAMONIZE(data) {
            // console.log(data);
            axios.get('/customs/hamonize?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_CUSTOMS_CUSTOMS_HAMONIZE', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        GET_SEARCH_CUSTOMS_HAMONIZE_GROUP(data) {
            // console.log(data);
            axios.get('/customs/hamonize/group?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_CUSTOMS_HAMONIZE_GROUP', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },

        GET_SEARCH_CUSTOMS_COMPANY(data) {
            axios.get('/customs/company?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_CUSTOMS_COMPANY', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        GET_SEARCH_CUSTOMS_COUNTRY(data) {
            axios.get('/customs/country?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_CUSTOMS_COUNTRY', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        // GET_SEARCH_CUSTOMS_ALL(data) {
        //     this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
        //     axios.post('/customs/searchCustoms', data)
        //         .then((response) => {
        //             this.fire('toast', {
        //                 status: 'success', text: 'ค้นหาสำเร็จ', callback() {
        //                     store.dispatch({ type: 'GET_SEARCH_CUSTOMS_ALL', payload: response.data })
        //                 }
        //             });

        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },
        SET_SEARCH_CUSTOMS(data) {
            // console.log(data);
            store.dispatch({ type: 'SET_SEARCH_CUSTOMS', payload: data })
        }

    }]
};
