import React from 'react';
import { App, Utils, U } from "../../common";
import '../../assets/css/sceneShopping.scss'
import { HorizonalScrollContainer, Loading, MyStepper, OverLay, ParamModal } from "../Comps";
import { Checkbox, Icon, Stepper, Toast } from "antd-mobile";

const CheckboxItem = Checkbox.CheckboxItem;

class SceneShopping extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            scene: {},
            allCarts: [],
            favored: false,
            showProductDrawer: false,
            onCheckedProducts: [],
            total: 0
        }

    }

    componentDidMount() {
        this.loadData();
        this.loadFavored();
    }

    loadData = () => {
        let { id, allCarts = [] } = this.state;
        App.api(`usr/sceneShopping/item`, { id: id }).then((scene) => {
            this.setState({ scene });
            let { products = [] } = scene;
            products.map((item, index) => {
                let { id, merchantId, specs = [] } = item;
                allCarts.push({ productId: id, merchantId, productSno: specs[0].sno, num: 1, cartPayload: { type: 1, id: 0 } })
            })
            this.setState({ allCarts })
        });

    }

    loadFavored = () => {
        if (Utils.token()) {
            let { id } = this.state;
            App.api(`usr/collect/isCollect`, { type: 3, fromId: id }).then((favored) => {
                this.setState({ favored })
            })
        }
    }

    renderProducts = (item, index) => {
        let { name, specs = [], id } = item;
        let { imgs = [], price } = specs[0];
        return <li key={index} className='scene-product' onClick={() => {
            this.goProduct(id)
        }}>
            <img className='product-img' src={imgs[0]} />
            <div className='product-detail'>
                <div className='product-name'>{name}</div>
                <div className='price-shoppingCart'>
                    <em>{U.price.cent2yuan(price, true)}</em>
                    <img className='shopping-cart' src={require('../../assets/3cimages/icon/shopping-cart.png')} />
                </div>
            </div>
        </li>
    }

    goProduct = (id) => {
        App.go(`/product/${id}/${0}`)
    }

    toCollect = () => {
        if (Utils.token()) {
            let { id } = this.state;
            let collect = { type: 3, fromId: id };
            App.api(`usr/collect/save`, { collect: JSON.stringify(collect) }).then(() => {
                this.loadFavored();
            })
        } else {
            App.go(`/login`)
        }
    }

    popProducts = () => {
        this.setState({ showProductDrawer: true })
    }

    closeProducts = () => {
        this.setState({ showProductDrawer: false })
    }

    changeParam = (product, visible, action) => {
        Utils.common.renderReactDOM(<ParamModal visible={visible} comp={this} product={product}
            isScene={true} action={action} setCurrSpec={this.setCurrSpec}
        />)
    }

    updateNum = (product, e) => {
        let { allCarts = [] } = this.state;
        let { specs = [], id } = product;
        let cart = allCarts.find(c => c.productId === id) || {};
        cart.num = e;
        let index = allCarts.indexOf(cart);
        U.array.remove(allCarts, index);
        allCarts.push(cart);
        this.setState({ allCarts });
    }

    setCurrSpec = (currSpec, productId) => {
        let { allCarts = [] } = this.state;
        let cart = allCarts.find(c => c.productId === productId) || {};
        let index = allCarts.indexOf(cart);
        U.array.remove(allCarts, index)
        cart.productSno = currSpec.sno;
        allCarts.push(cart);
        this.setState({ allCarts });
    };


    saveCart = () => {
        let { allCarts = [], onCheckedProducts = [] } = this.state;
        let currCarts = [];
        onCheckedProducts.map((p, i) => {
            let cart = allCarts.find(c => c.productId === p.id) || {};
            currCarts.push(cart);
        })
        if (currCarts.length < 1) {
            Toast.info('请选择商品');
            return;
        }
        if (Utils.token()) {
            App.api('/usr/cart/saveAll', {
                carts: JSON.stringify(currCarts)
            }).then(
                () => {
                    this.doShowDrawer(false, false)
                    Toast.success("加入购物车成功", 1, null, false);
                }
            );
        } else {
            Toast.fail("请先登录");
        }
    };

    checkboxChange = (e, product) => {
        let { onCheckedProducts = [] } = this.state;
        let onPick = onCheckedProducts.indexOf(product);
        if (onPick === -1) {
            onCheckedProducts.push(product);
        }
        if (onPick > -1) {
            U.array.remove(onCheckedProducts, onPick)
        }
        this.setState({ onCheckedProducts, total: 0 }, this.onCheckedProducts)
    }
    onCheckedProducts = () => {
        let { onCheckedProducts = [], allCarts = [], total = 0 } = this.state;
        onCheckedProducts.length < 1 && this.setState({ total: 0 })
        onCheckedProducts.length > 0 && onCheckedProducts.map((c, i) => {
            let { id, specs = [] } = c;
            let p = allCarts.find(p => p.productId === id) || {};
            let { productSno, num = 0 } = p;
            let spec = specs.find(s => s.sno === productSno) || {};
            let { price } = spec;
            total += num * price;
            this.setState({ total })
        })
    }

    doShowDrawer = (showProductDrawer, showOverlay) => {
        this.setState({ showProductDrawer, showOverlay })
    }

    render() {
        let {
            scene = {},
            favored = false,
            showProductDrawer = false,
            showOverlay = false,
            allCarts = [],
            onCheckedProducts = [],
            total = 0
        } = this.state;

        let { id, img, title, content, products = [], subHeading } = scene;

        if (!id) {
            return <Loading />
        }
        return (
            <div className='sceneShopping-page'>
                <div className='scene-img'>
                    <img src={img} />
                </div>
                <HorizonalScrollContainer width={230} list={products} _render={this.renderProducts} />
                <div className='scene-title'>
                    {title}
                </div>

                <div className="scene_subheading">{subHeading}</div>

                <div className='scene-content' dangerouslySetInnerHTML={{ __html: content }} />

                <div className='scene-bottom-bar'>
                    {favored ? <img className='favor-icon' src={require('../../assets/3cimages/icon/favored.png')}
                        onClick={() => {
                            this.toCollect()
                        }} /> :
                        <img className='favor-icon' src={require('../../assets/3cimages/icon/favor.png')}
                            onClick={() => {
                                this.toCollect()
                            }} />}
                    <div className='products-button' onClick={() => {
                        this.doShowDrawer(true, true);
                    }
                    }>所有商品({products.length}）
                    </div>
                </div>

                <div className={showProductDrawer ? 'productDrawer pop' : 'productDrawer'}>
                    <ul className='scene-products'>
                        {products.map((product, index) => {
                            let { id, merchantId, name, specs = [] } = product;
                            let cart = allCarts.find(c => c.productId === id) || {};
                            let { productSno, num } = cart;
                            let _spec = specs.find(s => s.sno === productSno) || {};
                            let { imgs = [], params = [], price } = _spec;
                            return <li className='scene-product' key={index}>
                                <CheckboxItem
                                    checked={onCheckedProducts.indexOf(product) !== -1}
                                    key={index}
                                    onChange={(e) => {
                                        this.checkboxChange(e, product)
                                    }}>
                                    <img className='product-img' src={imgs[0]}
                                        onClick={() => App.go(`/product/${product.id}`)} />
                                    <div className='right'>
                                        <p>{product.name}</p>
                                        <div className='params'
                                            onClick={() => this.changeParam(product, true, 'changeSpec')}>
                                            {params.map((item, index) => {
                                                let { label, value } = item;
                                                return <div className='param' key={index}>
                                                    <div className='label'>{label}：</div>
                                                    <div className='value'>{value}</div>
                                                </div>;
                                            })}
                                        </div>
                                        <div className='down'>
                                            <div className='price'><em>￥</em>{U.price.cent2yuan(price, false)}</div>
                                            <div className='count'>
                                                <div className='product-step'>
                                                    <MyStepper
                                                        style={{ float: 'right', minWidth: '10vw' }}
                                                        showNumber
                                                        min={1}
                                                        value={num}
                                                        onChange={(e) => {
                                                            this.updateNum(product, e);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CheckboxItem>
                            </li>
                        })}
                        <div className='drawer-btm'>
                            <div className='all-select'>
                                <Checkbox checked={onCheckedProducts.length === products.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onCheckedProducts = products;
                                            this.setState({
                                                onCheckedProducts
                                            }, this.onCheckedProducts)
                                        } else {
                                            onCheckedProducts = [];
                                            this.setState({ onCheckedProducts, total: 0 }, this.onCheckedProducts)
                                        }
                                    }}
                                >全选</Checkbox>
                            </div>
                            <div className='total-price'>

                                合计:{U.price.cent2yuan(total, true)}
                            </div>
                            <div className='cart-btn' onClick={() => {
                                this.saveCart()
                            }}
                            >加入购物袋
                            </div>
                        </div>
                    </ul>
                </div>
                {showOverlay && <OverLay doShowDrawer={this.doShowDrawer} />}
            </div>
        );
    }
}

export default SceneShopping;