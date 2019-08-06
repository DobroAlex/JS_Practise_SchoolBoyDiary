const serverEmailRegExp = '^(([1-z])@*.*[^\\s]$)'
const serverPasswordRegExp = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'
const serverPhoneNumberRegExp = '^\\+\\d{11}$'

function matcher(targetStr, regExp) {
    return !!(targetStr.match(regExp))
}

export function isValidEmail (email) {
    return matcher(email, serverEmailRegExp)
}

export function isValidPassword (password) {
    return matcher(password, serverPasswordRegExp)
}

export function isValidPhoneNumber(phoneNumber){
    return matcher(phoneNumber, serverPhoneNumberRegExp)
}
