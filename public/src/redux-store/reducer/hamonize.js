import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    select:{},
    list:[],
    date:{sdate:'',edate:''},
    hamonizeCodeList:[]
    // listFiles:[]
}

export function hamonizeReducer(state = initialState,action){

    switch (action.type) {
        case 'HAMONIZE_SET_DATE':
          return Object.assign({},state,{date:action.payload});
        case 'HAMONIZE_CODE_GET':
          return Object.assign({},state,{hamonizeCodeList:action.payload});
        case 'HAMONIZE_CODE_SEARCH_R1' :
          return Object.assign({},state,{list:action.payload});   
        default:
          return state
    }

}

export function hamonizeAction(store){
    return [commonAction(),{
      HAMONIZE_SET_DATE(){
          let date = new Object()
          let today = new Date()
          date.sdate = today.toISOString().split('T')[0]
          date.edate = new Date(today.setDate(today.getDate()+1)).toISOString().split('T')[0]
          store.dispatch({type:'HAMONIZE_SET_DATE',payload:date})
      },
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
      HAMONIZE_CODE_SEARCH_R1(data=''){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        console.log(data);
        axios.get('/hamonize/re01?'+data)
        .then( (response)=>{
            console.log(response);
            this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
              store.dispatch({type:'HAMONIZE_CODE_SEARCH_R1',payload:response.data})
            }});
            
        })
        .catch(function (error) {
            console.log(error);
        });
      },
      HAMONIZE_CODE_SEARCH_R2(data=''){
        this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
        // console.log(data);
        axios.get('/hamonize/re02?'+data)
        .then( (response)=>{
            console.log(response);
            this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
              store.dispatch({type:'HAMONIZE_CODE_SEARCH_R1',payload:response.data})
            }});
            
        })
        .catch(function (error) {
            console.log(error);
        });
      },
   }]
};
