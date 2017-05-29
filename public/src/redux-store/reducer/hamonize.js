import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    select: {},
    list: [],
    date: { sdate: '', edate: '' },
    hamonizeCodeList: [],
    hamonizeCodeChild: []
    // listFiles:[]
}

export function hamonizeReducer(state = initialState, action) {

    switch (action.type) {
        case 'HAMONIZE_SET_DATE':
            return Object.assign({}, state, { date: action.payload });
        case 'HAMONIZE_CODE_GET':
            return Object.assign({}, state, { hamonizeCodeList: action.payload });
        case 'HAMONIZE_CODE_GET_CHILD':
            return Object.assign({}, state, { hamonizeCodeChild: action.payload });
        case 'HAMONIZE_CODE_SEARCH_R1':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }

}

export function hamonizeAction(store) {
    return [commonAction(), {
        HAMONIZE_SET_DATE() {
            let date = new Object()
            let today = new Date(new Date().setFullYear(new Date().getFullYear() -1))
            //console.log(today);
            date.sdate = today.toISOString().split('T')[0]
            date.edate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0]
            //console.log(date.edate);
            store.dispatch({ type: 'HAMONIZE_SET_DATE', payload: date })
        },
        HAMONIZE_CODE_GET(data) {
            // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
            axios.get('/hamonize/codelist')
                .then((response) => {
                    // this.fire('toast',{status:'load',text:'กำลังบันทึกข้อมูล...'})
                    // console.log(response.data);
                    store.dispatch({ type: 'HAMONIZE_CODE_GET', payload: response.data })
                    // return ha
                })
                .catch(function (error) {
                    //console.log(error);
                });
        },
        HAMONIZE_CODE_GET_CHILD(hmparent) {
            this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
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
                    console.log(1111);
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
    }]
};
