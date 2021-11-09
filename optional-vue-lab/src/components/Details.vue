<template>
  <div id="details">
    <h1>{{ name }}</h1>
    <img v-if="image" :src="image" width="400" height="400" />
    <p v-if="description" class="description-container">{{ description }}</p>
    <p v-if="price">Price: ${{ price }}</p>
    <div v-if="characters">
      <h2>Characters</h2>
      <ul class="item-list">
        <li v-for="character in characters" :key="character.resourceURI">
          <router-link
            :to="{
              name: 'details',
              params: {
                section: 'characters',
                id: character.resourceURI.split('/')[
                  character.resourceURI.split('/').length - 1
                ],
              },
            }"
            >{{ character.name }}</router-link
          >
        </li>
      </ul>
    </div>
    <div v-if="comics">
      <h2>Comics</h2>
      <ul class="item-list">
        <li v-for="comic in comics" :key="comic.resourceURI">
          <router-link
            :to="{
              name: 'details',
              params: {
                section: 'comics',
                id: comic.resourceURI.split('/')[
                  comic.resourceURI.split('/').length - 1
                ],
              },
            }"
            >{{ comic.name }}</router-link
          >
        </li>
      </ul>
    </div>
    <div v-if="series">
      <h2>Series</h2>
      <ul class="item-list">
        <li v-for="ser in series" :key="ser.resourceURI">
          <router-link
            :to="{
              name: 'details',
              params: {
                section: 'series',
                id: ser.resourceURI.split('/')[
                  ser.resourceURI.split('/').length - 1
                ],
              },
            }"
            >{{ ser.name }}</router-link
          >
        </li>
      </ul>
    </div>
    <div v-if="stories">
      <h2>Stories</h2>
      <ul class="item-list">
        <li v-for="story in stories" :key="story.resourceURI">
          {{ story.name }}
        </li>
      </ul>
    </div>
    <div v-if="creators">
      <h2>Creators</h2>
      <ul class="item-list">
        <li v-for="creator in creators" :key="creator.resourceURI">
          {{ creator.name }} -
          {{ creator.role[0].toUpperCase() + creator.role.slice(1) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { getMarvelData } from "../api";
import { MarvelApiResponse, MarvelInfo } from "@/types/types";

const getData = async (routeParams: Object): Promise<MarvelInfo | null> => {
  // makes api request with given id, returns single object representing that character/comic/series
  // returns null if not found or if there was a network error
  const { section, id: routeId }: { section?: string; id?: string } =
    routeParams;

  let id: number;
  if (routeId) {
    id = parseInt(routeId);
  } else {
    id = -1;
  }

  if (section === "characters" || section === "comics" || section == "series") {
    if (!isNaN(id) && id >= 0) {
      const response: MarvelApiResponse = await getMarvelData(
        section,
        id,
        false
      );
      const data = response.results;
      if (data.length) {
        return data[0];
      }
    }
  }
  return null;
};

export default defineComponent({
  name: "Details",
  data() {
    const data: {
      loading: boolean;
      name: string | undefined;
      image: string | null;
      description: string | null;
      price: number | null;
      characters: Array<{ resourceURI: string; name: string }> | undefined;
      comics: Array<{ resourceURI: string; name: string }> | undefined;
      series: Array<{ resourceURI: string; name: string }> | undefined;
      stories: Array<{ resourceURI: string; name: string }> | null;
      creators: Array<{ name: string; role: string }> | undefined;
      leaving: boolean;
    } = {
      loading: false,
      name: undefined,
      image: null,
      description: null,
      price: null,
      characters: undefined,
      comics: undefined,
      series: undefined,
      stories: null,
      creators: undefined,
      leaving: false,
    };
    return data;
  },
  methods: {
    async updatePage() {
      if (this.leaving) {
        return;
      }
      this.loading = true;
      let data: MarvelInfo | null = null;
      try {
        data = await getData(this.$route.params);
      } catch (e) {
        this.$router.replace("/not-found");
      } finally {
        this.loading = false;
      }
      if (data === null) {
        this.$router.replace("/not-found");
        return;
      }
      this.loading = false;
      this.name = undefined;
      this.image = null;
      this.description = null;
      this.price = null;
      this.characters = undefined;
      this.comics = undefined;
      this.series = undefined;
      this.stories = null;
      this.creators = undefined;
      this.name = data.name ?? data.title;
      this.image = `${data.thumbnail.path}.${data.thumbnail.extension}`;
      if (data.description) {
        this.description = data.description.replace(/<\/?[^>]+(>|$)/g, "");
      }
      if (data.prices?.length) {
        for (const price of data.prices) {
          if (price.type === "printPrice") {
            this.price = price.price;
            break;
          }
        }
      }
      if (data.creators?.items?.length) {
        this.creators = data.creators.items;
      }
      if (data.stories?.items?.length) {
        this.stories = data.stories.items;
      }
      if (data.series?.items?.length) {
        this.series = data.series.items;
      }
      if (data.comics?.items?.length) {
        this.comics = data.comics.items;
      }
      if (data.characters?.items?.length) {
        this.characters = data.characters.items;
      }
    },
  },
  created() {
    document.title = "Details";
    this.updatePage();
  },
  beforeRouteLeave(to, from, next) {
    if (
      /(\/((characters)|(series)|(comics))\/page\/[\d]+)|(\/)/gi.test(to.path)
    ) {
      // matches /section/page/pageNum or /
      this.leaving = true; // set a flag so our watch function wont trigger and send to 404
    }
    next();
  },
  watch: {
    "$route.params.section": {
      handler: function () {
        this.updatePage();
      },
      immediate: false,
    },
    "$route.params.id": {
      handler: function () {
        this.updatePage();
      },
      immediate: false,
    },
  },
});
</script>

<style scoped>
.item-list {
  padding: 0px;
}
.description-container {
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}
</style>
