import React from 'react';
import ReactDOM from 'react-dom';
import routers from './routes';
import {LocaleProvider} from 'antd-mobile';
import 'assets/css/common.scss';
import Carts from "./component/cart/Carts";
import {Provider} from "mobx-react";

if (module.hot)
    module.hot.accept();

const stores = {
    carts: new Carts()
};


ReactDOM.render(
    <LocaleProvider><Provider {...stores}>{routers}</Provider></LocaleProvider>, document.getElementById('root'));

// ReactDOM.render(
//     <LocaleProvider>{routers}</LocaleProvider>, document.getElementById('root'));
