const serverEmailRegExp = '^(([1-z])@*.*[^\\s]$)'
const serverPasswordRegExp = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'

export function isValidEmail (email) {
    return !!(email.match(serverEmailRegExp))
}

export function isValidPassword (password) {
    console.log(!!(password.match(serverPasswordRegExp)))
    return !!(password.match(serverPasswordRegExp))
}