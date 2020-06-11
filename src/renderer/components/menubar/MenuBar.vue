<template>
    <el-header height="30px" class="top-nav">
          <div class="logo">
<i class="el-icon-edit">乾天</i>
      </div>
      <div class="mainmenu">
<el-dropdown>
  <span class="el-dropdown-link">
    文件
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item @click.native="newFile">新建文件</el-dropdown-item>
    <el-dropdown-item @click.native="newWindow" disabled>新建窗口</el-dropdown-item>
    <el-dropdown-item @click.native="openFileDialog" divided>打开文件</el-dropdown-item>
    <el-dropdown-item @click.native="openDirDialog" disabled>打开文件夹</el-dropdown-item>
    <el-dropdown-item @click.native="saveFile" divided>保存</el-dropdown-item>
    <el-dropdown-item @click.native="saveFileToOther" disabled>另存为</el-dropdown-item>
    <el-dropdown-item @click.native="closeFile" divided>关闭文件</el-dropdown-item>
    <el-dropdown-item @click.native="closeWindow">退出</el-dropdown-item>
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
  let ipcRenderer = require('electron').ipcRenderer
  let isBig = true // 窗口放大还原标示

  export default {
    name: 'menu-bar',
    components: {},
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      openFileDialog () {
        ipcRenderer.send('open-file-dialog')
      },
      closeWindow () {
        ipcRenderer.send('close-window')
      },
      newFile () {
        ipcRenderer.send('new-file')
      },
      saveFile () {
        ipcRenderer.send('save-file-by-button')
      },
      closeFile () {
        ipcRenderer.send('close-file-by-button')
      }
    },
    mounted () {
      // 关闭窗口
      $(document).on('click', '.close', function () {
        console.log(1)
        ipcRenderer.send('close-window')
      })
      // 最大化
      $(document).on('click', '.max', function () {
        if (isBig) {
          ipcRenderer.send('max-window')
        } else {
          ipcRenderer.send('max-window')
        }
        isBig = !isBig
      })
      // 最小化
      $(document).on('click', '.min', function () {
        ipcRenderer.send('min-window')
      })
    }
  }
</script >

<style lang="less">
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select:none;
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
  .mainmenu{
    -webkit-app-region:no-drag;
    user-select:none;
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
