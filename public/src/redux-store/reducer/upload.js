import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    fileIdUpload:{},
    // listFiles:[]
}

export function uploadReducer(state = initialState,action){

    switch (action.type) {
        case 'UPLOAD_LIST':
          return Object.assign({},state,{list:action.payload});
        default:
          return state
    }

}

export function uploadAction(store){
    return [commonAction(),{
      UPLOAD_DELETE(data){
        this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        axios.delete('/employee/delete/'+data)
        .then( (response)=>{
            console.log(response);
            // store.dispatch({type:'UPLOAD_DELETE',payload:response.data})
            this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',callback:function(){
              console.log('success');
            }});
        })
        .catch(function (error) {
            console.log(error);
        });
      }
   }]
};
