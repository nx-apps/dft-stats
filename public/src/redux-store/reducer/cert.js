import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[]
}

export function certReducer(state = initialState,action){

    switch (action.type) {
        case 'CERT_SEARCH':
          return Object.assign({},state,{list:action.payload});
        case 'CERT_SEARCH_REFERENCE':
          return Object.assign({},state,{list:action.payload});
        default:
          return state
    }

}

export function certAction(store){
    return [commonAction(),{
      CERT_SEARCH(data){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        // console.log(data); 
        axios.get('/cert/re01?'+data)
        .then( (response)=>{
            // console.log(response);
            this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
              store.dispatch({type:'CERT_SEARCH',payload:response.data})
            }});
        })
        .catch(function (error) {
            //console.log(error);
        });
      },
      // CERT_SEARCH_REFERENCE(data){
      //   this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
      //   // console.log(data); 
      //   axios.get('/cert/re02/'+data)
      //   .then( (response)=>{
      //       // console.log(response);
      //       this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
      //         store.dispatch({type:'CERT_SEARCH_REFERENCE',payload:response.data})
      //       }});
      //   })
      //   .catch(function (error) {
      //       //console.log(error);
      //   });
      // }
   }]
};
