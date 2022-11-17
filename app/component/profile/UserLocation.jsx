import React from 'react';
import {Picker, List, Toast, InputItem, TextareaItem, Switch, Modal} from "antd-mobile";
import {Utils, U, App, KvStorage} from "../../common";
import "../../assets/css/user-location.scss"


class UserLocation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
        }
    }

    componentDidMount() {
        U.setWXTitle('地址管理');
        this.loadData();
        Utils.addr.loadRegion(this);
    }

    loadData = () => {
        if (Utils.token()) {
            let user = JSON.parse(KvStorage.get('user-profile')) || {};
            let {id = 0} = user;
            if (id) {
                App.api('/usr/address/items', {userId: id}).then((res) => {
                    this.setState({
                        list: res
                    })
                })
            }
        }
    }

    goAddress = (id) => {
        App.go(`/location-edit/${id}`);
    }


    render() {
        let {list = []} = this.state;
        return <div>
            <ul className='address-list'>
                {list.map((address, index) => {
                    let {mobile, name, code, detail, isDefault, id} = address;
                    return <li className='address' key={index}>
                        <div className='name-mobile'>
                            {isDefault === 1 && <div className='default'>
                                默认
                            </div>}
                            <div className='address-name'>
                                {name}
                            </div>
                            <div className='address-mobile'>
                                {mobile}
                            </div>
                        </div>
                        <div className='address-detail'>
                            {Utils.addr.getPCD(code)}{detail}<span onClick={() => {
                            this.goAddress(id)
                        }}>编辑</span>
                        </div>
                    </li>
                })}
            </ul>
            <div className='edit-button' onClick={() => {
                App.go(`/location-edit/${0}`)
            }}>
                添加新地址
            </div>
        </div>

    }


}

export default UserLocation;