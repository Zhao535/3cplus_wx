import React from 'react';
import ArticleUtils from "../../allData/ArticleUtils";
import {Loading, TopBar} from "../Comps";
import {Icon} from "antd";
import '../../assets/css/article.scss';
import {App, Utils} from "../../common";

export default class Article extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            article: {},
            favored: false,

        }
    }

    componentDidMount() {
        this.loadData();
        this.loadFavored();
    }

    loadData = () => {
        let {id} = this.state;
        ArticleUtils.article(this, id)
    }

    loadFavored = () => {
        if (Utils.token()) {
            let {id} = this.state;
            App.api(`usr/collect/isCollect`, {type: 2, fromId: id}).then((favored) => {
                this.setState({favored})
            })
        }
    }

    toCollect = () => {
        if (Utils.token()) {
            let {id} = this.state;
            let collect = {type: 2, fromId: id};
            App.api(`usr/collect/save`, {collect: JSON.stringify(collect)}).then((favored) => {
                this.setState({favored}, this.loadFavored)
            })
        } else {
            App.go(`/login`)
        }
    }


    render() {
        let {article = {}, favored = false} = this.state;
        let {id, title, authorId, pageView, content, intro, picture} = article;
        if (!id) {
            return <Loading/>
        }
        return (
            <div className='article-page'>
                <div className='title'>
                    {title}
                </div>
                <div className='au-pv'>
                    <Icon type={'eye'}/><span>{pageView}</span>
                </div>
                <div className='intro'>
                    {intro}
                </div>
                <img className='article-img' src={picture}/>
                <div className='content' dangerouslySetInnerHTML={{__html: content}}/>
                <div className='favor'>
                    {
                        favored ? <img src={require('../../assets/3cimages/icon/favored.png')} onClick={() => {
                                this.toCollect()
                            }
                            }/> :
                            <img src={require('../../assets/3cimages/icon/favor.png')} onClick={() => {
                                this.toCollect()
                            }
                            }/>
                    }
                    <div className='collect'>{favored ? '已收藏' : '收藏'}</div>
                </div>
            </div>
        );
    }
}
