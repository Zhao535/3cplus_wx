import React from 'react';
import {_DATA, App, U} from "../../common";
import '../../assets/css/change-mobile.scss';
import {InputItem, Toast} from "antd-mobile";
import classNames from "classnames";

export default class ChangeMobile extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            mobile: this.props.match.params.mobile,
            lessTime: 60,
            isSendCode: false,
        };
    }

    componentDidMount () {
        U.setWXTitle('修改手机号');
    }

    changeData = (value) => {
        this.setState({newMobile: value})
    }

    sendSms = () => {
        let {isSendCode, newMobile} = this.state;
        if (U.str.isEmpty(newMobile)) {
            Toast.info("请输入新手机号")
            return;
        }
        if (newMobile.length !== 11) {
            Toast.info("请输入11位手机号")
            return;
        }
        !isSendCode && App.api(`usr/user/send_change_mobile_code`, {username: newMobile, subject: "change-mobile"}).then(() => {
            this.setState({isSendCode: true})
            let {lessTime} = this.state;
            let timeL = setInterval(() => {
                    this.setState({lessTime: lessTime - 1})
                    if (lessTime < 1) {
                        clearInterval(timeL)
                        this.setState({lessTime: 60, isSendCode: false})
                    }
                }
                , 1000)
        })
    }

    submit = () => {
        let {newMobile, code} = this.state;
        if (U.str.isEmpty(newMobile)) {
            Toast.info("请输入新手机号")
            return;
        }
        if (newMobile.length !== 11) {
            Toast.info("请输入正确的手机号")
            return;
        }
        if (U.str.isEmpty(code)) {
            Toast.info("请输入验证码")
            return;
        }
        if (code.length !== 6) {
            Toast.info("请输入6位验证码")
            return;
        }
        App.api(`usr/user/change-mobile`, {newMobile, code}).then(() => {
            Toast.success("更换手机号成功")
            App.go(`/signin`)
        })
    }


    stopTimeL = () => {
        clearInterval()
    }

    changeSendStyle = (value) => {
        this.setState({code: value})
    }

    render () {
        let {mobile, newMobile, isSendCode, code, lessTime} = this.state;

        const save = newMobile && code;

        if (lessTime === 0) {
            this.stopTimeL()
        }

        return <div className='change-mobile-page'>
            <div className="page-bg">
                <p>原手机号：{mobile}</p>

                <div className="signin-phone">
                    <InputItem placeholder="请输入手机号码" value={newMobile} maxLength={11} onChange={(value) => {
                        this.changeData(value)
                    }}/>
                </div>

                <div className="send-code">
                    <InputItem placeholder={isSendCode ? "请输入验证码" : "请点击右侧获取验证码"} maxLength={6}
                               value={code}
                               onChange={(value) => {
                                   this.changeSendStyle(value)
                               }}/>
                    <span className={isSendCode ? "ed-send-code" : "wait-send-code"} onClick={() => {
                        this.sendSms()
                    }}>{isSendCode ? lessTime + "s" : "获取验证码"}</span>
                </div>

                <div className={classNames("save-btm", {"save-btm-allow": save})} onClick={() => {
                    if (save) {
                        this.submit()
                    }
                }}>
                    <p className="save-p">保存</p>
                </div>
            </div>
        </div>;
    }
}
