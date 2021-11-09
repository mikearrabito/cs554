<template>
  <h1 v-if="section">
    Marvel
    {{
      $route.params.section[0].toUpperCase() + $route.params.section.slice(1)
    }}
  </h1>
  <div v-if="loading === true">Loading...</div>
  <div v-if="loading !== true && marvelData !== null">
    <div
      id="page-selection-container"
      v-if="totalPages !== null && page !== null"
    >
      <v-pagination
        v-model="page"
        :pages="totalPages"
        :range-size="1"
        active-color="#DCEDFF"
        hideFirstButton
        hideLastButton
      />
    </div>
    <ul v-for="item in marvelData" :key="item.id">
      <router-link
        :to="{
          name: 'details',
          params: { section: $route.params.section, id: item.id },
        }"
      >
        <p v-if="item.name">{{ item.name }}</p>
        <p v-else>{{ item.title }}</p>
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts">
import { MarvelApiResponse, MarvelInfo } from "@/types/types";
import { defineComponent } from "@vue/runtime-core";
import { getMarvelData } from "../api";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

const getPageData = async (
  routeParams: Object
): Promise<MarvelApiResponse | null> => {
  // This function handles initial page mount and when either section or page number are changed
  // returns api response if there is data, else returns null if no data found
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
        return response;
      }
    }
  }
  return null;
};

export default defineComponent({
  name: "ResultsListPage",
  components: {
    VPagination,
  },
  methods: {
    async updatePage() {
      if (this.leaving) {
        return;
      }
      let { section, pageNum } = this.$route.params;
      if (
        section !== "characters" &&
        section !== "comics" &&
        section !== "series"
      ) {
        this.$router.replace("/not-found");
        return;
      }

      let page: number;
      if (typeof pageNum === "string") {
        page = parseInt(pageNum);
      } else {
        page = -1;
      }

      if (isNaN(page) || page < 0) {
        this.$router.replace("/not-found");
        return;
      }

      document.title = `Marvel ${section[0].toUpperCase() + section.slice(1)}`;
      this.section = section;
      this.loading = true;
      let data: MarvelApiResponse | null = null;
      try {
        data = await getPageData(this.$route.params);
      } catch (e) {
        this.loading = false;
        this.$router.replace("/not-found");
        return;
      }
      if (data !== null) {
        this.marvelData = data.results;
        this.loading = false;
        this.page = data.page;
        const totalData = data.total;
        const perPage = data.limit;
        this.totalPages = Math.ceil(totalData / perPage);
      } else {
        // redirect to 404, no data found from api, or error during request
        this.$router.replace("/not-found");
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (/(\/((characters)|(series)|(comics))\/[\d]+)|(\/)/gi.test(to.path)) {
      // matches /section/id or /
      this.leaving = true; // set a flag so our watch function wont trigger and send to 404
    }
    next();
  },
  data() {
    const data: {
      marvelData: Array<MarvelInfo> | null;
      loading: boolean;
      page: number | null;
      section: "characters" | "comics" | "series" | null;
      totalPages: number | null;
      leaving: boolean;
    } = {
      marvelData: null,
      loading: false,
      page: null,
      section: null,
      totalPages: null,
      leaving: false,
    };
    return data;
  },
  async created() {
    this.updatePage();
  },
  watch: {
    "$route.params.section": {
      handler: function () {
        this.updatePage();
      },
      immediate: false,
    },
    "$route.params.pageNum": {
      handler: function () {
        this.updatePage();
      },
      immediate: false,
    },
    page: {
      handler: function (pageNum: number) {
        this.$router.push(`/${this.section}/page/${pageNum - 1}`);
      },
    },
  },
});
</script>

<style>
ul {
  list-style-type: none;
  padding: 0px;
}
#page-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.Control {
  display: none !important;
}
.Control-active {
  display: block !important;
}
.Pagination li {
  margin: 10px !important;
}
</style>
