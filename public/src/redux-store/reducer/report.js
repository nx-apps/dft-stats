import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    zoneList: [],
    yearList: [],
    monthList: [],
    countryList: []
}

export function reportReducer(state = initialState, action) {

    switch (action.type) {
        case 'GET_ZONE':
            return Object.assign({}, state, { zoneList: action.payload });
        case 'GET_YEAR':
            return Object.assign({}, state, { yearList: action.payload });
        case 'GET_MONTH_IN_YEAR':
            return Object.assign({}, state, { monthList: action.payload });
        case 'GET_COUNTRY_IN_YEAR':
            return Object.assign({}, state, { countryList: action.payload })
        default:
            return state
    }

}

export function reportAction(store) {
    return [commonAction(), {
        GET_ZONE() {
            axios.get('/custom/zone')
                .then((response) => {
                    response.data.map(item => {
                        item.check = false
                        return item
                    })
                    store.dispatch({ type: 'GET_ZONE', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        GET_YEAR() {
            axios.get('/custom/year')
                .then((response) => {
                    store.dispatch({ type: 'GET_YEAR', payload: response.data })
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        GET_MONTH_IN_YEAR(year) {
            axios.get('/custom/month?modelYear=' + year)
                .then((response) => {
                    response.data.map(item => {
                        item.check = false
                        return item
                    })
                    store.dispatch({ type: 'GET_MONTH_IN_YEAR', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        GET_COUNTRY_IN_YEAR(date) {
            // console.log(date);
            axios.get('/custom/country?'+date)
                .then((response) => {
                    store.dispatch({ type: 'GET_COUNTRY_IN_YEAR', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
    }]
};
