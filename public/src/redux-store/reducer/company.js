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
        case 'COMPANY_CODE_SEARCH_R1':
          return Object.assign({},state,{list:action.payload});       
        default:
          return state
    }

}

export function companyAction(store){
    return [commonAction(),{
      COMPANY_CODE_GET(data){
          //console.log(1);
        // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        axios.get('/company/')
        .then( (response)=>{
            //console.log(response);
            store.dispatch({type:'COMPANY_CODE_GET',payload:response.data})
        })
        .catch(function (error) {
            //console.log(error);
        });
      },
      COMPANY_CODE_SEARCH_R1(data=''){
        // this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        //console.log(data);
        axios.get('/company/re01?'+data)
        .then( (response)=>{
            console.log(response);
            this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
              store.dispatch({type:'COMPANY_CODE_SEARCH_R1',payload:response.data})
            }});
            
        })
        .catch(function (error) {
            //console.log(error);
        });
      },
      COMPANY_CODE_SEARCH_R2(data=''){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        // //console.log(data);
        axios.get('/company/re02?'+data)
        .then( (response)=>{
            //console.log(response);
            this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
              store.dispatch({type:'COMPANY_CODE_SEARCH_R1',payload:response.data})
            }});
            
        })
        .catch(function (error) {
            //console.log(error);
        });
      },
   }]
};
