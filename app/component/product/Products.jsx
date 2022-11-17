import React from 'react';
import {App, U} from "../../common";
import {FilterBar, ProductList} from "../Comps";
import "../../assets/css/products.scss";

class Products extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            brandId: this.props.match.params.brandId || 0,
            categoryId: this.props.match.params.categoryId || 0,
            products: [],
            sorter: {field: 'id', ascDesc: 'desc'},
            filter: {},
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let {brandId = 0, categoryId = 0, sorter = {}, filter = {}} = this.state;
        let {field = 'id', ascDesc = 'desc'} = sorter;
        let {prices = ['', '']} = filter;
        let _prices = JSON.parse(JSON.stringify(prices));
        if (_prices[0] === '') {
            _prices[0] = 0;
        }
        if (_prices[1] === '') {
            _prices[1] = 999999999999999;
        };

        let qo = {
            brandId, categoryId, sortPropertyName: field,
            sortAscending: ascDesc === "asc", price: {
                before: parseInt(U.price.yuan2cent(_prices[1])),
                after: parseInt(U.price.yuan2cent(_prices[0]))
            },
        };
        App.api(`usr/product/items`, {qo: JSON.stringify(qo)}).then((result) => {
            this.setState({products: result.content})
        })
    }

    syncFilterBar = (sorter, filter, layout, withoutLoading) => {
        this.setState({sorter, filter}, () => {
            this.loadData()
        })
    }

    render() {
        let {products = [], filter = {}, sorter = {}} = this.state;
        return (
            <div className='products-page'>
                <FilterBar filter={filter} sorter={sorter} syncFilterBar={this.syncFilterBar}/>
                {products.length < 1 && <div>暂无此类商品</div>}
                {products.length > 0 && <ProductList list={products}/>}
                <div className='no-more-data'>没有更多了~</div>
            </div>
        );
    }
}

export default Products;