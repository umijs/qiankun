<template>
  <div id="app">
    <div class="mainapp">
      <!-- 标题栏 -->
      <header class="mainapp-header">
        <h1>QianKun</h1>
      </header>
      <div class="mainapp-main">
        <!-- 侧边栏 -->
        <ul class="mainapp-sidemenu">
          <li data-value="react18" v-for="(app, index) in childApps" :key="index" @click="changeRouterAndLoadApp(app)">
            {{ app.name }}
          </li>
        </ul>
        <!-- 子应用  -->
        <main id="subapp-container">
          <MicroApp
            v-if="curRenderMicroApp.name"
            :name="curRenderMicroApp.name"
            :entry="curRenderMicroApp.entry"
            auto-capture-error
            auto-set-loading
          ></MicroApp>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import subApplication from './microApp/subs.json';
import { MicroApp } from "@qiankunjs/vue";
const router = useRouter();

const childApps = shallowRef(subApplication);

const curRenderMicroApp = reactive({
  name: "",
  entry: "",
});

async function changeRouterAndLoadApp(app) {
  // 切换路由
  router.push(app.activeRule);
  if (curRenderMicroApp.name === app.name) return;

  curRenderMicroApp.name = app.name;
  curRenderMicroApp.entry = app.entry;
}
</script>

<style lang="less" scoped>
// 主应用慎用 reset 样式
body {
  margin: 0;
}

.mainapp {
  // 防止被子应用的样式覆盖

  line-height: 1;
}

.mainapp-header {
  > h1 {
    color: #333;
    font-size: 36px;
    font-weight: 700;
    margin: 0;
    padding: 36px;
  }
}

.mainapp-main {
  display: flex;

  .mainapp-sidemenu {
    width: 130px;
    list-style: none;
    margin: 0;
    margin-left: 40px;
    padding: 0;
    border-right: 2px solid #aaa;

    > li {
      color: #aaa;
      margin: 20px 0;
      font-size: 18px;
      font-weight: 400;
      cursor: pointer;

      &:hover {
        color: #444;
      }

      &:first-child {
        margin-top: 5px;
      }
    }
  }
}

// 子应用区域
#subapp-container {
  flex-grow: 1;
  position: relative;
  margin: 0 40px;

  .subapp-loading {
    color: #444;
    font-size: 28px;
    font-weight: 600;
    text-align: center;
  }
}
</style>
