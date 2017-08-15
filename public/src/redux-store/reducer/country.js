import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    countryList:[],
    countryListGroup:[]
}

export function countryReducer(state = initialState, action) {

    switch (action.type) {
        case 'COUNTRY_LIST':
            return Object.assign({}, state, { countryList: action.payload });
        case 'COUNTRY_SEARCH':
            return Object.assign({}, state, { list: action.payload });
        case 'COUNTRY_LIST_GROUP':
            return Object.assign({}, state, { countryListGroup: action.payload });
        default:
            return state
    }

}

export function countryAction(store) {
    return [commonAction(), {
        COUNTRY_LIST(data) {
            axios.get('./country/list')
                .then((response) => {
                    // response.data.map((item)=>{
                    //     return item.hidden = false
                    // })
                    for (var index = 0; index < response.data.length; index++) {
                        response.data[index].check = false
                        response.data[index].hidden = false
                        // this.set('hamonizeListNoGroup.' + index + '.check', false)
                    }
                    store.dispatch({ type: 'COUNTRY_LIST', payload: response.data })
                    // return ha
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        COUNTRY_LIST_GROUP(data) {
            axios.get(window._config.externalServerCommon + '/api/groupItem?group_id=76a37ff1-3cc5-42cd-a0a6-372f11d64173')
                .then((response) => {
                    for (var index = 0; index < response.data.length; index++) {
                        response.data[index].hidden = false
                        // response.data[index].check = false
                        for (var index2 = 0; index2 < response.data[index].sub.length; index2++) {
                            if (response.data[index].sub[index2] !== null ) {
                                response.data[index].sub[index2].hidden = false
                                // response.data[index].sub[index2].check = false
                            }
                        }
                    }
                    store.dispatch({ type: 'COUNTRY_LIST_GROUP', payload: response.data })
                    // return ha
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        COUNTRY_SEARCH(data) {
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            // //console.log(data); 
            axios.post('/country/search?', data)
                .then((response) => {
                    // //console.log(response);
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'COUNTRY_SEARCH', payload: response.data })
                        }
                    });
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
    }]
};
