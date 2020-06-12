<template>
  <el-container id="wrapper">
    <MenuBar></MenuBar>
    <el-container>
      <FileMenuBar></FileMenuBar>
      <hr />
      <el-container width="80%">
        <EditorsTab height="80%"></EditorsTab>
        <el-footer height="20%">终端视图</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import MenuBar from './menubar/MenuBar'
import EditorsTab from './editorcore/EditorsTab'
import FileMenuBar from './filemenubar/FileMenuBar'
export default {
  name: 'index-page',
  components: { MenuBar, EditorsTab, FileMenuBar },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    getFilePath(data) {
      console.log(data)
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

#wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 50px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
</style>
