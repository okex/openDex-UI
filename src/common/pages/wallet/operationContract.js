import env from '_src/constants/env';
export default {
    get (address) {
        let contractList  = window.localStorage.getItem(env.envConfig.contract)
        contractList = contractList ? JSON.parse(contractList) : []
        if (!address) {
            return contractList
        }
        return contractList.filter(it => it.address === address)
    },
    add (address, shortName, precision) {
        let history = this.get();
        let status = false;
        history.forEach(it => {
            if (it.address === address) {
                it.shortName = shortName;
                it.precision = precision;
                status = true;
            }
        })
        if (!status) {
            history.push({ address, shortName, precision });
        }
        window.localStorage.setItem(env.envConfig.contract, JSON.stringify(history));
    },
    delete (address) {
        let history = this.get();
        history = history.filter(it => it.address !== address)
        window.localStorage.setItem(env.envConfig.contract, JSON.stringify(history));
    }
}