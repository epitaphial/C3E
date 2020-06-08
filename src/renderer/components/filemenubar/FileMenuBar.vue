<template>
<div style="padding: 0;margin-top: 40px;height: 100%;width: 20%;user-select: none;">
<el-scrollbar style="height:90%">
    <el-tree ref="filemenubar" :data="data" node-key="id" highlight-current :icon-class="'el-icon-edit'" :default-expanded-keys="defaultExp" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
</el-scrollbar>
</div>
</template>

<script>
  let ipcRenderer = require('electron').ipcRenderer
  export default {
    data() {
      return {
        defaultExp: [],
        currentId: 0,
        unnameMount: 0,
        fileMount: 0,
        data: [{
          label: '编辑区文件',
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    created() {
      let _this = this
        // 信号1，来自MenuBar.vue的打开文件信号，信号名：selectedFile，接收参数：事件、文件路径
        ipcRenderer.on('selectedFile', function (event, path) {
            // console.log(path)
            let strpath = String(path)
            // 判断文件是否已经在文件菜单内
            let filemenu = _this.data[0]['children']
            let ifExist = false
            let existId = null
            for (let index = 0; index < filemenu.length; index++) {
              if (filemenu[index]['path'] === strpath) {
                ifExist = true
                existId = filemenu[index]['id']
                break
              }
            }
            if (ifExist === false) {
                // 获取到文件路径和文件名加入菜单
                let pos = strpath.lastIndexOf('/')
                if (pos === -1) {
                    pos = strpath.lastIndexOf('\\')
                }
                let filename = strpath.substring(pos + 1)
                let filelabel = filename + `(${strpath})`
                _this.data[0]['children'].push({id: _this.fileMount, label: filelabel, file: filename, path: strpath})
                _this.currentId = _this.fileMount;
                _this.fileMount++
                let __this = _this
                _this.$nextTick(function () {
                  __this.refRecursion(__this.currentId, 1)
                  })
            } else { // 说明已经存在该文件，高亮处理
                _this.currentId = existId;
                _this.$refs['filemenubar'].setCurrentKey(existId);
            }
        })
        // 信号2，来自EditorsTab.vue的新建文件信号，信号名：fileMenuNewFile，接收参数：事件、数据
        ipcRenderer.on('fileMenuNewFile', function (event, data) {
          _this.currentId = _this.fileMount
          _this.data[0]['children'].push({id: _this.fileMount, label: 'unname' + _this.unnameMount, file: 'unname', path: null})
          _this.unnameMount++
          _this.fileMount++
          let __this = _this
          _this.$nextTick(function () {
            __this.refRecursion(__this.currentId, 1)
          })
        })
        // 信号3，来自EditorsTab.vue的关闭文件信号，信号名：fileMenuRemoveFile，接收参数：事件、数据
        ipcRenderer.on('fileMenuRemoveFile', function (event, data) {
          if (data['path'] === null) { // 此时为unname文件
            for (let index = 0; index < _this.data[0]['children'].length; index++) {
              if (_this.data[0]['children'][index]['label'] === data['name']) {
                _this.data[0]['children'].splice(index, 1);
                break
              }
            }
          } else { // 此时为非unname文件
              for (let index = 0; index < _this.data[0]['children'].length; index++) {
                if (_this.data[0]['children'][index]['path'] === data['path']) {
                  _this.data[0]['children'].splice(index, 1);
                  break
                }
              }
            }
          if (data['activetab'] !== null) { // 此时EditorsTab关闭的是当前标签页
            if (data['activetab']['path'] === null) { // 此时关闭的是空文件
              for (let index = 0; index < _this.data[0]['children'].length; index++) {
                if (_this.data[0]['children'][index]['label'] === data['activetab']['title']) {
                  _this.currentId = _this.data[0]['children'][index]['id']
                  let __this = _this
                  _this.$nextTick(function () {
                    __this.refRecursion(__this.currentId, 1)
                    })
                  break
                }
              }
            } else {
              for (let index = 0; index < _this.data[0]['children'].length; index++) {
                if (_this.data[0]['children'][index]['path'] === data['activetab']['path']) {
                  _this.currentId = _this.data[0]['children'][index]['id']
                  let __this = _this
                  _this.$nextTick(function () {
                    __this.refRecursion(__this.currentId, 1)
                    })
                  break
                }
              }
            }
          }
        })
    },
    mounted() {

    },
    methods: {
      refRecursion (key, time) {
        if (time > 10) throw new Error('没有找到 vueTree')
        let tree = this.$refs['filemenubar']
        if (tree) {
          this.defaultExp = [key]
          tree.setCurrentKey(key)
        } else {
          this.refRecursion(key, time + 1)
        }
      },
      handleNodeClick(data) {
      }
    }
  };
</script >

<style lang="less">
  .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
  .el-tree>.el-tree-node{
    min-width: 100%;
    display:inline-block;
}
</style>
