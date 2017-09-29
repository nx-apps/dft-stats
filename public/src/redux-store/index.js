import {createStore,combineReducers} from 'redux'
import PolymerRedux from 'polymer-redux'
import {dispatchActionBehavior} from './config'
import axios from './axios'
import {commonSystemReducer,commonSystemAction} from './reducer/commonSystem'
import {authReducer,authAction} from './reducer/auth'
import {providerReducer,providerAction} from './reducer/provider'
import {uploadReducer,uploadAction} from './reducer/upload'

import {hamonizeReducer,hamonizeAction} from './reducer/hamonize'
import {companyReducer,companyAction} from './reducer/company'
import {licenseReducer,licenseAction} from './reducer/license'
import {countryReducer,countryAction} from './reducer/country'
import {pricehamonizeReducer,pricehamonizeAction} from './reducer/pricehamonize'
import {searchReducer,searchAction} from './reducer/search'
import {reportReducer,reportAction} from './reducer/report'
import {searchCustomsReducer,searchCustomsAction} from './reducer/searchCustoms'



import {certReducer,certAction} from './reducer/cert'

const rootReducer = combineReducers({
    commonSystem:commonSystemReducer,
    auth:authReducer,
    provider:providerReducer,
    upload:uploadReducer,

    hamonize:hamonizeReducer,
    company:companyReducer,
    country:countryReducer,
    license:licenseReducer,
    cert:certReducer,
    pricehamonize:pricehamonizeReducer,
    search:searchReducer,
    searchCustoms:searchCustomsReducer,
    report:reportReducer,
});
const storeApp = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.ReduxBehavior = [PolymerRedux(storeApp),dispatchActionBehavior()];
window.dispatchActionBehavior = dispatchActionBehavior();
window.axios = axios;
window.commonSystemAction = commonSystemAction(storeApp);
window.authAction = authAction(storeApp);
window.providerAction = providerAction(storeApp);
window.uploadAction = uploadAction(storeApp);

window.hamonizeAction = hamonizeAction(storeApp);
window.companyAction = companyAction(storeApp);
window.companyAction = companyAction(storeApp);
window.countryAction = countryAction(storeApp);
window.certAction = certAction(storeApp);
window.pricehamonizeAction = pricehamonizeAction(storeApp);
window.searchAction = searchAction(storeApp);
window.searchCustomsAction = searchCustomsAction(storeApp);
window.reportAction = reportAction(storeApp);