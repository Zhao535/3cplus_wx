import React from 'react';
import ArticleUtils from "../../allData/ArticleUtils";
import {MyArticles} from "../Comps";

 export  default class  Articles extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            qo:{
                pageNumber:1,
                pageSize:10,
                total:0,
            },
            articles:[],


        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData=()=>{
        let {qo}=this.state;
        ArticleUtils.articleList(this,qo)
    }

    render() {
        let {articles=[],qo} =this.state;
        return (
            <div className='articles-page'>
                <MyArticles list={articles} withMore={false}/>
            </div>
        );
    }
}
