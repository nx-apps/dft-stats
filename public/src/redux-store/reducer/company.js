import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
  list: [],
  companyCodeList: []
}

export function companyReducer(state = initialState, action) {

  switch (action.type) {
    case 'COMPANY_CODE_GET':
      return Object.assign({}, state, { companyCodeList: action.payload });
    case 'COMPANY_SEARCH':
      return Object.assign({}, state, { list: action.payload });
    case 'COMPANY_SEARCH_LIST':
      return Object.assign({}, state, { companyCodeList: action.payload });
    case 'COMPANY_CLEAR_LIST_SEARCH':
      return Object.assign({}, state, { companyCodeList: action.payload });
    // case 'COMPANY_CODE_SEARCH_R1':
    //   return Object.assign({},state,{list:action.payload});       
    default:
      return state
  }

}

export function companyAction(store) {
  return [commonAction(), {
    COMPANY_CODE_GET(data) {
      //console.log(1);
      this.fire('toast', { status: 'load', text: 'กำลังโหลดข้อมูล...' })
      axios.get('/company/')
        .then((response) => {
          this.fire('toast', {
            status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback() {
              store.dispatch({ type: 'COMPANY_CODE_GET', payload: response.data })
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    COMPANY_SEARCH(data) {
      this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
      // console.log(data);
      axios.post('/company/search', data)
        .then((response) => {
          // console.log(response.data);
          this.fire('toast', {
            status: 'success', text: 'ค้นหาข้อมูลสำเร็จ', callback() {
              store.dispatch({ type: 'COMPANY_SEARCH', payload: response.data })
            }
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    COMPANY_SEARCH_LIST(data){
      this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
      // console.log(data);
      axios.post('/company',data)
      .then((response) => {
        // console.log(response.data);
        this.fire('toast', {
          status: 'success', text: 'ค้นหาข้อมูลสำเร็จ', callback() {
            store.dispatch({ type: 'COMPANY_SEARCH_LIST', payload: response.data })
          }
        });
      })
    },
    COMPANY_CLEAR_LIST_SEARCH: function () {
        store.dispatch({ type: 'COMPANY_CLEAR_LIST_SEARCH', payload: [] })
    }
    // COMPANY_CODE_SEARCH_R1(data=''){
    // this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
    // axios.get('/company/re01?'+data)
    // .then( (response)=>{
    //     this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
    //       store.dispatch({type:'COMPANY_CODE_SEARCH_R1',payload:response.data})
    //     }});

    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
    // },
  }]
};
