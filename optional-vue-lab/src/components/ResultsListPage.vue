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
import { MarvelInfo } from "../types/types";

const handlePageChange = (routeParams: Object) => {
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
      fetchData(section, page);
    }
  }
};

const fetchData = (section: string, page: number): Array<MarvelInfo> => {
  // handles data fetch calls from mounted and updated

  console.log(section, page);
  // TODO: finish logic for fetching data
  return [
    {
      id: 10,
      description: "abc",
      name: "abc",
      title: "abc",
      thumbnail: { path: "abc", extension: "abc" },
      comics: { items: [] },
      series: { items: [] },
      stories: {
        items: [],
      },
    },
  ];
};

export default defineComponent({
  name: "ResultsListPage",
  data() {
    return {};
  },
  async created() {
    //
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
