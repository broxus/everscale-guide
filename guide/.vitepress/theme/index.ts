import "./style.css";

import DefaultTheme from "vitepress/theme";
import RepoList from "./components/RepoList.vue";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component("RepoList", RepoList);
  },
};
