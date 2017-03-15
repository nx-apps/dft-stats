import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    hamonizeCodeList:[]
    // listFiles:[]
}

export function hamonizeReducer(state = initialState,action){

    switch (action.type) {
        case 'HAMONIZE_CODE_GET':
          return Object.assign({},state,{hamonizeCodeList:action.payload});
        default:
          return state
    }

}

export function hamonizeAction(store){
    return [commonAction(),{
      HAMONIZE_CODE_GET(data){
        // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        axios.get('/hamonize/')
        .then( (response)=>{
            console.log(response);
            store.dispatch({type:'HAMONIZE_CODE_GET',payload:response.data})
        })
        .catch(function (error) {
            console.log(error);
        });
      },
      HAMONIZE_CODE_SEARCH(data){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        console.log(data);
        // axios.get('/hamonize/')
        // .then( (response)=>{
        //     console.log(response);
        //     store.dispatch({type:'HAMONIZE_CODE_GET',payload:response.data})
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
      },
   }]
};
