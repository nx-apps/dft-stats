import axios from '../axios'
import { commonAction } from '../config'
// var groupArray = require('group-array');
import groupArray from './../../../../node_modules/group-array'
const initialState = {
    select: {},
    settingGroup: [],
    list: [],
    date: { sdate: '', edate: '' },
    hamonizeCodeYear: [],
    hamonizeCodeChild: [],
    list_rice: [],
    rice_list: [],
    hamonizeYear: [],
    hamonizeList: [],
    hamonizeListNoGroup: []
    // listFiles:[]
}

export function hamonizeReducer(state = initialState, action) {

    switch (action.type) {
        case 'HAMONIZE_SET_DATE':
            return Object.assign({}, state, { date: action.payload });
        case 'SETTINGGROUP':
            return Object.assign({}, state, { settingGroup: action.payload });
        // case 'HAMONIZE_CODE_GET':
        //     return Object.assign({}, state, { hamonizeCodeYear: action.payload });
        // case 'HAMONIZE_CODE_GET_CHILD':
        //     return Object.assign({}, state, { hamonizeCodeChild: action.payload });
        // case 'HAMONIZE_CODE_SEARCH_R1':
        //     return Object.assign({}, state, { list: action.payload });
        case 'HAMONIZE_RICE_LIST_GROUP_YEAR':
            return Object.assign({}, state, { hamonizeYear: action.payload })
        case 'HAMONIZE_RICE_LIST_GROUP':
            return Object.assign({}, state, { hamonizeList: action.payload })
        case 'HAMONIZE_RICE_GET_LIST':
            return Object.assign({}, state, { rice_list: action.payload })
        case 'HAMONIZE_RICE_LIST':
            return Object.assign({}, state, { hamonizeListNoGroup: action.payload })
        default:
            return state
    }

}

export function hamonizeAction(store) {
    return [commonAction(), {
        HAMONIZE_SET_DATE() {
            let date = new Object()
            let today = new Date(new Date().setFullYear(new Date().getFullYear()))
            ////console.log(today);
            date.dateStart = today.toISOString().split('T')[0]
            date.dateEnd = date.dateStart
            // date.dateEnd = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0]
            ////console.log(date.edate);
            store.dispatch({ type: 'HAMONIZE_SET_DATE', payload: date })
        },
        SETTINGGROUP() {
            axios.get(window._config.externalServerCommon + '/api/group')
                .then((response) => {
                    store.dispatch({ type: 'SETTINGGROUP', payload: response.data })
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        // HAMONIZE_CODE_GET(data) {
        //     // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        //     axios.get('./hamonize/ricelist')
        //         .then((response) => {
        //             let year = groupArray(response.data, 'hamonize_year')
        //             let yearData = []
        //             for (var variable in year) {
        //                 yearData.push({
        //                     year: variable
        //                 })
        //                 // //console.log(variable);
        //             }
        //             store.dispatch({ type: 'HAMONIZE_CODE_GET', payload: yearData })
        //             // return ha
        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },
        // HAMONIZE_CODE_GET_CHILD(hmparent) {
        //     this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
        //     axios.get('/hamonize/child?' + hmparent)
        //         .then((response) => {
        //             // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
        //             // //console.log(response.data);
        //             if (response.data.length > 0) {
        //                 response.data.map((check) => {
        //                     check.checks = true
        //                 })
        //                 this.fire('toast', {
        //                     status: 'success', text: 'ค้นหาสำเร็จ', callback() {
        //                         // store.dispatch({ type: 'HAMONIZE_CODE_SEARCH_R1', payload: response.data })
        //                     }
        //                 });
        //             } else {
        //                 this.fire('toast', {
        //                     status: 'error', text: 'ไม่พบข้อมล',
        //                     callback: () => {
        //                         // this.$$('panel-right').close();
        //                     }
        //                 });
        //             }
        //             // //console.log(1111);
        //             store.dispatch({ type: 'HAMONIZE_CODE_GET_CHILD', payload: response.data })
        //             // return ha
        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },
        // HAMONIZE_CODE_SEARCH_R1(data = '') {
        //     this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
        //     // //console.log(data);
        //     axios.get('/hamonize/re01?' + data)
        //         .then((response) => {
        //             ////console.log(response);
        //             this.fire('toast', {
        //                 status: 'success', text: 'ค้นหาสำเร็จ', callback() {
        //                     store.dispatch({ type: 'HAMONIZE_CODE_SEARCH_R1', payload: response.data })
        //                 }
        //             });

        //         })
        //         .catch(function (error) {
        //             ////console.log(error);
        //         });
        // },
        HAMONIZE_RICE_LIST_GROUP() {
            axios.get(window._config.externalServerCommon + '/api/groupItem?group_id=1a324474-0940-4aa9-b4fd-0b98b9e4ce5c')
                .then(function (response) {
                    // console.log(response.data);
                    var hamonizeList = response.data.reduce(function (prev, curr) {
                        return [...prev, ...curr.sub];
                    }, []);
                    // for (var index = 0; index < hamonizeList.length; index++) {
                    //     // response.data[index].label = ''
                    //     hamonizeList[index].label = '[' + hamonizeList[index].hamonize_code + '] ' + hamonizeList[index].hamonize_th
                    //     // console.log(response.data[index].hamonize.hamonize_en );
                    // }
                    let lisyYear = []
                    let groupYear = groupArray(hamonizeList, 'hamonize_year')
                    for (var variable in groupYear) {
                        if (groupYear.hasOwnProperty(variable)) {
                            lisyYear.push({ label: variable, value: variable })
                        }
                    }
                    for (var index = 0; index < response.data.length; index++) {
                        for (var index2 = 0; index2 < response.data[index].sub.length; index2++) {
                            response.data[index].sub[index2].check = false
                        }
                    }
                    let xData = { year: lisyYear, hamonize: hamonizeList }
                    store.dispatch({ type: 'HAMONIZE_RICE_LIST_GROUP', payload: response.data })
                    // console.log(xData);
                    // console.log(response.data);
                    store.dispatch({ type: 'HAMONIZE_RICE_LIST_GROUP_YEAR', payload: xData })

                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        HAMONIZE_RICE_LIST() {
            // axios.get(window._config.externalServerCommon + '/api/hamonize?orderby=hamonize_code_num')
            axios.get('./hamonize/ricelist')
                .then((response) => {
                    for (var index = 0; index < response.data.length; index++) {
                        response.data[index].check = false
                        // this.set('hamonizeListNoGroup.' + index + '.check', false)
                    }
                    store.dispatch({ type: 'HAMONIZE_RICE_LIST', payload: response.data });;
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        HAMONIZE_RICE_GET(data) {
            // //console.log(data);
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
