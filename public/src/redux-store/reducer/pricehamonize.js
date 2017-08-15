import axios from '../axios'
import { commonAction } from '../config'
const cutDataInObject = (data, namePop) => {
  data = JSON.parse(JSON.stringify(data))
  for (var key in data) {
    for (var index = 0; index < namePop.length; index++) {
      if (namePop[index] === key) {
        let time = new Date(data[key])
        data[key] = new Date(time.setHours(time.getHours() + 7)).toISOString()
        data[key] = data[key].split("T")[0]
      }
    }
  }
  return data
}
const initialState = {
  list: [],
  cost: []
}

export function pricehamonizeReducer(state = initialState, action) {

  switch (action.type) {
    case 'PRICEHAMONIZE_SEARCH':
      return Object.assign({}, state, { list: action.payload });
    case 'PRICEHAMONIZE_COST_SEARCH':
      return Object.assign({}, state, { cost: action.payload });
    default:
      return state
  }

}

export function pricehamonizeAction(store) {
  return [commonAction(), {
    PRICEHAMONIZE_SEARCH(date) {
      this.fire('toast', { status: 'load', text: 'กำลังค้นหาข้อมูล...' })
      // console.log(date); 
      axios.get('price/today?priceDate=' + date.dateStart)
        .then((response) => {
          this.fire('toast', {
            status: 'success', text: 'ค้นหาสำเร็จ', callback() {
              store.dispatch({ type: 'PRICEHAMONIZE_SEARCH', payload: response.data })
            }
          });
        })
        .catch(function (error) {
          ////console.log(error);
        });
    },
    PRICEHAMONIZE_SAVE(data, search) {
      this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
      // console.log(data); 
      axios.put('/price/update/', data)
        .then((res) => {
          // console.log(res);
          this.fire('toast', {
            status: 'success', text: 'บันทึกสำเร็จ', callback() {

            }
          });
          this.dispatchAction('PRICEHAMONIZE_SEARCH', search)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    PRICEHAMONIZE_COST_SEARCH(date) {
      // this.fire('toast',{status:'load',text:'กำลังค้นหาข้อมูล...'})
      // console.log(date); 
      axios.get('cost/today?costDate=' + date.dateStart)
        .then((response) => {
          // cutDataInObject(response.data, [ 'contract_date']
          let data = cutDataInObject(response.data, ['cost_date'])
          // console.log(data);
          // this.fire('toast',{status:'success',text:'ค้นหาสำเร็จ',callback(){
          store.dispatch({ type: 'PRICEHAMONIZE_COST_SEARCH', payload: data })
          // }});
        })
        .catch(function (error) {
          ////console.log(error);
        });
    },
    PRICEHAMONIZE_COST_SAVE(data, search) {
      this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
      // console.log(data);
      axios.put('/cost/update/', data)
        .then((response) => {
          // console.log(data);
          this.dispatchAction('PRICEHAMONIZE_COST_SEARCH', search)
          this.fire('toast', {
            status: 'success', text: 'บันทึกสำเร็จ', callback() {

            }
          });
        })
        .catch(function (error) {
          ////console.log(error);
        });
    },

  }]
};
