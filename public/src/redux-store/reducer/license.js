import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    licenseList:[]
}

export function licenseReducer(state = initialState,action){

    switch (action.type) {
        case 'LICENSE_SEARCH':
          return Object.assign({},state,{licenseList:action.payload});
        case 'LICENSE_SEARCH_REFERENCE':
          return Object.assign({},state,{licenseList:action.payload});
        default:
          return state
    }

}

export function licenseAction(store){
    return [commonAction(),{
      LICENSE_SEARCH(data){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        // //console.log(data); 
        axios.get('/license/re01?'+data)
        .then( (response)=>{
            // //console.log(response);
            this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
              store.dispatch({type:'LICENSE_SEARCH',payload:response.data})
            }});
        })
        .catch(function (error) {
            //console.log(error);
        });
      },
      // LICENSE_SEARCH_REFERENCE(data){
      //   this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
      //   // //console.log(data); 
      //   axios.get('/license/re02/'+data)
      //   .then( (response)=>{
      //       // //console.log(response);
      //       this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
      //         store.dispatch({type:'LICENSE_SEARCH_REFERENCE',payload:response.data})
      //       }});
      //   })
      //   .catch(function (error) {
      //       //console.log(error);
      //   });
      // }
   }]
};
