import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    hamonizeList: [],
    hamonizeGroupList: [],
    zoneGroupList: [],
    countryList: [],
    searchCustomsList: [],
    settingSearch: {}
}

export function searchCustomsReducer(state = initialState, action) {

    switch (action.type) {
        // case 'GET_SEARCH_CUSTOMS_HAMONIZE':
        //     return Object.assign({}, state, { hamonizeList: action.payload });
        // case 'GET_SEARCH_CUSTOMS_HAMONIZE_GROUP':
        //     return Object.assign({}, state, { hamonizeGroupList: action.payload });
        // case 'GET_SEARCH_CUSTOMS_ZONE':
        //     return Object.assign({}, state, { zoneGroupList: action.payload });
        // case 'GET_SEARCH_CUSTOMS_COUNTRY':
        //     return Object.assign({}, state, { countryList: action.payload });
        case 'GET_SEARCH_CUSTOMS_ALL':
            return Object.assign({}, state, { searchCustomsList: action.payload });
        case 'SET_SEARCH_CUSTOMS':
            return Object.assign({}, state, { settingSearch: action.payload });
        default:
            return state
    }

}

export function searchCustomsAction(store) {
    return [commonAction(), {
        // GET_SEARCH_CUSTOMS_HAMONIZE(data) {
        //     // console.log(data);
        //     axios.get('/custom/hamonize?' + data)
        //         .then((response) => {
        //             store.dispatch({ type: 'GET_SEARCH_CUSTOMS_HAMONIZE', payload: response.data })
        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },
        // GET_SEARCH_CUSTOMS_HAMONIZE_GROUP(data) {
        //     // console.log(data);
        //     axios.get('/custom/typerice?' + data)
        //         .then((response) => {
        //             store.dispatch({ type: 'GET_SEARCH_CUSTOMS_HAMONIZE_GROUP', payload: response.data })
        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },

        // GET_SEARCH_CUSTOMS_ZONE(data) {
        //     axios.get('/custom/zone?' + data)
        //         .then((response) => {
        //             store.dispatch({ type: 'GET_SEARCH_CUSTOMS_ZONE', payload: response.data })
        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },
        // GET_SEARCH_CUSTOMS_COUNTRY(data) {
        //     axios.get('/custom/country?' + data)
        //         .then((response) => {
        //             store.dispatch({ type: 'GET_SEARCH_CUSTOMS_COUNTRY', payload: response.data })
        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },
        GET_SEARCH_CUSTOMS_ALL(data) {
            console.log(data);
            this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
            axios.post('/custom/search?', data)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'GET_SEARCH_CUSTOMS_ALL', payload: response.data })
                        }
                    });

                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        SET_SEARCH_CUSTOMS(data) {
            // console.log(data);
            store.dispatch({ type: 'SET_SEARCH_CUSTOMS', payload: data })
        }

    }]
};
