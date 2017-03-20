import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    module:[],
    select:{data_source:'',conditions:[{name:'',symbol:''}]},
    listConditions:[],
    listTable:[],
    listField:[],
    disabled:true,
    insert_view:true
}
const clearData = (data,callback)=>{

    let {label,field,data_source}=data;
    let newData={label,field,data_source};
    newData.conditions = new Array();
    //console.log(typeof newData.data_source == 'undefined');
    if(typeof newData.data_source == 'undefined')
        newData.data_source = ''
    // for (let prop in newData) {
    //    newData[prop] = newData[prop].replace(/ /g,'').trim()
    // }  
    data.conditions.map((tag)=>{
        newData.conditions.push({name:tag.name//.replace(/ /g,'').trim()
        ,symbol:tag.symbol});
    });
        callback(newData)
    // callback(data)
}
export function conditionReadWelfareReducer(state = initialState,action){
    switch (action.type) {
        case 'CONDITIONREADWELFARE_SET':
            return Object.assign({},state,{select:{conditions:[{name:'',symbol:''}]}});
        case 'CONDITIONREADWELFARE_LIST' : 
            return Object.assign({},state,{listConditions:action.payload});        
        case 'CONDITIONREADWELFARE_TABLE_LIST' :
            return Object.assign({},state,{listTable:action.payload}); 
        case 'CONDITIONREADWELFARE_FIEID_LIST' :
            return Object.assign({},state,{listField:action.payload}); 
        case 'CONDITIONREADWELFARE_SELECT' : 
             return Object.assign({},state,{select:action.payload}); 
        case 'CONDITIONREADWELFARE_BTN' :
            return Object.assign({},state,{disabled:action.payload});
        case 'CONDITIONREADWELFARE_INSERT_VIEW' : 
            return Object.assign({},state,{insert_view:action.payload});             
        default:
            return state;
    }
}

export function conditionReadWelfareAction(store){
    return [
        commonAction(),{
            CONDITIONREADWELFARE_SET(){
                store.dispatch({type:'CONDITIONREADWELFARE_SET'})
            },
            CONDITIONREADWELFARE_BTN(data){
                // //console.log(data)
                store.dispatch({type:'CONDITIONREADWELFARE_BTN',payload:data})
            },
            CONDITIONREADWELFARE_INSERT_VIEW(data){
                // //console.log(data)
                store.dispatch({type:'CONDITIONREADWELFARE_INSERT_VIEW',payload:data})
            },
            CONDITIONREADWELFARE_LIST(){
                axios.get('/condition_read_welfare/list')
                .then(res=>{
                    store.dispatch({type:'CONDITIONREADWELFARE_LIST',payload:res.data})
                })
                .catch(err=>{
                    //console.log(err);
                })
            },
            CONDITIONREADWELFARE_TABLE_LIST(){
                // //console.log(1);
                axios.get('/condition_read_welfare/listTable/')
                .then(res=>{
                    store.dispatch({type:'CONDITIONREADWELFARE_TABLE_LIST',payload:res.data})
                })
                .catch(err=>{
                    //console.log(err);
                })
            },
            CONDITIONREADWELFARE_FIEID_LIST(){
                axios.get('/condition_read_welfare/listField/')
                .then(res=>{
                    store.dispatch({type:'CONDITIONREADWELFARE_FIEID_LIST',payload:res.data})
                })
                .catch(err=>{
                    //console.log(err);
                })
            },
            CONDITIONREADWELFARE_INSERT(data){
                //console.log(data);
                clearData(data,(newData)=>{
                this.fire('toast',{status:'load'});
                axios.post(`./condition_read_welfare/insert`,newData)
                    .then(res=>{
                        this.CONDITIONREADWELFARE_LIST();
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err=>{
                        //console.log(err);
                    })
                    })
            },
            CONDITIONREADWELFARE_SELECT:function(data){
               store.dispatch({type:'CONDITIONREADWELFARE_SELECT',payload:data})
            },
            CONDITIONREADWELFARE_EDIT:function(data){
                // //console.log(data)
                this.fire('toast',{
                    status:'openDialog',
                    text:'ต้องการบันทึกข้อมูลใช่หรือไม่ ?',
                    confirmed:(result)=>{
                        if(result == true){
                            this.fire('toast',{status:'load'})
                            clearData(data,(newData)=>{
                                this.fire('toast',{status:'load'});
                                newData.id = data.id
                                axios.put(`/condition_read_welfare/update`,newData)
                                .then(res=>{
                                    this.CONDITIONREADWELFARE_LIST();
                                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                                        callback:()=>{
                                            this.$$('panel-right').close();
                                        }
                                    });
                                })
                                .catch(err=>{
                                    //console.log(err);
                                })
                            })
                        }
                    }
                })
            },
            CONDITIONREADWELFARE_DELETED:function(id){
                // //console.log(id)
                this.fire('toast',{
                    status:'openDialog',
                    text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
                    confirmed:(result)=>{
                        if(result == true){
                            axios.delete(`./condition_read_welfare/delete/id/${id}`)
                            .then(res=>{
                                this.CONDITIONREADWELFARE_LIST();
                                this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                                    callback:()=>{
                                        this.$$('panel-right').close();
                                    }
                                });
                            })
                        }
                    }
                })
                
            },
        }
    ]
}