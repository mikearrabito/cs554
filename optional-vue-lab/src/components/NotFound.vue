<template><h1>Error 404: Page not found</h1></template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "NotFound",
  created() {
    document.title = "Not Found";
  },
});
</script>

<style scoped>
h1 {
  font-size: 2rem;
}
</style>
