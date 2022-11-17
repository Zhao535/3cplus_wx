import React from 'react';
import '../../assets/css/profile.scss';
import {Badge} from 'antd';
import {App, KvStorage} from "../../common";
import {TitleBar, TopBar, RenderSex} from "../Comps";
import {Utils, U} from "../../common";
import CollectUtils from "../../allData/CollectUtils";


export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            token: KvStorage.get('user-token') || '',
            user: {},
            focusNum: 0,
            collectNum: 0,
            userCoupons:[]
        };
    }

    componentDidMount() {
        U.setWXTitle('个人中心')
        this.loadData();
        this.loadUserCoupon();
    }

    loadData = () => {
        if (Utils.token()) {
            App.api(`usr/user/profile`).then((user) => {
                this.setState({user})
            })
        } else {
            App.go(`/login`)
        }
    }

    loadUserCoupon=()=> {
        App.api(`usr/coupon/user_coupons`,{status:1}).then((result)=>{
            this.setState({
                userCoupons:result
            })
        })
    }

    goEdit = () => {
        App.go('/profile-edit');
    }


    goLocation = () => {
        App.go('/user-location')
    }

    render() {
        let {user,userCoupons=[]} = this.state;
        let {id, avatar, name, sex, mobile, focusNum, collectNum} = user;

        return <div className='profile-page'>
            <div className='profile-top'>
                <div className='avatar-edit'>
                    <img className='usr-avatar' src={avatar ? avatar : require('../../assets/3cimages/icon/avatar.png')}/>
                    <div className='edit' onClick={() => {
                        this.goEdit()
                    }}>编辑资料
                    </div>
                </div>
                <div className='usr-detail'>
                    <div className='usr-name'>
                        <div className='name' >{name}</div>
                        <RenderSex sex={sex}/>
                    </div>
                </div>
                <div className='usr-id'>
                    {mobile}
                </div>
                <ul className='usr-collect'>
                    <li className='collect' onClick={() => {
                        App.go(`/collects`)
                    }}>
                        收藏 <span>{U.formatNumber.num(collectNum)}</span>
                    </li>
                    <li className='collect' onClick={() => {
                        App.go(`/focus`)
                    }}>
                        关注 <span>{U.formatNumber.num(focusNum)}</span>
                    </li>
                    <li className='collect' onClick={()=>{
                    App.go(`/coupons`)
                    }
                    }>
                        优惠券 <span>{userCoupons.length}</span>
                    </li>
                </ul>
                <div className='orders'>订单中心</div>
                <ul className='orders-icon'>
                    <li className='icons'onClick={()=>{
                        App.go(`/trades/${1}`)
                    }}>
                        <img className='icon' src={require('../../assets/3cimages/icon/order-icon/unpaid.png')}/>
                        <div className='order-icon-name'>待付款</div>
                    </li>
                    <li className='icons' onClick={()=>{
                        App.go(`/trades/${3}`)
                    }}>
                        <img className='icon' src={require('../../assets/3cimages/icon/order-icon/unreceive.png')}/>
                        <div className='order-icon-name'>待收货</div>
                    </li>
                    <li className='icons' >
                        <img className='icon' src={require('../../assets/3cimages/icon/order-icon/unconmment.png')}/>
                        <div className='order-icon-name'>待评价</div>
                    </li>
                    <li className='icons'  onClick={()=>{
                        App.go(`/trades/${0}`)
                    }} >
                        <img className='icon' src={require('../../assets/3cimages/icon/order-icon/all-orders.png')}/>
                        <div className='order-icon-name'>全部订单</div>
                    </li>
                </ul>
            </div>

            <ul className='more-option'>
                <li className='option' onClick={() => {
                    App.go('/message')
                }}>
                    <div className='option-name'>消息</div>
                    <img className='right-arrow'
                         src={require('../../assets/3cimages/icon/order-icon/right-arrow.png')}/>
                </li>
                <li className='option'>
                    <div className='option-name'>浏览记录</div>
                    <img className='right-arrow'
                         src={require('../../assets/3cimages/icon/order-icon/right-arrow.png')}/>
                </li>
                <li className='option'>
                    <div className='option-name' onClick={() => {
                        this.goLocation()
                    }}>地址管理
                    </div>
                    <img className='right-arrow'
                         src={require('../../assets/3cimages/icon/order-icon/right-arrow.png')}/>
                </li>
                <li className='option'>
                    <div className='option-name'>设置</div>
                    <img className='right-arrow'
                         src={require('../../assets/3cimages/icon/order-icon/right-arrow.png')}/>
                </li>
            </ul>
            {/*<div onClick={() => {*/}
            {/*    KvStorage.remove('user-profile')*/}
            {/*    KvStorage.remove('user-token')*/}
            {/*}}>logout*/}
            {/*</div>*/}
        </div>;
    }
}
