import React from 'react';
import '../../assets/css/merchants.scss';
import {App, CTYPE, U} from "../../common";
import {FilterBar, ProductList, Loading, TopBar, MoreButton, MerchantList} from "../Comps";
import ProductUtils from "../../allData/ProductUtils";
import classnames from 'classnames';

export default class Products extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            merchants: [],
            loading: false,
            productCategories: [],
            sortPropertyName: 'id',
            qo: {
                sortAscending: false,
                pageNumber: 1,
                PageSize: 10,
            },
            ascDesc: 'desc'
        };
    }

    componentDidMount() {
        U.setWXTitle('门店')
        this.loadData();
        ProductUtils.loadProductCategories(this)
    }


    loadData = () => {
        let {qo, ascDesc = 'desc', sortPropertyName = 'id'} = this.state;
        qo.sortPropertyName = sortPropertyName;
        qo.sortAscending = ascDesc === 'asc';
        App.api(`usr/merchant/items`, {qo: JSON.stringify(qo)}).then((merchants) => {
            this.setState({
                merchants: merchants.content
            })
        })
    }

    render() {

        let {productCategories, pageSize, sorter = {}, filter = {}, layout, loading, sortPropertyName, merchants = [], qo = {}, ascDesc} = this.state;
        let sortAscending = ascDesc === 'asc';
        if (merchants.length === 0) {
            return <Loading/>
        }
        return <div className='merchants-page'>
            <div className='filter-merchant'>
                <div className={sortPropertyName === 'id' ? 'recommend active' : 'recommend'} onClick={() => {
                    this.setState({
                       sortPropertyName:'id',
                        ascDesc:'desc'
                    }, this.loadData)
                }}>推荐
                </div>
                <div
                    className={classnames('new-merchant', {'asc': sortAscending && sortPropertyName === 'createdAt'}, {'desc': !sortAscending && sortPropertyName === 'createdAt'})}
                    onClick={() => {
                        this.setState({
                            sortPropertyName: 'createdAt',
                            ascDesc: (sortAscending ? 'desc' : 'asc')
                        }, this.loadData)
                    }}
                >最近上新
                </div>
                <div className='sizer'>筛选</div>
            </div>
            <MerchantList list={merchants} productCategories={productCategories}/>
        </div>
    }
}
