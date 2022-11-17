import React from 'react';
import App from '../../common/App.jsx';
import {message} from "antd";
import {InputItem, Toast} from 'antd-mobile';
import {KvStorage, U} from "../../common";
import "../../assets/css/login.scss";

const tabs = ['账户登录', '新用户注册']

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activityIndex: 0,
            user: {},
            code: '',
            lessTime: 0,
            timeL: null,
            isSendCode: false,
        }
    }


    componentDidMount() {
    }


    register = () => {
        let {user, code} = this.state;
        App.api(`usr/user/save`, {user: JSON.stringify(user), code}).then(() => {
            this.setState({
                activityIndex: 0
            })
        })
    }


    onSubmit = () => {
        let {user} = this.state;
        let {mobile = '', password = ''} = user;
        if (!U.str.isChinaMobile(mobile)) {
            message.warn('请输入正确的手机号')
        } else if (U.str.isEmpty(password)) {
            message.warn('请输入密码')
        } else {
            App.api('usr/user/signin', {
                    mobile: user.mobile,
                    password: user.password,
                }
            ).then(res => {
                let {user = {}, userSession = {}} = res;

                KvStorage.set('user-profile', JSON.stringify(user));
                KvStorage.set('user-token', userSession.token);
                App.go(``);
            });
        }
    }

    sendCode = (mobile) => {
        let {isSendCode, lessTime = 0, timeL} = this.state;
        !isSendCode && App.api(`usr/user/register_code`, {mobile: mobile}).then(() => {
            Toast.success("验证码发送成功");
            this.setState({lessTime: 60, isSendCode: true})
            timeL = setInterval(this.time, 1000)
            this.setState({timeL})
        });
    };
    time = () => {
        let {lessTime = 0, timeL} = this.state;
        if (lessTime < 1) {
            clearInterval(timeL)
            this.setState({isSendCode: false});
        } else {
            lessTime = --lessTime;
            lessTime = lessTime < 10 ? "0" + lessTime : lessTime
            this.setState({lessTime});
        }
    }

    render() {
        let {activityIndex = 0, user = {}, lessTime, code, isSendCode = false} = this.state
        let {mobile = '', password = ''} = user;
        let isLogin = activityIndex === 0;
        let isNotEmpty = (mobile.length > 0) || (password.length > 0) || (code.length > 0);

        return (
            <div className='login'>


                <div className='sc-logo'><img style={{width: '200px', height: '38px'}}
                                              src={require('../../assets/3cimages/icon/logo/logo-black.png')}/></div>
                <div className='user'>

                    <div className="tabs">
                        {tabs.map((name, index) => {
                            return <div className={activityIndex === index ? "tab activity-tab" : 'tab'}
                                        key={index}
                                        onClick={() => {
                                            this.setState({activityIndex: index})
                                        }}>{name}
                                {activityIndex === index && <div className='under-line'/>}
                            </div>

                        })}

                    </div>

                    <InputItem
                        className='input-username'
                        placeholder='请输入手机号码'
                        onChange={(value) => {
                            this.setState({
                                user: {
                                    ...user,
                                    mobile: value
                                }
                            })
                        }}
                    />
                    <InputItem
                        className='input-password'
                        type='password'
                        placeholder='请输入6-20位密码'
                        onChange={(value) => {
                            this.setState({
                                user: {
                                    ...user,
                                    password: value
                                }
                            })
                        }}
                    />

                    {!isLogin &&
                    <InputItem extra={lessTime > 0 ? `${lessTime}s` : '获取验证码'}
                               onExtraClick={() => {
                                   this.sendCode(mobile)
                               }}
                               className='input-code'
                               placeholder='请输入验证码'
                               onChange={(value) => {
                                   this.setState({
                                       code: value
                                   })
                               }}
                    />}

                </div>
                <div className={!isNotEmpty ? "button-login button-login-active" : 'button-login'} onClick={() => {
                    isLogin ? this.onSubmit() : this.register()
                }}>{isLogin ? '登录' : '注册'}</div>
                <div className='forget-password'>{isLogin ? '忘记密码？' : '注册即代表你同意《3c家生活用户协议》'}</div>
            </div>
        );
    }

}

export default Login;