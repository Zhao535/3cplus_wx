import React from 'react';
import SceneUtils from "../../allData/SceneUtils";
import {HorizonalScrollContainer, SceneList, TopBar} from "../Comps";
import '../../assets/css/scenes.scss';
import {App} from "../../common";

class Scenes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            qo: {
                pageNumber: 1,
                pageSize: 5,
            },
            scenes: [],
            sceneTypes: [],
        };

    }

    componentDidMount() {
        this.loadData();
        SceneUtils.sceneTypes(this);
    }

    loadData = () => {
        let {qo} = this.state;
        SceneUtils.sceneList(this, qo);
    }


    render() {
        let {scenes = [], qo, sceneTypes = []} = this.state;
        let {pageSize} = qo;
        let goSceneProduct = (id) => {
            App.go(`/product/${id}/${0}`)
        }
        return (
            <div className='scenes-page'>
                <ul className='sceneTypes'>
                    {
                        sceneTypes.map((sceneType, index) => {
                            let {id, name, subHeading} = sceneType;
                            let _scene = scenes.filter(value => value.type === id) || [];
                            {
                                return <li className='sceneType' key={index}>
                                    {_scene.length > 0 && <div className='sceneType-name'>
                                        {name}
                                    </div>}
                                    {_scene.length > 0 && <div className='sceneType-subHeading'>
                                        {subHeading}
                                    </div>}
                                    {_scene.length > 0 &&
                                    <SceneList list={_scene} withTitles={false}/>}
                                </li>
                            }
                        })
                    }
                </ul>

                <div className='more-button'>
                    {/* <span onClick={() => {*/}
                    {/*    this.setState({*/}
                    {/*        qo: {*/}
                    {/*            ...qo,*/}
                    {/*            pageSize: pageSize + 5,*/}
                    {/*        }*/}
                    {/*    }, () => this.loadData())*/}
                    {/* }}>产看更多</span> */}
                </div>
            </div>
        );
    }
}

export default Scenes;