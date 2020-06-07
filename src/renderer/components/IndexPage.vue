<template>
<el-container id="wrapper">
  <MenuBar></MenuBar>
  <el-container>
    <el-aside width="300px">文件树视图</el-aside>
    <el-container>
      <el-main>编辑器视图</el-main>
      <el-footer height="200px">终端视图</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
  import MenuBar from './menubar/MenuBar'
  export default {
    name: 'index-page',
    components: {MenuBar},
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  html,
  body,
  div {
    margin: 0;
    padding: 0;
  }

  #wrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

 .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 50px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 100px;
  }
</style>
