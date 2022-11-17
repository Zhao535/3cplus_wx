import React from 'react';

import '../assets/css/home-wrap.scss';
import { Utils } from "../common";
import NavLink from "../common/NavLink";

export default class HomeWrap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                Utils.common.scrollTop();
            }, 500);
        });
    }

    render() {
        return <div className='home-wrap'>
            <div className='inner-page'>
                {this.props.children}
            </div>

            <ul className='btm-menu'>
                <li><NavLink to='/home'><i className='home' /><p>首页</p></NavLink></li>
                <li><NavLink to='/choose'><i className='choose' /><p>选购</p></NavLink></li>
                <li><NavLink to='/merchants'><i className='merchants' /><p>门店</p></NavLink></li>
                <li><NavLink to='/shopping-cart'><i className='shopping-cart' /><p>购物袋</p></NavLink></li>
                <li><NavLink to='/profile'><i className='profile' /><p>我的</p></NavLink></li>
            </ul>

        </div>;
    }
}
