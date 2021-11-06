import { createApp, h } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import MainPage from "./components/MainPage.vue";
import ResultsListPage from "./components/ResultsListPage.vue";
import NotFound from "./components/NotFound.vue";
import Details from "./components/Details.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: MainPage },
    { path: "/:section/page/:pageNum", component: ResultsListPage },
    { path: "/:section/:id", component: Details, name: "details" },
    { path: "/not-found", component: NotFound },
    { path: "/:pathMatch(.*)*", component: NotFound },
  ],
});

const app = createApp({
  render: () => h(App),
});

app.use(router);

app.mount("#app");
