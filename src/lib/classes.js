class Mask {
    constructor(type, currency) {
        this.type = type
        this.currency = currency
    }
    format(value) {
        value = value.replace(/\D/g, "")
        return new Intl.NumberFormat('pt-BR', {
            style: type,
            currency: currency.toUpperCase()
        }).format(value / 100)
    }
}

module.exports = {Mask}