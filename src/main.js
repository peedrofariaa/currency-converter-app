import './style.css'

const button = document.querySelector('button')
const selectFrom = document.querySelector('.select-from')
const selectTo = document.querySelector('.select-to')
const input = document.querySelector('input')

const currencies = {
    BRL: {
        name: 'Real',
        flag: '/imagens/brasil 2.svg',
        locale: 'pt-BR',
        symbol: 'R$'
    },
    USD: {
        name: 'Dólar americano',
        flag: '/imagens/estados-unidos (1) 1.svg',
        locale: 'en-US',
        symbol: 'US$'
    },
    EUR: {
        name: 'Euro',
        flag: '/imagens/Euro.svg',
        locale: 'de-DE',
        symbol: '€'
    },
    BTC: {
        name: 'Bitcoin',
        flag: '/imagens/Bitcoin.png',
        locale: 'en-US',
        symbol: '₿'
    }
}

const updateCurrencyDisplay = (currency, position) => {
    const currencyData = currencies[currency]
    const flagElement = document.getElementById(`flag-${position}`)
    const nameElement = document.getElementById(`currency-${position}`)
    
    flagElement.src = currencyData.flag
    nameElement.innerHTML = currencyData.name
}

const getExchangeRates = async () => {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL')
        const data = await response.json()
        
        return {
            USD: parseFloat(data.USDBRL.bid),
            EUR: parseFloat(data.EURBRL.bid),
            BTC: parseFloat(data.BTCBRL.bid),
            BRL: 1
        }
    } catch (error) {
        console.error('Erro ao buscar cotações:', error)
        return null
    }
}

const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
    if (fromCurrency === toCurrency) {
        return amount
    }
    
    const amountInBRL = fromCurrency === 'BRL' ? amount : amount * rates[fromCurrency]
    
    const result = toCurrency === 'BRL' ? amountInBRL : amountInBRL / rates[toCurrency]
    
    return result
}

const formatCurrency = (value, currency) => {
    const currencyData = currencies[currency]
    
    return new Intl.NumberFormat(currencyData.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'BTC' ? 8 : 2
    }).format(value)
}

const handleConversion = async () => {
    const amount = parseFloat(input.value)
    
    if (!amount || amount <= 0) {
        alert('Por favor, insira um valor válido!')
        return
    }
    
    const fromCurrency = selectFrom.value
    const toCurrency = selectTo.value
    
    const rates = await getExchangeRates()
    
    if (!rates) {
        alert('Erro ao buscar cotações. Tente novamente!')
        return
    }
    
    const convertedValue = convertCurrency(amount, fromCurrency, toCurrency, rates)
    
    document.querySelector('.p-value-from').innerHTML = formatCurrency(amount, fromCurrency)
    document.querySelector('.p-value-to').innerHTML = formatCurrency(convertedValue, toCurrency)
}

selectFrom.addEventListener('change', () => {
    updateCurrencyDisplay(selectFrom.value, 'from')
})

selectTo.addEventListener('change', () => {
    updateCurrencyDisplay(selectTo.value, 'to')
})

button.addEventListener('click', handleConversion)

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleConversion()
    }
})

updateCurrencyDisplay('BRL', 'from')
updateCurrencyDisplay('USD', 'to')
