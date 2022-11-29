<script setup lang="ts">
import RepoListItem from './RepoListItem.vue';

type Repo = {
  name: string;
  url: string;
};

const props = defineProps<{
  repos: Repo[],
}>();
</script>

<template>
  <div class="RepoList">
    <div class="container">
      <div v-for="(repo, i) in repos" :key="repo.name" class="item" :class="{ 'has-prev': i > 0 }">
        <RepoListItem :text="repo.name" :href="repo.url" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 640px) {
  .RepoList .container {
    display: flex;
  }
}

.RepoList .container .item.has-prev {
  padding-top: 8px;
}

@media (min-width: 640px) {
  .RepoList .container .item {
    flex-shrink: 0;
    width: 50%;
  }

  .RepoList .container .item:not(.has-prev) {
    padding-right: 8px;
  }

  .RepoList .container .item.has-prev {
    padding-top: 0;
    padding-left: 8px;
  }
}
</style>
