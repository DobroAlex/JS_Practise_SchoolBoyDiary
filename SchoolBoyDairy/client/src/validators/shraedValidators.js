const serverEmailRegExp = "/[a-z0-9\\._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9\\-]+\.){1,}([a-z]{2,16})/"
const serverPasswordRegExp = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'

export function isValidEmail (email) {
    return !!(email.match(serverEmailRegExp))
}

export function isValidPassword (password) {
    console.log(!!(password.match(serverPasswordRegExp)))
    return !!(password.match(serverPasswordRegExp))
}