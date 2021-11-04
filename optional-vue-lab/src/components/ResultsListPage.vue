<template>
  <h1>
    Marvel
    {{
      $route.params.section[0].toUpperCase() + $route.params.section.slice(1)
    }}
  </h1>
</template>

<script>
export default {
  data() {
    return {};
  },
  async created() {
    let { section, pageNum } = this.$route.params;
    pageNum = parseInt(pageNum);

    if (
      section !== "characters" &&
      section !== "comics" &&
      section !== "series"
    ) {
      this.$router.replace("/not-found");
    }
    if (isNaN(pageNum) || pageNum < 0) {
      this.$router.replace("/not-found");
    }
  },
  watch: {
    "$route.params.section": {
      handler: function (section) {
        if (section) {
          document.title = `Marvel ${
            section[0].toUpperCase() + section.slice(1)
          }`;
        }
      },
      immediate: true,
    },
  },
};
</script>
