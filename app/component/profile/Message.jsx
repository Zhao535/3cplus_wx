import React from 'react';
import {Utils, U, App} from "../../common";
import '../../assets/css/message.scss';
import {TopBar} from "../Comps";

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: 0,
        }
    }

    componentDidMount() {
        U.setWXTitle('消息')
    }


    render() {
        let {activeKey = 0} = this.state;
        return (
            <div className='message-page'>
                <ul className='message-type'>
                    <li key={1} className='message'>
                        <img className='message-icon' src={require('../../assets/3cimages/icon/system-message.png')}/>
                        <div className='have-message'>
                            <div className='type'>系统消息</div>
                            <div className='is-have'>暂无消息</div>
                        </div>
                        <img className='arrow-icon' src={require('../../assets/3cimages/merchant/arrow.png')}/>
                    </li>

                    <li key={2} className='message'>
                        <img className='message-icon' src={require('../../assets/3cimages/icon/merchant-mesage.png')}/>
                        <div className='have-message'>
                            <div className='type'>店铺消息</div>
                            <div className='is-have'>你有消息未读</div>
                        </div>
                        <img className='arrow-icon' src={require('../../assets/3cimages/merchant/arrow.png')}/>
                    </li>

                    <li key={3} className='message' onClick={() => {
                        App.go(`/bill`)
                    }}>
                        <img className='message-icon' src={require('../../assets/3cimages/icon/order-message.png')}/>
                        <div className='have-message'>
                            <div className='type'>订单消息</div>
                            <div className='is-have'>暂无消息</div>
                        </div>
                        <img className='arrow-icon' src={require('../../assets/3cimages/merchant/arrow.png')}/>
                    </li>
                </ul>

            </div>
        );
    }
}

export default Message;