import React from 'react';
import {App, KvStorage, Utils, U, CTYPE} from "../../common";
import "../../assets/css/profileEdit.scss";
import {Picker, Toast} from "antd-mobile";
import ListItem from "antd-mobile/es/list/ListItem"
import classNames from "classnames";
import ImgEditor from "../../common/ImgEditor";

const data = [{label: '男', value: '男'}, {label: '女', value: '女'}]

class ProfileEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            visible: false,
            show_imgEditor: false,
        }

    }

    componentDidMount() {
        if (!Utils.token()) {
            App.go(`/login`)
        }
        ;
        U.setWXTitle('编辑资料');
        this.loadData();

    }

    loadData = () => {
        if (Utils.token()) {
            App.api(`usr/user/profile`).then((user) => {
                this.setState({user})
            })
        }
    }


    goChangeMobile = (mobile) => {
        App.go(`/mobile-change/${mobile}`)
    }

    showImgEditor = (val) => {
        this.setState({
            show_imgEditor: val || false,
        });
    };

    submit = () => {
        let {user} = this.state;
        App.api(`/usr/user/save`, {user: JSON.stringify(user)}).then(() => {
            Toast.success('资料修改成功');
        })
    }


    render() {
        let {user = {}, show_imgEditor, visible} = this.state;

        let {name, avatar = require('../../assets/3cimages/icon/avatar.png'), mobile, sex} = user;
        let save = name && avatar && mobile && sex;
        if (mobile && mobile.startsWith('86-')) {
            mobile = mobile.substring(3);
        }
        return (
            <div className='profile-edit-page'>
                <ul className='options'>
                    <li className='option' onClick={() => this.showImgEditor(true)}>
                        <div className='option-name'>
                            头像
                        </div>
                        <img className='right-arrow'
                             src={require('../../assets/3cimages/merchant/right-arrow-2c.png')}/>
                        <img className='avatar' src={avatar}/>
                    </li>
                    <li className='option'>
                        <div className='option-name'>
                            姓名
                        </div>
                        <img className='right-arrow'
                             src={require('../../assets/3cimages/merchant/right-arrow-2c.png')}/>
                        <input style={{textAlign: 'right'}} className='option-result' value={name || ''}
                               onChange={(e) => {
                                   this.setState({
                                       user: {
                                           ...user,
                                           name: e.target.value
                                       }
                                   })
                               }}/>
                    </li>
                    <li className='option' onClick={() => {
                        this.goChangeMobile(mobile)
                    }}>
                        <div className='option-name'>
                            电话
                        </div>
                        <img className='right-arrow'
                             src={require('../../assets/3cimages/merchant/right-arrow-2c.png')}/>
                        <div className='option-result'>{mobile}</div>
                    </li>

                </ul>
                <Picker visible={visible} value={sex === 1 ? ['男'] : ['女']} cols={1} onDismiss={() => {
                    this.setState({visible: false})
                }} onOk={() => {
                    this.setState({visible: false})
                }} data={data} onChange={(v) => {
                    sex = U.formatNumber.sex2num(v)
                    user.sex = sex;
                    this.setState({user})
                }}>
                    <ListItem arrow="horizontal" onClick={() => {
                        this.setState({visible: true})
                    }}>
                        性别
                    </ListItem>
                </Picker>

                <div className={classNames("save-btm", {"save-btm-allow": save})} onClick={() => {
                    this.submit()
                }}>
                    <p className="save-p">保存</p>
                </div>

                {show_imgEditor &&
                <ImgEditor showImgEditor={this.showImgEditor} aspectRatio={CTYPE.imgeditorscale.square} url={avatar}
                           handleImgSaved={(url) => {
                               avatar = url;
                               this.setState({
                                   user: {
                                       ...user,
                                       avatar
                                   }
                               });
                           }}
                />}


            </div>
        );
    }
}

export default ProfileEdit;