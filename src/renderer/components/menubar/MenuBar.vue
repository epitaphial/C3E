<template>
    <el-header height="30px" class="top-nav">
          <div class="logo">
<i class="el-icon-edit"></i>
      </div>
      <div class="search">
<el-dropdown>
  <span class="el-dropdown-link">
    文件
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>黄金糕</el-dropdown-item>
    <el-dropdown-item>狮子头</el-dropdown-item>
    <el-dropdown-item>螺蛳粉</el-dropdown-item>
    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
    <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
<el-dropdown>
  <span class="el-dropdown-link">
    编辑
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>黄金糕</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
<el-dropdown>
  <span class="el-dropdown-link">
    视图
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>黄金糕</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
<el-dropdown>
  <span class="el-dropdown-link">
    终端
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>黄金糕</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
<el-dropdown>
  <span class="el-dropdown-link">
    拓展
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>黄金糕</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
<el-dropdown>
  <span class="el-dropdown-link">
    帮助
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>黄金糕</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
      </div>
      <div class="tools">
        <span class="tool-icon min"><i class="el-icon-remove-outline"></i></span>
        <span class="tool-icon max"><i class="el-icon-copy-document"></i></span>
        <span class="tool-icon close"><i class="el-icon-circle-close"></i></span>
      </div>
    </el-header>
</template>

<script>
  import $ from 'jquery'
  var ipcRenderer = require('electron').ipcRenderer
  var isBig = true // 窗口放大还原标示

  export default {
    name: 'menubar',
    components: {},
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    },
    mounted () {
      // 关闭窗口
      $(document).on('click', '.close', function () {
        console.log(1)
        ipcRenderer.send('close')
      })
      // 最大化
      $(document).on('click', '.max', function () {
        if (isBig) {
          ipcRenderer.send('max')
        } else {
          ipcRenderer.send('max')
        }
        isBig = !isBig
      })
      // 最小化
      $(document).on('click', '.min', function () {
        ipcRenderer.send('min')
      })
    }
  }
</script >

<style lang="less">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }


  .top-nav {
    background: #B3C0D1;
    position: fixed;
    -webkit-user-select: none;
    -webkit-app-region: drag;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    .logo {
      width: 48px;
      height: 48px;
      float: left;
      padding-top: 5px;
      // background: #000;
      // background: url(../assets/logo.png) no-repeat 0 0;
      // background-size: 100%
    }
    .tools{
      -webkit-app-region:no-drag;
      float: right;
      color: #000;
      margin-top:8px;
      .tool-icon{
        padding: 10px;
        cursor: pointer;
        &:hover{
          color: #fff;
        }
      }
    }
  }
  .search{
    -webkit-app-region:no-drag;
    position: relative;
    float: left;
    padding: 5px 0 0 20px;

    .el-dropdown-link {
    cursor: pointer;
    }
    .el-dropdown {
      padding-left: 20px;
    }
  }
</style>
