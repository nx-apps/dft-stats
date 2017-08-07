import axios from '../axios'
import { commonAction } from '../config'
// var groupArray = require('group-array');
import groupArray from './../../../../node_modules/group-array'
const initialState = {
    select: {},
    list: [],
    date: { sdate: '', edate: '' },
    hamonizeCodeYear: [],
    hamonizeCodeChild: [],
    list_rice: [],
    rice_list: []
    // listFiles:[]
}

export function hamonizeReducer(state = initialState, action) {

    switch (action.type) {
        case 'HAMONIZE_SET_DATE':
            return Object.assign({}, state, { date: action.payload });
        case 'HAMONIZE_CODE_GET':
            return Object.assign({}, state, { hamonizeCodeYear: action.payload });
        case 'HAMONIZE_CODE_GET_CHILD':
            return Object.assign({}, state, { hamonizeCodeChild: action.payload });
        case 'HAMONIZE_CODE_SEARCH_R1':
            return Object.assign({}, state, { list: action.payload });
        case 'HAMONIZE_RICE_LIST':
            return Object.assign({}, state, { list_rice: action.payload })
        case 'HAMONIZE_RICE_GET_LIST':
            return Object.assign({}, state, { rice_list: action.payload })
        default:
            return state
    }

}

export function hamonizeAction(store) {
    return [commonAction(), {
        HAMONIZE_SET_DATE() {
            let date = new Object()
            let today = new Date(new Date().setFullYear(new Date().getFullYear()))
            //console.log(today);
            date.dateStart = '2017-01-01'//today.toISOString().split('T')[0]
            date.dateEnd = '2017-01-15'//new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0]
            //console.log(date.edate);
            store.dispatch({ type: 'HAMONIZE_SET_DATE', payload: date })
        },
        HAMONIZE_CODE_GET(data) {
            // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
            axios.get('./hamonize/ricelist')
                .then((response) => {
                    let year = groupArray(response.data, 'hamonize_year')
                    let yearData = []
                    for (var variable in year) {
                        yearData.push({
                            year: variable
                        })
                        // console.log(variable);
                    }
                    store.dispatch({ type: 'HAMONIZE_CODE_GET', payload: yearData })
                    // return ha
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        HAMONIZE_CODE_GET_CHILD(hmparent) {
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            axios.get('/hamonize/child?' + hmparent)
                .then((response) => {
                    // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
                    // console.log(response.data);
                    if (response.data.length > 0) {
                        response.data.map((check) => {
                            check.checks = true
                        })
                        this.fire('toast', {
                            status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                                // store.dispatch({ type: 'HAMONIZE_CODE_SEARCH_R1', payload: response.data })
                            }
                        });
                    } else {
                        this.fire('toast', {
                            status: 'error', text: 'ไม่พบข้อมล',
                            callback: () => {
                                // this.$$('panel-right').close();
                            }
                        });
                    }
                    // console.log(1111);
                    store.dispatch({ type: 'HAMONIZE_CODE_GET_CHILD', payload: response.data })
                    // return ha
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        HAMONIZE_CODE_SEARCH_R1(data = '') {
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            // console.log(data);
            axios.get('/hamonize/re01?' + data)
                .then((response) => {
                    //console.log(response);
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'HAMONIZE_CODE_SEARCH_R1', payload: response.data })
                        }
                    });

                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        HAMONIZE_RICE_LIST() {
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            axios.get('./hamonize/ricelist')
                .then((response) => {
                    let year = groupArray(response.data, 'hamonize_year')
                    let yearData = []
                    for (var variable in year) {
                        yearData.push({
                            year: variable
                        })
                        // console.log(variable);
                    }
                    store.dispatch({ type: 'HAMONIZE_CODE_GET', payload: yearData })
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback() {
                            store.dispatch({ type: 'HAMONIZE_RICE_LIST', payload: response.data });
                        }
                    });
                })
        },
        HAMONIZE_RICE_GET(data) {
            // console.log(data);
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            axios.post('./hamonize/get', data)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'HAMONIZE_RICE_GET_LIST', payload: response.data });
                        }
                    });
                })
        }
    }]
};
