<template>
  <h1>Welcome</h1>
  <h2>On this site you can browse all types of information about Marvel</h2>
  <p>
    This site interacts with Marvel's API to get data for all of their
    characters, comics, and series.
  </p>
  <p>
    For each character, you can see details such as a description and what
    comics and series they are a part of.
  </p>
  <p>
    Comic's details include a description, price, series, characters, creators,
    and more.
  </p>
  <p>Details for each Series include characters, comics, creators, and more.</p>
  <p>Choose a category to explore</p>
</template>

<script>
export default {
  created() {
    document.title = "Marvel Data";
  },
};
</script>
<style scoped>
h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}
</style>
