import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    countryList:[]
}

export function countryReducer(state = initialState, action) {

    switch (action.type) {
        case 'COUNTRY_LIST':
            return Object.assign({}, state, { countryList: action.payload });
        case 'COUNTRY_SEARCH':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }

}

export function countryAction(store) {
    return [commonAction(), {
        COUNTRY_LIST(data) {
            axios.get('./country/list')
                .then((response) => {
                    response.data.map((item)=>{
                        return item.hidden = false
                    })
                    store.dispatch({ type: 'COUNTRY_LIST', payload: response.data })
                    // return ha
                })
                .catch(function (error) {
                    ////console.log(error);
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
