import {App} from "../common";

let ArticleUtils = (() => {

    let articleList = (component, qo) => {
        App.api("usr/article/items", {qo: JSON.stringify(qo)}).then((result) => {
            component.setState({articles: result.content})

        })
    };

    let article = (component, id) => {
        App.api('usr/article/item', {id: id}).then((article) => {
            component.setState({article})
        })
    };
    return {articleList, article};

})();

export default ArticleUtils;