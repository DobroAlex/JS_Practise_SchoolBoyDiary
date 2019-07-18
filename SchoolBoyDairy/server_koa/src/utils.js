module.exports = {
  IsStingNullOrEmpty: async function (str) {
    return (str === null || str === '' || str === undefined)
  },
  HASH_ROUNDS: 14
}
