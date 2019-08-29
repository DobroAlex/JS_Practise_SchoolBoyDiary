<template>
  <div></div>
</template>

<script>
export default {
  name: 'HelloWorld',
  beforeCreate () {
    this.$router.push({name: 'elevator'})
  }
}
</script>
