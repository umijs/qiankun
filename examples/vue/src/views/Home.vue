<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"/>
    <HelloWorld v-if="showHello" msg="Vue.js Demo"/>
    <el-button @click="parentCall" type="text">Say Hello To Main App</el-button>
    <el-button @click="showHello = true" type="text">Say Hello</el-button>
    <el-button @click="dialogVisible = true" type="text">Open Dialog</el-button>

    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialogVisible"
      title="Dialog"
      width="30%">
      <span>dialog message</span>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">cancel</el-button>
        <el-button @click="dialogVisible = false" type="primary">ok</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  // @ is an alias to /src
  // import HelloWorld from '@/components/HelloWorld.vue';
  const HelloWorld = ()=> import('@/components/HelloWorld.vue').then((res) => res.default).catch(error => 'An error occurred while loading the component')

  export default {
    name: 'home',
    components: {
      HelloWorld,
    },
    data() {
      return {
        dialogVisible: false,
        showHello: false,
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('Sure to close？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      parentCall() {
        window.sayHello('i am from vue.')
      }
    },
  };
</script>
