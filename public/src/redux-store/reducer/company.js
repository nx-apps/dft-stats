import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    companyCodeList:[]
    // listFiles:[]
}

export function companyReducer(state = initialState,action){

    switch (action.type) {
        case 'COMPANY_CODE_GET':
          return Object.assign({},state,{companyCodeList:action.payload});
        default:
          return state
    }

}

export function companyAction(store){
    return [commonAction(),{
      COMPANY_CODE_GET(data){
          console.log(1);
        // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        // axios.get('/company/')
        // .then( (response)=>{
        //     console.log(response);
        //     store.dispatch({type:'COMPANY_CODE_GET',payload:response.data})
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      },
      COMPANY_CODE_SEARCH(data){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        console.log(data);
        // axios.get('/company/')
        // .then( (response)=>{
        //     console.log(response);
        //     store.dispatch({type:'company_CODE_GET',payload:response.data})
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      },
   }]
};
