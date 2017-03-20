import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    lists:[],
    select:{},
    select_welefares:{},
    select_use_welefares:{date_use:new Date().toISOString().split('T')[0]},
    disabled:true,
    insert_view:true,
    lisyUserFalse:[]
}
const clearData = (data,callback)=>{

    let {prefix_id,firstname,lastname,gender_id,type_employee_id,active_id,position_id,matier_id,academic_id,department_id,faculty_id,relation_id,emp_no,personal_id}=data;
    let newData={prefix_id,firstname,lastname,gender_id,type_employee_id,active_id,position_id,matier_id,academic_id,department_id,faculty_id,relation_id,emp_no,personal_id};
    // newData.period = new Array();
    // data.period.map((tag)=>{
    //     newData.period.push({no:tag.no,quality:tag.quality});
    // });
    newData.start_work_date = new Date (data.start_work_date).toISOString();
    newData.birthdate = new Date (data.birthdate).toISOString();
        callback(newData)
    // callback(data)
}
const clearDatawelfare = (data,callback)=>{
    
    let {emp_id,welfare_id,use_budget,status,year,group_id}=data;
    let newData={emp_id,welfare_id,use_budget,status,year,group_id};
    // //console.log(data.date/use_welfare/update_use == '');
   
    newData.document_ids = new Array()    
    data.document_ids.map((file)=>{
        newData.document_ids.push(file)
    })
    
    if (data.date_use == '' || data.date_use == undefined) {
        newData.date_use = new Date().toISOString();
    } else {
        // //console.log(data.date_use);
        newData.date_use = new Date (data.date_use).toISOString();
    }
    // //console.log(newData);
        callback(newData)
}
export function usersReducer(state = initialState,action){

    switch (action.type) {
        case 'USERS_LIST':
        // //console.log(1)
            return Object.assign({},state,{lists:action.payload});
        case 'USER_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'USER_GET_WELFARES':
            return Object.assign({},state,{select_welefares:action.payload});
        case 'USER_BTN' :
            return Object.assign({},state,{disabled:action.payload});
        case 'USER_INSERT_VIEW' : 
            return Object.assign({},state,{insert_view:action.payload});
        case 'USER_USE_SELETE_WELFARE' :
            return Object.assign({},state,{select_use_welefares:action.payload});
        case 'USERS_FALSE_LIST' : 
            return Object.assign({},state,{lisyUserFalse:action.payload});          
        default:
            return state
    }

}

export function usersAction(store){

    return [commonAction(),
        {
            USERS_LIST:function(){
                // //console.log(1)
                axios.get('./employee/list')
                .then(res=>{
                    //console.log(res.data)
                    store.dispatch({type:'USERS_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            USER_INSERT(data){
                clearData(data,(newData)=>{
                 this.fire('toast',{status:'load'});
                    axios.post(`./employee/insert`,newData)
                    .then(res=>{
                        this.USERS_LIST();
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
            USER_SELECT:function(data){
               store.dispatch({type:'USER_SELECT',payload:data})
            },
            USER_EDIT:function(data){
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
                                axios.put(`/employee/update`,newData)
                                .then(res=>{
                                    this.USERS_LIST();
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
            USER_DELETED:function(id){
                // //console.log(id)
                this.fire('toast',{
                    status:'openDialog',
                    text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
                    confirmed:(result)=>{
                        if(result == true){
                            axios.delete(`./employee/delete/${id}`)
                            .then(res=>{
                                this.USERS_LIST();
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
            USER_BTN(data){
                // //console.log(data)
                store.dispatch({type:'USER_BTN',payload:data})
            },
            USER_INSERT_VIEW(data){
                // //console.log(data)
                store.dispatch({type:'USER_INSERT_VIEW',payload:data})
            },
            USER_GET_WELFARES(id,otherFunction=false,year=new Date().getFullYear()){
                //console.log('otherFunctioncdddd',year)
                 this.fire('toast',{status:'load'});
                    axios.get(`./employee/${id}/welfares/year/${year}`)
                    .then(res=>{
                        //console.log(res)
                        this.fire('toast',{status:'success',text:'โหลดข้อมูลสำเร็จ',
                            callback:()=>{
                                store.dispatch({type:'USER_GET_WELFARES',payload:res.data})
                                if(!otherFunction)
                                    this.$$('panel-right').open();
                            }
                        });
                    })
                    .catch(err=>{
                        //console.log(err);
                    })
                    // })
            },
            USER_USE_WELFARE(data){
            // //console.log(data);
            clearDatawelfare(data,(newData)=>{
                
                this.fire('toast',{status:'load'});
                // newData.status = true;
                    axios.post(`./employee/request/welfare/`,newData)
                    .then(res=>{
                        this.USER_GET_WELFARES(newData.emp_id,true);
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err=>{
                        //console.log(err);
                    })
                })
            },
            USER_USE_WELFARE_APPROVE(data){
            // //console.log(data);
            clearDatawelfare(data,(newData)=>{
                newData.id = data.id;
                this.fire('toast',{status:'load'});
                newData.status = 'approve';
                newData.date_approve = new Date().toISOString();
                    axios.put(`./employee/update/welfare`,newData)
                    .then(res=>{
                        this.dispatchAction('USERS_FALSE_LIST');
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err=>{
                        //console.log(err);
                    })
                })
            },
            USER_DELETE_USE_WELFARE(data){
                clearDatawelfare(data,(newData)=>{
                newData.id = data.id;
                this.fire('toast',{status:'load'});
                newData.status = 'reject';
                newData.date_approve = new Date().toISOString();
                    axios.put(`./employee/update/welfare`,newData)
                    .then(res=>{
                        this.dispatchAction('USERS_FALSE_LIST');
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err=>{
                        //console.log(err);
                    })
                })
                // //console.log(data);
                //  this.fire('toast',{
                //     status:'openDialog',
                //     text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
                //     confirmed:(result)=>{
                //         if(result == true){
                //             axios.delete(`./employee/use_welfare/delete/id/${id}`)
                //             .then(res=>{
                //                 this.dispatchAction('USERS_FALSE_LIST');
                //                 this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                //                     callback:()=>{
                //                         // this.$$('panel-right').close();
                //                     }
                //                 });
                //             })
                //         }
                //     }
                // })
            },
            USER_USE_SELETE_WELFARE(data){
                store.dispatch({type:'USER_USE_SELETE_WELFARE',payload:data})
            },
            USERS_FALSE_LIST(data){
                this.fire('toast',{status:'load'});
                    axios.get(`./employee/unapprove/`)
                    .then(res=>{
                        // //console.log(res)
                        this.fire('toast',{status:'success',text:'โหลดข้อมูลสำเร็จ',
                            callback:()=>{
                                store.dispatch({type:'USERS_FALSE_LIST',payload:res.data})
                                // if(!otherFunction)
                                //     this.$$('panel-right').open();
                            }
                        });
                    })
                    .catch(err=>{
                        //console.log(err);
                    })
            }
        },
        
    ]

}