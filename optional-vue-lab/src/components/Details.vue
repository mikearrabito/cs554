<template>details page</template>

<script>
export default {
  data() {
    return {};
  },
  async created() {
    let { section, id } = this.$route.params;
    id = parseInt(id);

    if (
      section !== "characters" &&
      section !== "comics" &&
      section !== "series"
    ) {
      this.$router.replace("/not-found");
    }
    if (isNaN(id) || id < 0) {
      this.$router.replace("/not-found");
    }
    document.title = "Details";
  },
};
</script>
