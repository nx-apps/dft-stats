import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    hamonizeList: [],
    hamonizeGroupList: [],
    companyList: [],
    countryList: [],
    searchList: []
}

export function searchReducer(state = initialState, action) {

    switch (action.type) {
        case 'GET_SEARCH_HAMONIZE':
            return Object.assign({}, state, { hamonizeList: action.payload });
        case 'GET_SEARCH_HAMONIZE_GROUP':
            return Object.assign({}, state, { hamonizeGroupList: action.payload });
        case 'GET_SEARCH_COMPANY':
            return Object.assign({}, state, { companyList: action.payload });
        case 'GET_SEARCH_COUNTRY':
            return Object.assign({}, state, { countryList: action.payload });
        case 'GET_SEARCH_ALL':
            return Object.assign({}, state, { searchList: action.payload });
        default:
            return state
    }

}

export function searchAction(store) {
    return [commonAction(), {
        //   LICENSE_SEARCH(data){
        //     this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        //     // ////console.log(data); 
        //     axios.post('/license/get',data)
        //     .then( (response)=>{
        //         // ////console.log(response);
        //         this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
        //           store.dispatch({type:'LICENSE_SEARCH',payload:response.data})
        //         }});
        //     })
        //     .catch(function (error) {
        //         ////console.log(error);
        //     });
        //   },
        GET_SEARCH_HAMONIZE(data) {
            // console.log(data);
            axios.get('/hamonize?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_HAMONIZE', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        GET_SEARCH_HAMONIZE_GROUP(data) {
            // console.log(data);
            axios.get('/hamonize/group?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_HAMONIZE_GROUP', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },

        GET_SEARCH_COMPANY(data) {
            axios.get('/company?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_COMPANY', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        GET_SEARCH_COUNTRY(data) {
            axios.get('/country?' + data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_COUNTRY', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        GET_SEARCH_ALL(data) {
            axios.post('/search', data)
                .then((response) => {
                    store.dispatch({ type: 'GET_SEARCH_ALL', payload: response.data })
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        }

    }]
};
