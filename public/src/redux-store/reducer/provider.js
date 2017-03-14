import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{}
}

export function providerReducer(state = initialState,action){

    switch (action.type) {
        case 'PROVIDER_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'PROVIDER_SELECT':
            return Object.assign({},state,{select:action.payload});
        default:
            return state
    }

}

export function providerAction(store){

    return [commonAction(),
        {
            PROVIDER_LIST:function(){
                axios.get('/providers')
                .then(res=>{
                    store.dispatch({type:'PROVIDER_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            PROVIDER_SELECT:function(id){
                axios.get(`/providers/provider/${id}`)
                .then(res=>{
                    store.dispatch({type:'PROVIDER_SELECT',payload:res.data})
                })
                .catch(err=>{

                })
                console.log(id);
            }
        }
    ]

}