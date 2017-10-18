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

// window.ReduxBehavior = [PolymerRedux(storeApp),dispatchActionBehavior()];
// window.dispatchActionBehavior = dispatchActionBehavior();
window.preReduxBehavior = PolymerRedux(storeApp)
window.preDispatchActionBehavior = dispatchActionBehavior()
window.dispatchActionBehavior = dispatchActionBehavior()

window.axios = axios;
window.precommonSystemAction = commonSystemAction(storeApp);
window.preauthAction = authAction(storeApp);
window.preproviderAction = providerAction(storeApp);
window.preuploadAction = uploadAction(storeApp);

window.prehamonizeAction = hamonizeAction(storeApp);
window.precompanyAction = companyAction(storeApp);
window.precountryAction = countryAction(storeApp);
window.precertAction = certAction(storeApp);
window.prepricehamonizeAction = pricehamonizeAction(storeApp);
window.presearchAction = searchAction(storeApp);
window.presearchCustomsAction = searchCustomsAction(storeApp);
window.prereportAction = reportAction(storeApp);