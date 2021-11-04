<template>
  <h1>
    Marvel
    {{
      $route.params.section[0].toUpperCase() + $route.params.section.slice(1)
    }}
  </h1>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getMarvelData } from "../api";

const handlePageChange = async (routeParams: Object) => {
  // This function handles initial page mount and page update when section or page num changes
  const { section, pageNum }: { section?: string; pageNum?: string } =
    routeParams;

  let page: number;
  if (pageNum) {
    page = parseInt(pageNum);
  } else {
    page = -1;
  }

  if (section === "characters" || section === "comics" || section == "series") {
    if (!isNaN(page) && page >= 0) {
      // TODO: handle 404 (empty array in response or an error)
      const response = await getMarvelData(section, page, true);
      const data = response.results;
      console.log(data);
    }
  }
};

export default defineComponent({
  name: "ResultsListPage",
  data() {
    return {};
  },
  mounted() {
    handlePageChange(this.$route.params);
  },
  updated() {
    handlePageChange(this.$route.params);
  },
  watch: {
    "$route.params.section": {
      handler: function (section: string) {
        if (section) {
          if (
            section !== "characters" &&
            section !== "comics" &&
            section !== "series"
          ) {
            this.$router.replace("/not-found");
          }
          document.title = `Marvel ${
            section[0].toUpperCase() + section.slice(1)
          }`;
        }
      },
      immediate: true,
    },
    "$route.params.pageNum": {
      handler: function (pageNum: string) {
        if (pageNum) {
          let page: number;
          if (pageNum) {
            page = parseInt(pageNum);
          } else {
            page = -1;
          }
          if (isNaN(page) || page < 0) {
            this.$router.replace("/not-found");
          }
        }
      },
      immediate: true,
    },
  },
});
</script>
