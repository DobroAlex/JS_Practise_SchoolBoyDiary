module.exports = {
  IsStingNullOrEmpty: async function (str) {
    if (str === null || str === '' || str === undefined) {
      return true
    }
    return false
  }
}
