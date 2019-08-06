const serverEmailRegExp = '^(([1-z])@*.*[^\\s]$)'
const serverPasswordRegExp = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'
const serverPhoneNumberRegExp = '^\\+\\d{11}$'
const serverClassRegExp = '(^(\\d)|(10)|(11))-[а-я]{1}|university$'

function matcher(targetStr, regExp) {
    return !!(targetStr.match(regExp))
}

module.exports = {
    isValidEmail: function  (email) {
        return matcher(email, serverEmailRegExp)
    },

    isValidPassword: function  (password) {
        return matcher(password, serverPasswordRegExp)
    },

    isValidPhoneNumber: function (phoneNumber){
        return matcher(phoneNumber, serverPhoneNumberRegExp)
    },

    isValidClass: function (schoolClass) {
        return matcher(schoolClass, serverClassRegExp)
    }
}