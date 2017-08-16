import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    select: {},
    list: [],
    fileIdUpload: {},
    // listFiles:[]
}

export function uploadReducer(state = initialState, action) {

    switch (action.type) {
        case 'UPLOAD_LIST':
            return Object.assign({}, state, { list: action.payload });
        // case 'UPLOAD_LIST':
        //     return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }

}

export function uploadAction(store) {
    return [commonAction(), {
        UPLOAD_LIST() {
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            // //console.log(data); 
            axios.get('/upload')
                .then((response) => {
                    // console.log(response);
                    this.fire('toast', {
                        status: 'success', text: 'ค้นหาสำเร็จ', callback() {
                            store.dispatch({ type: 'UPLOAD_LIST', payload: response.data })
                        }
                    });
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        },
        UPLOAD_MC(file) {
            // console.log(data);
            this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
            var data = new FormData()
            data.append('file', file[0])
            axios.post('/upload/mc/', data)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: ()=> {
                            this.UPLOAD_LIST()
                        }
                    });
                })
                .catch(function (error) {
                    ////console.log(error);
                });
        }
    }]
};
