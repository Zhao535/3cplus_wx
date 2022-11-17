import React from 'react';
import CollectUtils from "../../allData/CollectUtils";
import { CommonTabs, ProductList, SceneList, TopBar, ArticleList } from "../Comps";
import { U } from '../../common';
import "../../assets/css/collect.scss";

class Collects extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            typeKey: 1,
            qo: {
                pageSize: 10,
                pageNumber: 1,
                type: 1,
            },
            products: [],
            articles: [],
            scenes: [],
        }

    }

    componentDidMount() {
        U.setWXTitle('我的收藏')
        this.loadData();
    }

    loadData = () => {
        let { qo={} } = this.state;
        CollectUtils.collectList(this, qo)
    }

    onChange = (typeKey) => {
        let { qo={} } = this.state;
        qo.type = (typeKey + 1);
        console.log(typeKey);
        this.setState({
            qo, typeKey: (typeKey + 1),
        }, this.loadData)
    }


    render() {
        let { typeKey = 1, articles = [], scenes = [], products = [] } = this.state;
        return (
            <div className='collects-page'>
                <CommonTabs tabs={['商品', '文章', '情景购']} onChange={this.onChange} />
                {typeKey === 1 && <div className='product'>
                    <ProductList list={products} />
                </div>}
                {typeKey === 2 && <div className='article'>
                    <ArticleList list={articles} />
                </div>}
                {typeKey === 3 && <div className='scene-Shopping'>
                    <SceneList list={scenes} withTitles={false} />
                </div>}
            </div>
        );
    }
}

export default Collects;