<template>
  <el-container class="layout-container">
    <el-aside width="250px">
      <el-scrollbar>
        <el-menu background-color="#fff">
          <el-menu-item
            :index="app.name"
            v-for="(app, index) in childApps"
            :key="index"
            @click="changeRouterAndLoadApp(app)"
            >{{ app.name }}</el-menu-item
          >
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="background-color: #fff; text-align: center">
        <h2>{{ curRenderMicroApp.name }}</h2>
      </el-header>

      <el-main>
        <el-scrollbar>
          <MicroApp
            v-if="curRenderMicroApp.name"
            :name="curRenderMicroApp.name"
            :entry="curRenderMicroApp.entry"
            auto-capture-error
            auto-set-loading
          ></MicroApp>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { shallowRef, reactive } from "vue";
import { useRouter } from "vue-router";
import subApplication from "./microApp/subs.json";
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
<style>
body {
  margin: 0;
  padding: 0;
}
</style>
<style lang="less" scoped>
.layout-container {
  height: 100vh;
  background-color: rgb(245, 245, 245);

  ::v-deep {
    .el-menu {
      height: 100vh;
    }
  }
}


</style>
