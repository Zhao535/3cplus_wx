import React from 'react';
import {Picker, List, Toast, InputItem, TextareaItem, Switch, Modal} from "antd-mobile";
import {Utils, U, App, KvStorage} from "../../common";
import "../../assets/css/address-edit.scss"

const REGION_PATH = window.location.protocol + '//c2.wakkaa.com/assets/pca-code.json';

class LocationEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            list: [],
            address: {},
            visible: false,
            pickerValue: []
        }
    }

    componentDidMount() {
        U.setWXTitle('地址管理');
        Utils.addr.loadRegion().then((regions) => {
            this.setState({regions});
        });
        this.loadData();
    }


    loadData = () => {
        let {id} = this.state;
        if (id && id > 0) {
            App.api('/usr/address/item', {id: id}).then((address) => {
                let {code} = address;
                let codes = Utils.addr.getCodes(code);
                this.setState({address, pickerValue: codes});
            });
        }
    };
    submit = () => {
        let {address, id} = this.state;
        address.id = id > 0 ? id : null;
        let {code, detail, mobile, name, isDefault} = address;
        if (U.str.isEmpty(name)) {
            Toast.fail("请输入收件人姓名！");
            return;
        }
        if (U.str.isEmpty(mobile)) {
            Toast.fail("请输入手机号！");
            return;
        }
        if (!U.str.isChinaMobile(mobile)) {
            Toast.fail("请输入正确手机号！");
            return;
        }
        if (U.str.isEmpty(code)) {
            Toast.fail("请输入收件人所在地区！");
            return;
        }
        if (U.str.isEmpty(detail)) {
            Toast.fail("请输入收件人详细地址");
            return;
        }
        if (detail.length > 50) {
            Toast.fail("收货地址过长");
            return;
        }
        if (U.str.isEmpty(isDefault)) {
            address.isDefault = 2;
        }
        App.api('usr/address/save', {address: JSON.stringify(address)}).then(() => {
            Toast.success('保存成功！');
            window.history.back();
        });
    };
    changeCode = (pickerValue) => {
        let {address} = this.state;
        let _code = pickerValue[2];
        this.setState({
            address: {
                ...address,
                code: _code
            },
            pickerValue
        });
    };
    remove = (id, index) => {
        App.api('/usr/address/remove', {id}).then(() => {
            let {list = []} = this.state;
            list = U.array.remove(list, index);
            this.setState({list});
            Toast.success('删除成功');
            window.history.back();
        });
    };

    render() {
        let {address, regions = [], list = []} = this.state;
        let {id = 0, name, mobile, detail, isDefault} = address;
        return <div className="address-edit">
            <div className='user-info'>
                <List className='name'>
                    <InputItem maxLength={10} clear={true} placeholder="收货人姓名" value={name} onChange={(e) => {
                        this.setState({
                            address: {
                                ...address,
                                name: e
                            }
                        });
                    }}/>
                </List>
                <List className='address-mobile'>
                    <InputItem maxLength={11} clear={true} type={"number"} maxLength={11} value={mobile}
                               placeholder="联系方式"
                               onChange={(e) => {
                                   this.setState({
                                       address: {
                                           ...address,
                                           mobile: e
                                       }
                                   });
                               }}/>
                </List>
                <Picker
                    visible={this.state.visible}
                    data={regions}
                    extra={<div className='address-right'>
                        <div className='char'>所在地区</div>
                    </div>}
                    value={this.state.pickerValue}
                    onChange={v => this.changeCode(v)
                    }
                    onOk={() => this.setState({visible: false})}
                    onDismiss={() => this.setState({visible: false})}
                >
                    <List.Item placeholder='所在地区' className='address'
                               onClick={() => this.setState({visible: true})}>
                        <div className='icon'/>
                    </List.Item>
                </Picker>
                <List className='detail'>
                    <TextareaItem rows={3} autoHeight clear={true} value={detail} maxLength="50"
                                  placeholder="详细地址（街道、楼牌号等）"
                                  onChange={(e) => {
                                      this.setState({
                                          address: {
                                              ...address,
                                              detail: e
                                          }
                                      });
                                  }}/>
                </List>
                <List.Item className='default'
                           extra={<Switch
                               color='#009aa8'
                               checked={isDefault === 1}
                               size='default'
                               onChange={(e) => {
                                   this.setState({
                                       address: {
                                           ...address,
                                           isDefault: e ? 1 : 2
                                       }
                                   });
                               }}
                           />}
                >设为默认地址</List.Item>
            </div>
            <div className='edit-bottom'>
                {id !== 0 && <div className='delete-address' onClick={() =>
                    Toast.info('删除', '确认删除？', [
                        {text: '取消'},
                        {text: '确认', onPress: () => this.remove(id)}
                    ])
                }><span>删除</span></div>}
                <div className='save-address' onClick={() => {
                    this.submit();
                }}><span>保存</span></div>
            </div>
        </div>
    }
}

export default LocationEdit;