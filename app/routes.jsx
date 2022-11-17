import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
//首页
import HomeWrap from './component/HomeWrap';
import Home from './component/Home';
import Choose from './component/Choose';
import Cates from './component/Cates';
import Product from './component/product/Product';
import Profile from './component/profile/Profile';
import Merchant from './component/merchant/Merchant';
import Login from "./component/login/Login";
import ShoppingCart from "./component/cart/Cart";
import Merchants from "./component/merchant/Merchants";
import SceneShopping from "./component/scene/SceneShopping";
import Scenes from "./component/scene/Scenes";
import Collects from "./component/profile/Collects";
import Articles from "./component/article/Articles";
import Article from "./component/article/Article";
import Message from "./component/profile/Message";
import Focus from "./component/profile/Focus";
import ProfileEdit from "./component/profile/ProfileEdit";
import MobileChange from "./component/profile/MobileChange";
import UserLocation from "./component/profile/UserLocation";
import LocationEdit from "./component/profile/LocationEdit";
import Trade from "./component/trade/Trade";
import Trades from "./component/trade/Trades";
import TradeDetail from "./component/trade/TradeDetail";
import Products from "./component/product/Products";
import Pay from "./component/trade/Pay";
import Bill from "./component/profile/Bill";
import Coupons from "./component/Coupon/Coupons";
import GeneralCoupon from "./component/Coupon/GeneralCoupon";
const routes = (
    <HashRouter>
        <Switch>

            <Redirect exact from='/' to='/home'/>

            <Route path='/cates' component={Cates}/>
            <Route path='/product/:id/:secKillId' component={Product}/>
            <Route path='/merchant/:id' component={Merchant}/>
            <Route path='/login' component={Login}/>
            <Route path='/scene/:id' component={SceneShopping}/>
            <Route path='/scenes' component={Scenes}/>
            <Route path='/collects' component={Collects}/>
            <Route path='/articles' component={Articles}/>
            <Route path='/article/:id' component={Article}/>
            <Route path='/message' component={Message}/>
            <Route path='/focus' component={Focus}/>
            <Route path='/profile-edit' component={ProfileEdit}/>
            <Route path='/mobile-change/:mobile' component={MobileChange}/>
            <Route path='/user-location' component={UserLocation}/>
            <Route path='/location-edit/:id' component={LocationEdit}/>
            <Route path='/trade/:ids' component={Trade}/>
            <Route path='/trades/:type' component={Trades}/>
            <Route path='/trade-detail/:id' component={TradeDetail}/>
            <Route path='/products/:categoryId/:brandId' component={Products}/>
            <Route path='/pay/:id/:billId' component={Pay}/>
            <Route path='/bill' component={Bill}/>
            <Route path='/coupons' component={Coupons}/>
            <Route path='/general-coupon' component={GeneralCoupon}/>


            <Route path='/' children={() => (
                <HomeWrap>
                    <Switch>
                        <Route path='/home' component={Home}/>
                        <Route path='/choose' component={Choose}/>
                        <Route path='/merchants' component={Merchants}/>
                        <Route path='/shopping-cart' component={ShoppingCart}/>
                        <Route path='/profile' component={Profile}/>
                    </Switch>
                </HomeWrap>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);

export default routes;
