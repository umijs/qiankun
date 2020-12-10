<template>
  <div class="subview-container">
    <div id="subview"></div>
  </div>
</template>

<style lang="less">
 .subview-container{
   position: relative;
   height: 100%
 }
</style>
<script>
import { start } from '../../../../es';

const originGlobalThis = globalThis || self

export default {
  name: 'subview',
  props: {

  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {
    start({
      customizeProxyProperty: (target, key, appName)=>{
        console.log(target, key, appName);
        if(key === 'localStorage'){
          target[key] = target[key] || {}
          target[key].setItem = (key, value)=>{
            localStorage.setItem(`${appName}_${key}`, value)
          }
          target[key].getItem = (key)=>{
            return localStorage.getItem(`${appName}_${key}`)
          }
        }
      },
      execScriptsHooks: {
        beforeExec:(proxy, app,inlineScript, scriptSrc)=>{
          console.log(`beforeExec:--->  `, proxy, app, scriptSrc, globalThis);
          if(scriptSrc.includes('vizier')){
            globalThis = self = proxy
          // }else{
          //   globalThis = self = originGlobalThis
          }
        },
        afterExec: ()=>{
          console.log('afterExec');
          globalThis = self = originGlobalThis
        }
      }
    })
  },
  beforeDestroy () {

  },
  methods: {

  }
}
</script>
