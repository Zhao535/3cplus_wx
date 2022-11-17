import {App,U,Utils} from "../common";

let ProductUtils = (() => {

    let ProductList = (component, qo) => {
        App.api("usr/product/items", {qo: JSON.stringify(qo)}).then((result) => {
            component.setState({products: result.content,})

        })
    };

    let id2sequence = (types, id) => {
        let sequence = '';
        types.map((t1) => {
            if (t1.id === id) {
                sequence = t1.sequence;
            }
            t1.children.map((t2) => {
                if (t2.id === id) {
                    sequence = t2.sequence;
                }
                t2.children.map((t3) => {
                    if (t3.id === id) {
                        sequence = t3.sequence;
                    }
                });
            });
        });
        return sequence;

    };

    let parseSequence = (s) => {
        return s.substring(0, 2) + '-' + s.substring(2, 4) + '-' + s.substring(4, 6);
    };

    let loadProductCategories = (component, disable) => {
        App.api('adm/product/findAllCategories').then((productCategories) => {
            productCategories.map((t1) => {

                let {id, sequence, name, children = [], status} = t1;
                t1.key = parseSequence(sequence);
                t1.value = sequence;
                t1.title = (status === 2 ? '[已下架]' : '') + name;
                t1.disabled = disable;
                children.map((t2) => {
                    let {id, sequence, name, children = [], status} = t2;

                    t2.key = parseSequence(sequence);
                    t2.value = sequence;
                    t2.title = (status === 2 ? '[已下架]' : '') + name;
                    t2.disabled = disable;
                    children.map((t3) => {
                        let {id, sequence, name, status} = t3;

                        t3.key = parseSequence(sequence);
                        t3.value = sequence;
                        t3.title = (status === 2 ? '[已下架]' : '') + name;
                    })
                })

            });
            component.setState({productCategories});
        });
    };

    let getCategoryName = (productCategories, sequence, withParent = true) => {
        if (!sequence) {
            return;
        }
        let name = '', t1Name = '', t2Name = '';
        productCategories.map((t1) => {
            let {children = []} = t1;
            if (t1.sequence === sequence) {
                name = t1.name
            }
            children.map((t2) => {
                if (t2.sequence === sequence) {
                    name = t2.name
                }
                let {children = []} = t2;
                children.map((t3) => {
                    if (t3.sequence === sequence) {
                        name = t3.name;
                        t1Name = t1.name;
                        t2Name = t2.name;
                    }
                })

            })

        });
        return withParent ? t1Name + '>' + t2Name + '>' + name : name;

    };

    return {ProductList, getCategoryName, loadProductCategories,id2sequence};

})();

export default ProductUtils;