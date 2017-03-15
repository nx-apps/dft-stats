import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    licenseCodeList:[]
    // listFiles:[]
}

export function licenseReducer(state = initialState,action){

    switch (action.type) {
        case 'LICENSE_CODE_GET':
          return Object.assign({},state,{licenseCodeList:action.payload});
        default:
          return state
    }

}

export function licenseAction(store){
    return [commonAction(),{
      LICENSE_CODE_GET(data){
          console.log(1);
        // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        // axios.get('/license/')
        // .then( (response)=>{
        //     console.log(response);
        //     store.dispatch({type:'LICENSE_CODE_GET',payload:response.data})
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      },
      license_CODE_SEARCH(data){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        console.log(data);
        // axios.get('/license/')
        // .then( (response)=>{
        //     console.log(response);
        //     store.dispatch({type:'license_CODE_GET',payload:response.data})
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      },
   }]
};
