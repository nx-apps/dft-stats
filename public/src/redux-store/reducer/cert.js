import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    certCodeList:[]
    // listFiles:[]
}

export function certReducer(state = initialState,action){

    switch (action.type) {
        case 'CERT_CODE_GET':
          return Object.assign({},state,{certCodeList:action.payload});
        default:
          return state
    }

}

export function certAction(store){
    return [commonAction(),{
      CERT_CODE_GET(data){
        // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        console.log(1);
        // axios.get('/cert/')
        // .then( (response)=>{
        //     console.log(response);
        //     store.dispatch({type:'CERT_CODE_GET',payload:response.data})
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      },
      CERT_CODE_SEARCH(data){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        console.log(data);
        // axios.get('/cert/')
        // .then( (response)=>{
        //     console.log(response);
        //     store.dispatch({type:'cert_CODE_GET',payload:response.data})
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      },
   }]
};
