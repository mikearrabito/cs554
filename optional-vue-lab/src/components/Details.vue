<template>details</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "Details",
  data() {
    return {};
  },
  async created() {
    document.title = "Details";
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
        }
      },
      immediate: true,
    },
    "$route.params.id": {
      handler: function (routeId) {
        if (routeId) {
          let id: number;
          id = parseInt(routeId);
          if (isNaN(id) || id < 0) {
            this.$router.replace("/not-found");
          }
        }
      },
      immediate: true,
    },
  },
});
</script>
