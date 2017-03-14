import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{},
    academic:[{id:0,academic:''}],
    active:[{id:0,active:''}],
    department:[{id:0,department:''}],
    employee:[{id:0,employee:''}],
    faculty:[{id:0,faculty:''}],
    gender:[{id:0,gender:''}],
    matier:[{id:0,matier:''}],
    position:[{id:0,position:''}],
    prefixname:[{id:0,prefixname:''}],
    relation:[{id:0,relation:''}],
    type_employee:[{id:0,type_employee:''}],
}

export function commonDataReducer(state = initialState,action){

    switch (action.type) {
        case 'COMMONDATA_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'COMMONDATA_SELECT':
            return Object.assign({},state,{select:action.payload});
        case  'COMMONDATA_DATA_ACADEMIC':
            return Object.assign({},state,{academic:action.payload});
        case  'COMMONDATA_DATA_DEPARTMENT':
            return Object.assign({},state,{department:action.payload});
        case  'COMMONDATA_DATA_ACTIVE':
            return Object.assign({},state,{active:action.payload});
        case  'COMMONDATA_DATA_EMPLOYEE':
            return Object.assign({},state,{employee:action.payload});
        case  'COMMONDATA_DATA_FACULTY':
            return Object.assign({},state,{faculty:action.payload});
        case  'COMMONDATA_DATA_GENDER':
            return Object.assign({},state,{gender:action.payload});
        case  'COMMONDATA_DATA_MATIER':
            return Object.assign({},state,{matier:action.payload});
        case  'COMMONDATA_DATA_POSITION':
            return Object.assign({},state,{position:action.payload});
        case  'COMMONDATA_DATA_PREFIXNAME':
            return Object.assign({},state,{prefixname:action.payload});
        case  'COMMONDATA_DATA_RELATION':
            return Object.assign({},state,{relation:action.payload});
        case 'COMMONDATA_DATA_TYPE_EMPLOYEE':
            return Object.assign({},state,{type_employee:action.payload});
        default:
            return state
    }

}

export function commonDataAction(store){

    return [commonAction(),
        {
            COMMONDATA_LIST:function(){
                console.log(1)
                // axios.get('/providers')
                // .then(res=>{
                //     store.dispatch({type:'COMMONDATA_LIST',payload:res.data})
                // })
                // .catch(err=>{

                // })
            },
            //  COMMONDATA_DATA_ACADEMIC
            COMMONDATA_DATA_ACADEMIC:function(){
                axios.get(`/common/academic`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_ACADEMIC',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_ACADEMIC_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/academic/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACADEMIC()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACADEMIC_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/academic/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACADEMIC()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACADEMIC_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/academic/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACADEMIC()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_ACTIVE
            COMMONDATA_DATA_ACTIVE:function(id){
                axios.get(`/common/active`)
                .then(res=>{
                    // console.log(res.data);
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_ACTIVE',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_ACTIVE_INSERT:function(data){
                // console.log(data)
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/active/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACTIVE()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACTIVE_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/active/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACTIVE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_ACTIVE_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/active/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_ACTIVE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_DEPARTMENT 
            COMMONDATA_DATA_DEPARTMENT:function(id){
                axios.get(`/common/department`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_DEPARTMENT',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_DEPARTMENT_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/department/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_DEPARTMENT()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_DEPARTMENT_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/department/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_DEPARTMENT()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_DEPARTMENT_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/department/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_DEPARTMENT()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_FACULTY
            COMMONDATA_DATA_FACULTY:function(id){
                axios.get(`/common/faculty`)
                .then(res=>{
                     var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_FACULTY',payload:newData})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_FACULTY_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/faculty/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_FACULTY()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_FACULTY_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/faculty/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_FACULTY()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_FACULTY_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/faculty/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_FACULTY()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_GENDER:function(id){
                axios.get(`/common/gender`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_GENDER',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_GENDER_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/gender/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_GENDER()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_GENDER_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/gender/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_GENDER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_GENDER_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/gender/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_GENDER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_EMPLOYEE:function(id){
                axios.get(`/common/employee`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_EMPLOYEE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            // COMMONDATA_DATA_MATIER
            COMMONDATA_DATA_MATIER:function(id){
                axios.get(`/common/matier`)
                .then(res=>{
                     var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_MATIER',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_MATIER_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/matier/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_MATIER()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_MATIER_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/matier/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_MATIER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_MATIER_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/matier/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_MATIER()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_POSITION
            COMMONDATA_DATA_POSITION:function(id){
                axios.get(`/common/position`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_POSITION',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_POSITION_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/position/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_POSITION()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_POSITION_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/position/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_POSITION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_POSITION_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/position/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_POSITION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_PREFIXNAME
            COMMONDATA_DATA_PREFIXNAME:function(id){
                axios.get(`/common/prefix`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_PREFIXNAME',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_PREFIXNAME_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/prefix/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_PREFIXNAME()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_PREFIXNAME_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/prefix/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_PREFIXNAME()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_PREFIXNAME_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/prefix/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_PREFIXNAME()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_RELATION
            COMMONDATA_DATA_RELATION:function(id){
                axios.get(`/common/relation`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_RELATION',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_RELATION_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/relation/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_RELATION()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_RELATION_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/relation/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_RELATION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_RELATION_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/relation/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_RELATION()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            // COMMONDATA_DATA_TYPE_EMPLOYEE
            COMMONDATA_DATA_TYPE_EMPLOYEE:function(id){
                axios.get(`/common/type_employee`)
                .then(res=>{
                    var newData = res.data.map((item)=>{
                        item.check = true;
                        item.status = false;
                        return item;
                    })
                    store.dispatch({type:'COMMONDATA_DATA_TYPE_EMPLOYEE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_TYPE_EMPLOYEE_INSERT:function(data){
                this.fire('toast',{status:'load'}); 
                axios.post(`/common/type_employee/insert`,data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_TYPE_EMPLOYEE()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_TYPE_EMPLOYEE_UPDATE:function(data){
                this.fire('toast',{status:'load'}); 
                axios.put('/common/type_employee/update',data)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'อัพเดทสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_TYPE_EMPLOYEE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            COMMONDATA_DATA_TYPE_EMPLOYEE_DELETE:function(del){
                this.fire('toast',{status:'load'});
                axios.delete('/common/type_employee/delete/id/'+del)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                      callback:()=>{
                         this.COMMONDATA_DATA_TYPE_EMPLOYEE()
                      }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            }
            // COMMONDATA_SELECT:function(id){
            //     axios.get(`/providers/provider/${id}`)
            //     .then(res=>{
            //         store.dispatch({type:'COMMONDATA_SELECT',payload:res.data})
            //     })
            //     .catch(err=>{

            //     })
            //     console.log(id);
            // }
        }
    ]

}