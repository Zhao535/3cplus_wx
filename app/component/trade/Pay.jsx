import React, {Component} from 'react';
import {App, CTYPE, U} from "../../common";
import ImgEditor from "../../common/ImgEditor";
import "../../assets/css/pay.scss"

class Pay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tradeId: parseInt(this.props.match.params.id) || 0,
            billId: parseInt(this.props.match.params.billId) || 0,
            trade: {},
            bill: {},
            onPickImg: '',
        }
    }

    componentDidMount() {
        U.setWXTitle('确认订单')
        this.loadData();
    }

    loadData = () => {
        let {tradeId, billId} = this.state;
        App.api(`/usr/trade/trade`, {id: tradeId}).then((result) => {
            this.setState({trade: result});
        })
        if (billId) {
            App.api(`/usr/bill/item`, {id: billId}).then((result) => {
                this.setState({bill: result});
            })
        }
    }


    showImgEditor = (val, img) => {
        this.setState({
            show_imgEditor: val || false,
            onPickImg: img,
        });
    };

    submit = () => {
        let { trade, billId, bill = {} } = this.state;
        let { imgs = [] } = bill;
        let {merchantId, orderNumber, totalAmount, id, userId} = trade;
        if (!billId) {
            bill = {merchantId, orderNumber, amount: totalAmount, userId,tradeId:id,imgs};
        }
        App.api(`/usr/bill/save`, {bill: JSON.stringify(bill)}).then(() => {
            App.go(`/trade-detail/${id}`)
        })
    }

    render() {
        let {trade = {}, show_imgEditor = false, onPickImg = '', bill = {}} = this.state;
        let {imgs = []} = bill;
        let {payment = 0, totalPrice = 0} = trade;
        return (
            <div className='pay-page'>
                <div className='payment'>
                    <div className='payment-name'>
                        选择付款方式
                    </div>
                    <div className='pay-way'>
                        {payment === 1 && '微信支付'}
                        {payment === 2 && '线下支付'}
                    </div>
                </div>
                <div className='qr-code'>
                    <div className='pay-method'>
                        {payment === 1 && '微信支付'}
                        {payment === 2 && '线下支付'}
                    </div>
                    <img className='code' src={require("../../assets/3cimages/qrCode/qrcode.png")}/>
                    <div className='save-code'>长按保存付款二维码到相册</div>
                </div>

                <div className='pay-order'>
                    <div className='pay-order-title'>
                        上传支付凭证
                    </div>
                    <ul className='orders'>
                        {imgs.map((img, index) => {
                            return <li className='order' key={index}>
                                <div className='border' onClick={() => {
                                    this.showImgEditor(true, img)
                                }}>
                                    <div className='remove' onClick={() => {
                                        U.array.remove(imgs, index);
                                        this.setState({
                                            bill: {
                                                ...bill,
                                                imgs
                                            }
                                        })
                                    }}/>
                                    <img className='order-img' src={img}/>
                                </div>
                            </li>
                        })}
                        <li className='order'>
                            <div className='border'>
                                <img className='add-order-img' src={require("../../assets/image/common/puls-d8.png")}
                                     onClick={() => {
                                         this.showImgEditor(true, null)
                                     }}/>
                            </div>
                        </li>
                        <div className='clearfix'/>

                    </ul>

                </div>

                {show_imgEditor &&
                <ImgEditor showImgEditor={this.showImgEditor} aspectRatio={CTYPE.imgeditorscale.square}
                           url={onPickImg}
                    handleImgSaved={(url) => {
                               imgs.push(url);
                               this.setState({
                                   bill: {
                                       ...bill,
                                       imgs
                                   }
                               });
                           }}
                />}
                <div className='pay-bottom'>
                    <div className='total-price'>
                        <div className='total-price-title'>总计:</div>
                        <div className='price'>{U.price.cent2yuan(totalPrice, true)}</div>
                    </div>
                    <div className='submit-btn' onClick={() => {
                        this.submit()
                    }}>
                        提交订单
                    </div>
                </div>
            </div>
        );
    }
}

export default Pay;