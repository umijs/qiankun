<template>
  <div class="app">
    Hello Vue
    <el-button @click="dialogVisible = true" type="text">open Dialog</el-button>

    <el-dialog
      :visible.sync="dialogVisible"
      title="提示"
      width="30%">
      <span>{{framework}}</span>
      <span class="dialog-footer" slot="footer">
    <el-button @click="dialogVisible = false" type="primary">ok</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import ElementUI from 'element-ui';
  import Vue from 'vue';

  export default {
    name: 'App',
    data() {
      return {
        dialogVisible: false,
        framework: `hello Vue ${Vue.version} element-ui ${ElementUI.version}`,
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('confirm to close？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
    },
  };
</script>

<style scoped>
  .app {
    color: bisque;
  }
</style>
