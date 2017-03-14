import {createStore,combineReducers} from 'redux'
import PolymerRedux from 'polymer-redux'
import {dispatchActionBehavior} from './config'
import axios from './axios'
import {commonSystemReducer,commonSystemAction} from './reducer/commonSystem'
import {authReducer,authAction} from './reducer/auth'
import {providerReducer,providerAction} from './reducer/provider'
import {userWelfareReducer,userWelfareAction} from './reducer/userWelfare'
import {welfareReducer,welfareAction} from './reducer/welfare'
import {groupWelfareReducer,groupWelfareAction} from './reducer/groupWelfare'
import {commonDataReducer,commonDataAction} from './reducer/commonData'
import {usersReducer,usersAction} from './reducer/users'
import {conditionReadWelfareReducer,conditionReadWelfareAction} from './reducer/conditionReadWelfare'
import {uploadReducer,uploadAction} from './reducer/upload'
const rootReducer = combineReducers({
    commonSystem:commonSystemReducer,
    auth:authReducer,
    provider:providerReducer,
    userWelfare:userWelfareReducer,
    welfare:welfareReducer,
    groupWelfare:groupWelfareReducer,
    commonData:commonDataReducer,
    users:usersReducer,
    conditionReadWelfare:conditionReadWelfareReducer,
    upload:uploadReducer,
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
window.userWelfareAction = userWelfareAction(storeApp);
window.welfareAction = welfareAction(storeApp);
window.groupWelfareAction = groupWelfareAction(storeApp);
window.commonDataAction = commonDataAction(storeApp); 
window.usersAction = usersAction(storeApp);
window.conditionReadWelfareAction = conditionReadWelfareAction(storeApp);
window.uploadAction = uploadAction(storeApp);
