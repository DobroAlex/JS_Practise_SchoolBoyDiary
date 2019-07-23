module.exports = {
  IsStingNullOrEmpty: async function (str) {
    return (str === null || str === '' || str === undefined)
  },

  errorGenerator: function (msg, status) {
    const e = new Error(msg)
    e.status = status
    return e
  },

  HASH_ROUNDS: 14
}
