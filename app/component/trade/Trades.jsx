import React from 'react';
import { App, CTYPE, U, Utils } from "../../common";
import classnames from 'classnames';
// import Tloader from "../common/react-touch-loader";
import { Toast } from "antd-mobile";
import '../../assets/css/trades.scss';
import { MyCommonTabs } from "../Comps";

const topBars = ["全部", "待付款", "待发货", "待收货", "已完成"];


export default class Trades extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                pageSize: 20,
                current: 1,
                total: 0
            },
            type: parseInt(this.props.match.params.type),
            trades: [],
            index: 0
        };
    }

    componentDidMount() {
        U.setWXTitle('我的订单');
        this.loadData();
        this.setState({ index: CTYPE.topBars.indexOf(CTYPE.topBars.find(item => item.type === this.state.type)) })
    }

    loadData = () => {
        let { pagination = {}, type } = this.state;
        App.api('/usr/trade/trades', {
            tradeQo: JSON.stringify({
                pageSize: pagination.pageSize,
                pageNumber: pagination.current,
                type
            })
        }).then((result) => {
            let { content = [] } = result;
            this.setState({
                trades: content,
                pagination,
                initializing: 2,
                last: result.last
            });

        });
    };

    pay = (id) => {
        App.api('/usr/trade/pay', { id: id, type: 2 }).then(() => {
            Toast.success("支付成功", 1, null, false);
            this.loadData();
        });
    };

    updateType = (id, type) => {
        App.api('/usr/trade/update_type', { id: id, type: type }).then(() => {
            if (type === 5) {
                Toast.success("取消成功", 1, null, false);
            }
            if (type === 4) {
                Toast.success("确认收货成功", 1, null, false);
            }
            if (type === 6) {
                Toast.success("评论成功", 1, null, false);
            }
            this.loadData();
        });

    };

    loadMore = (resolve) => {
        let { pagination = {}, type } = this.state;
        pagination.current = pagination.current + 1;
        App.api('/usr/trade/trades', {
            tradeQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize,
                type
            })
        }).then(result => {
            let { content = [] } = result;
            this.setState((prevState) => ({
                trades: prevState.trades.concat(content),
                pagination,
                initializing: 2,
                last: result.last
            }));
        });
        resolve && resolve();
    };

    refresh = (resolve, reject) => {
        let { pagination = {} } = this.state;
        this.setState({ pagination: { ...pagination, current: 1 } }, () => this.loadData());
        resolve && resolve();
    };

    onchange = (index) => {
        this.setState({ index });
        this.setState({ type: index === 4 ? 6 : index }, this.loadData)
    }

    render() {
        let { trades = [], type, pagination = {}, initializing, last, index = 0 } = this.state;
        let length = trades.length;
        let left = 100 / CTYPE.topBars.length / 2;

        left += index * left * 2;
        return <div className='trades-page'>
            <MyCommonTabs tabs={topBars} index={index} onChange={this.onchange} />

            {trades.length === 0 && <div className='trade-empty'>
                <div className='empty-icon' />
                <p>您暂时没有相关订单！</p>
            </div>}

            <div className='trade-list'>
                {trades.map((trade, index) => {
                    let { tradeItems = [], totalAmount, type, id, totalPrice, merchant={} } = trade;

                    let { logo = '', name } = merchant;

                    return <div className='trade-detail' key={index}>

                        <div className='title-bar' onClick={() => {
                            App.go(`/trade-detail/${id}`);
                        }}>
                            <img className='merchant-logo' src={logo} />
                            <span className='merchant-name'>{name}&nbsp;</span>
                            <div
                                className={classnames('trade-type', { 'comp': (type === 4 || type === 5 || type === 6) })}>{Utils.trade.typeToName(type)}</div>
                        </div>

                        {tradeItems.map((item, index) => {
                            let { product = {}, num, productSno } = item;
                            let { specs = [], title } = product;
                            let _specs = specs.filter(ss => ss.sno === productSno) || {};
                            return <div className='product-detail' key={index} onClick={() => {
                                App.go(`/trade-detail/${id}`);
                            }}>
                                {_specs.map((s, index) => {
                                    let { price, imgs = [], params = [] } = s;
                                    return <div className='inner' key={index}>
                                        <img className='left' src={imgs[0]} />
                                        <div className='mid'>
                                            <span className='title'>{product.name}</span>
                                            {params.map((item, index) => {
                                                let { value } = item;
                                                return <span className='param' key={index}>
                                                    {/*<span className='label'>{label}：</span>*/}
                                                    <span className='value'>{value}</span>
                                                </span>;
                                            })}
                                        </div>
                                        <div className='right'>
                                            <div className='price'>
                                                <em>￥</em>{U.price.cent2yuan(totalAmount, false)}</div>
                                            <div className='buy-num'>共{num}件</div>
                                        </div>
                                    </div>;
                                })}
                            </div>;
                        })}

                        <div className='btns'>
                            {type === 4 && <div className='btn comment' onClick={() => {
                                this.updateType(id, 6)
                            }}>去评价</div>}
                            <div className='btn'>联系客服</div>

                            {type === 3 && <React.Fragment>
                                <div className='btn' onClick={() => {
                                }}>查看物流
                                </div>
                                <div className='btn price' onClick={() => {
                                    this.updateType(id, 4);
                                }}>确认收货
                                </div>
                            </React.Fragment>}

                            {type === 1 && <React.Fragment>
                                <div className='btn' onClick={() => {
                                    this.updateType(id, 5);
                                }}>取消订单
                                </div>
                                <div className='btn price' onClick={() => {
                                    this.pay(id);
                                }}>立即付款
                                </div>
                            </React.Fragment>}

                        </div>
                        <div className='divider-h7' />

                    </div>;
                })}
            </div>

            {/*{length > 0 && <Tloader*/}
            {/*    className="main"*/}
            {/*    autoLoadMore*/}
            {/*    onRefresh={this.refresh} onLoadMore={this.loadMore} hasMore={!last}*/}
            {/*    initializing={initializing}>*/}
            {/*</Tloader>}*/}

        </div>;
    }
};
