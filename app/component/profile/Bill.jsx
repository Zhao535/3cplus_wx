import React from 'react';
import {App} from "../../common";

class Bill extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bills: [],
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        App.api(`usr/bill/items`).then((res) => {
            this.setState({bills: res || []})
        })
    }

    render() {
        let {bills = []} = this.state;
        return (
            <div className='bill-page'>
                <ul className='bills' >
                    {bills.map((bill, index) => {
                        let {tradeId} =bill;
                        return <li>

                        </li>
                    })}
                </ul>

            </div>
        );
    }
}

export default Bill;