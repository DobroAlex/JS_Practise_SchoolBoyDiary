module.exports = {
  IsStingNullOrEmpty: async function (str) {
    if (str == null || str === '') {
      return true
    }
    return false
  }
}
