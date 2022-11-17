import React from 'react';
import {MerchantList, TopBar} from "../Comps";
import CollectUtils from "../../allData/CollectUtils";
import {App, Utils} from "../../common";
import '../../assets/css/focus.scss';
import ProductUtils from "../../allData/ProductUtils";

class Focus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            qo: {
                pageNumber: 1,
                pageSize: 10,
                total: 0,
            },
            merchants: [],
            productCategories: [],

        };
    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadProductCategories(this);
    }

    loadData = () => {
        if (Utils.token()) {
            let {qo} = this.state;
            qo.type = 4;
            CollectUtils.collectList(this, qo);
        }
    }


    render() {
        let {merchants = [], qo, productCategories = []} = this.state;
        return (
            <div className='focus-page'>
                <MerchantList list={merchants} productCategories={productCategories}/>
            </div>
        );
    }
}

export default Focus;