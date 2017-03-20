import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    dataSelect: {},
    condition: [],
    employees: []
}

export function welfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'WELFARE_DATA_SELECT':
            return Object.assign({}, state, { dataSelect: action.payload });
        case 'CONDITION_LIST':
            return Object.assign({}, state, { condition: action.payload });
        case 'WELFARE_LIST_EMPLOYEE':
            return Object.assign({}, state, { employees: action.payload });
        default:
            return state
    }

}

export function welfareAction(store) {

    return [commonAction(),
    {
        WELFARE_LIST: function () {
            axios.get('/welfare')
                .then(function (result) {
                    // //console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST_ID: function (data) {
            axios.get('/welfare/' + data)
                .then(function (result) {
                    //console.log('*',result.data);
                    store.dispatch({ type: 'WELFARE_LIST_ID', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_INSERT: function (data) {
            //console.log(data);
            this.fire('toast', { status: 'load' });
            axios.post(`./welfare/insert`, data)
                .then((result) => {
                    //console.log(result);
                    this.LIST_WELFARE_ID(data.group_id);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            //console.log('success');
                            this.clearData();
                        }
                    });
                })
                .catch((err) => {
                    //console.log(err);
                })
        },
        WELFARE_DELETE: function (data) {
            // //console.log(data);
            axios.delete(`./welfare/delete/id/` + data.id)
                .then((result) => {
                    // //console.log(result);
                    this.LIST_WELFARE_ID(data.group_id);
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            //console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    //console.log(err);
                })
        },
        WELFARE_EDIT: function (data) {
            // //console.log(data);
            var datas = {
                budget: data.budget,
                group_id: data.group_id,
                welfare_name: data.welfare_name,
                condition: data.condition,
                id: data.id
            }
            // //console.log(datas);
            this.fire('toast', { status: 'load' });
            axios.put(`./welfare/update`, datas)
                .then((result) => {
                    // //console.log(result);
                    this.WELFARE_LIST();
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: function () {
                            //console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    //console.log(err);
                })
        },
        WELFARE_DATA_SELECT: function (val) {
            // this.id = val
            axios.get('/welfare/' + val)
                .then(function (result) {
                    // //console.log("*",result.data);
                    store.dispatch({ type: 'WELFARE_DATA_SELECT', payload: result.data })
                })
                .catch(err => {

                })
        },
        CONDITION_LIST: function () {
            axios.get('/condition_read_welfare/list/conditions')
                .then(function (result) {
                    // //console.log(result.data);
                    store.dispatch({ type: 'CONDITION_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST_EMPLOYEE: function (id) {
            // //console.log(id);
            axios.get('/user_welfare/id/' + id)
                .then(function (result) {
                    // //console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST_EMPLOYEE', payload: result.data })
                })
                .catch(err => {

                })
        }
    }
    ]

}
