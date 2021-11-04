<template>
  <h1>
    Marvel
    {{
      $route.params.section[0].toUpperCase() + $route.params.section.slice(1)
    }}
  </h1>
  <div v-if="loading === true">Loading...</div>
  <div v-if="loading !== true && marvelData !== null">
    <ul v-for="item in marvelData" :key="item.id">
      <p v-if="item.name">{{ item.name }}</p>
      <p v-else>{{ item.title }}</p>
    </ul>
  </div>
</template>

<script lang="ts">
import { MarvelInfo } from "@/types/types";
import { defineComponent } from "@vue/runtime-core";
import { getMarvelData } from "../api";

const getPageData = async (
  routeParams: Object
): Promise<MarvelInfo[] | null> => {
  // This function handles initial page mount and when either section or page number are changed
  // returns array of data to display in list, or null if no data found
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
      const response = await getMarvelData(section, page, true);
      const data = response.results;
      if (data.length) {
        return data;
      }
    }
  }
  return null;
};

export default defineComponent({
  name: "ResultsListPage",
  data() {
    const data: { marvelData: Array<MarvelInfo> | null; loading: boolean } = {
      marvelData: null,
      loading: false,
    };
    return data;
  },
  watch: {
    "$route.params.section": {
      handler: async function (section: string) {
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
          this.loading = true;
          let data: Array<MarvelInfo> | null = null;
          try {
            data = await getPageData(this.$route.params);
          } catch (e) {
            this.loading = false;
            this.$router.replace("/not-found");
          }
          if (data !== null) {
            this.marvelData = data;
            this.loading = false;
            //
          } else {
            // redirect to 404, no data found from api, or error during request
            this.$router.replace("/not-found");
          }
        }
      },
      immediate: true,
    },
    "$route.params.pageNum": {
      handler: async function (pageNum: string) {
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
          this.loading = true;
          let data: Array<MarvelInfo> | null = null;
          try {
            data = await getPageData(this.$route.params);
          } catch (e) {
            this.loading = false;
            this.$router.replace("/not-found");
          }
          if (data !== null) {
            this.marvelData = data;
            this.loading = false;
            //
          } else {
            // redirect to 404
            this.$router.replace("/not-found");
          }
        }
      },
      immediate: true,
    },
  },
});
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0px;
}
</style>
