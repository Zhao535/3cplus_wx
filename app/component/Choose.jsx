import React from 'react';
import '../assets/css/choose.scss';
import {_DATA, App, CTYPE, U} from "../common";
import {CommonTabs, Loading, NoMoreData, TitleBar} from "./Comps";
import SceneUtils from "../allData/SceneUtils";
import CategoryUtils from "../allData/CategoryUtils";
import BrandUtils from "../allData/BrandUtils";
import ProductUtils from "../allData/ProductUtils";
import classnames from 'classnames';

export default class Choose extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: 0,
            sceneTypes: [],
            choiceCategories: [],
            sidebarKey: -1,
            brands: [],
            productCategories: [],
        };
    }

    componentDidMount() {
        let {sidebarKey} = this.state;
        SceneUtils.sceneTypes(this);
        CategoryUtils.choiceCategory(this);
        ProductUtils.loadProductCategories(this)
        if (sidebarKey < 0) {
            BrandUtils.allBrands(this);
        }
        U.setWXTitle('选购')
    }

    goScenes = () => {
        App.go(`/scenes`)
    }

    goProducts = (categoryId, brandId) => {
        App.go(`/products/${categoryId}/${brandId}`)
    }


    render() {
        let {
            activeKey = 0,
            sceneTypes = [],
            choiceCategories = [],
            sidebarKey,
            brands = [],
            productCategories = []
        } = this.state;
        let t1 = choiceCategories.find(value => value.id === sidebarKey) || {};
        let {name, sequence, children = []} = t1;
        return <div className='choose-page'>
            <CommonTabs tabs={['分类', '情景购']} onChange={(i) => {
                this.setState({activeKey: i})
            }}/>
            {
                activeKey === 0 && <div className='classify'>
                    <ul className='sidebar'>
                        <li key={-1} className={classnames('category-name', {'active': sidebarKey === -1})}
                            onClick={() => {
                                this.setState({sidebarKey: -1})
                            }}>全部品牌
                        </li>

                        {choiceCategories.length === 0 ? <Loading/> :
                            (choiceCategories.map((t1, i1) => {
                                let {name, sequence, id, children = []} = t1;
                                if (children.length === 0) {
                                    choiceCategories = U.array.remove(choiceCategories, i1)
                                } else {
                                    children.map((t2, i2) => {
                                        let {children = []} = t2;
                                        if (children.length === 0) {
                                            U.array.remove(children, i2)
                                        }

                                    })
                                }

                            }))
                        }
                        {
                            choiceCategories.length > 0 &&
                            (choiceCategories.map((t1, i1) => {
                                let {name, sequence, id, children = []} = t1;
                                return <li key={i1}
                                           className={classnames('category-name', {'active': sidebarKey === id})}
                                           onClick={() => {
                                               this.setState({sidebarKey: id})
                                           }}>
                                    {name}
                                </li>
                            }))
                        }
                    </ul>
                    {
                        sidebarKey < 0 && <ul className='all-brands'>
                            {
                                brands.length === 0 ? <NoMoreData/> :
                                    (brands.map((brand, index) => {
                                        let {logo, id} = brand;
                                        return <img key={index} className='brand-logo' src={logo} onClick={()=>this.goProducts(0,id)}/>
                                    }))
                            }
                        </ul>
                    }
                    {
                        sidebarKey > 0 && <div className='choose-products'>
                            <ul className='nd-categories'>
                                {children.length === 0 && <NoMoreData/>}
                                {
                                    children.map((t2, index2) => {
                                        let {children = []} = t2;
                                        return <li className='nd-category' key={index2}>
                                            <div className='nd-category-name'>{t2.name}</div>
                                            <ul className='rd-categories'>
                                                {children.length === 0 && <NoMoreData/>}
                                                {children.map((t3, index3) => {
                                                    return <li className='rd-category' key={index3} onClick={()=>{this.goProducts(t3.id,0)}}>
                                                        <img className='rd-category-icon' src={t3.icon}/>
                                                        <div className='rd-category-name'>{t3.name}</div>
                                                    </li>
                                                })
                                                }
                                                <div className='clearfix'/>
                                            </ul>
                                        </li>
                                    })
                                }
                                <div className='clearfix'/>
                            </ul>
                        </div>
                    }
                </div>

            }
            {activeKey === 1 && <div key={activeKey} className='sceneShopping'>
                <ul className='sceneTypes'>
                    {sceneTypes.length === 0 ? <NoMoreData/> :
                        (sceneTypes.map((sceneType, index) => {
                            let {icon, name, subHeading, id} = sceneType;
                            return <li key={index} className='sceneType' onClick={() => {
                                this.goScenes()
                            }}>
                                <img className='sceneType-icon' src={icon}/>
                                <div className='cover'>
                                    <div className='sceneType-detail'>
                                        <div className='sceneType-name'>{name}</div>
                                        <div className='sceneType-subHeading'>{subHeading}</div>
                                    </div>
                                </div>
                            </li>
                        }))
                    }
                    <NoMoreData/>
                </ul>
            </div>}


        </div>;
    }
}
