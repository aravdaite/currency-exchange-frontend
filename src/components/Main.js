import React, { Component } from 'react';
import { Input, Select } from './';


class Exchange extends Component {
    state = {
        currencies: [],
        giveCurr: "EUR, Euro",
        getCurr: "USD, US dollar",
        giveFactor: 0,
        getFactor: 0,
        give: 0,
        get: 0
    }

    async getData() {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/get/currencies`, {
            credentials: 'include',
            method: 'get',
        })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
            });
        const currencies = response.response.map(({ id, en }) => `${id}, ${en}`)
        this.setState({ currencies });
    }
    componentDidMount() {
        const { giveCurr, getCurr } = this.state;
        this.getData();
        this.selectHandler(giveCurr, "give");
        this.selectHandler(getCurr, "get");
    }
    inputChangedHandler = (value, key) => {
        const parsedValue = parseInt(value);
        if (key === "give") {
            this.setState({ give: value ? parsedValue : 0, get: 0 });
        } else {
            this.setState({ give: 0, get: value ? parsedValue : 0 });
        }
    }
    async selectHandler(value, key) {
        const currId = value.split(",")[0];
        await fetch(`${process.env.REACT_APP_DOMAIN}/api/rate/${currId}`, {
            credentials: 'include',
            method: 'get',
        })
            .then(res => res.json())
            .then(res => {
                if (key === "give") {
                    this.setState({ giveFactor: res.response, giveCurr: value, give: 0, get: 0 });
                } else {
                    this.setState({ getFactor: res.response, getCurr: value, give: 0, get: 0 });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    calculate = () => {
        const { giveFactor, getFactor, give, get, giveCurr, getCurr } = this.state;
        let result;
        const currencies = giveCurr.split(",")[0] + "-" + getCurr.split(",")[0];
        const factor = 1 / giveFactor * getFactor;
        if (give !== 0) {
            result = give / giveFactor * getFactor;
            this.setState({ get: result, give }, () => this.sendData(currencies, give, factor))
        } else {
            result = get / getFactor * giveFactor;
            this.setState({ give: result }, () => this.sendData(currencies, result, factor))
        }
    }
    sendData = (currencies, amount, rate) => {
        if (amount !== 0) {
            fetch(`${process.env.REACT_APP_DOMAIN}/api/activity`, {
                credentials: 'include',
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currencies,
                    amount,
                    rate
                })
            })
        }
    }
    render() {
        const { give, get, giveCurr, getCurr, currencies } = this.state;
        return (
            <div className="mainBody">
                <div className="mainBody_select">
                    <p>From currency: </p>
                    <Select currency={giveCurr} currencyList={currencies} onChange={(event) => this.selectHandler(event.target.value, "give")} />
                    <p>To currency: </p>
                    <Select currency={getCurr} currencyList={currencies} onChange={(event) => this.selectHandler(event.target.value, "get")} />
                </div >
                <div className="mainBody_input">
                    <p>Amount you give: </p>
                    <Input value={give} onChange={(event) => this.inputChangedHandler(event.target.value, "give")} />
                    <p>Amount you get: </p>
                    <Input value={get} onChange={(event) => this.inputChangedHandler(event.target.value, "get")} />
                    <button className="button" onClick={this.calculate}>Calculate</button>
                </div >
            </div >
        )
    }
}

export default Exchange;