<template>
<div style="padding: 0;margin-top: 25px;height: 100%">
<el-tabs v-model="editableTabsValue" type="card" editable @tab-click="handleTabsClick" @edit="handleTabsEdit">
  <el-tab-pane
    :key="item.name"
    v-for="(item, index) in editableTabs"
    :label="item.title"
    :name="item.name"
  >
<MonacoEditor style="padding: 0;margin: 0;height: 600px" :filepath = "item.path" :title="item.title" :id="item.title"></MonacoEditor>
  </el-tab-pane> 
</el-tabs>
</div>
</template>
<script>
  import MonacoEditor from './MonacoEditor';
  let ipcRenderer = require('electron').ipcRenderer
  export default {
    name: 'editors-tab',
    components: {MonacoEditor},
    data() {
      return {
        editableTabsValue: '0', // 当前选中的tab的name
        editableTabs: [], // 所有的tab对象数组，数组成员对象形式：{title: filename,name: newTabName,path: strpath}，说明：title（显示在tab上的内容），name（一个整数，标识tab的id），path（tab所属的文件的路径，如果是unname文件则为null）
        tabIndex: 0, // tab总数
        unnameMount: 0, // unname文件总数
        editedMark: ' ●', // 如果被修改，加上此符号
        originName: {} // 用于存储tab原来的名字，区别修改后加上‘●’的名字
      }
    },
    created() {
        let _this = this
        // 信号1，来自MenuBar.vue的打开文件信号，信号名：selectedFile，接收参数：事件、文件路径
        ipcRenderer.on('selectedFile', function (event, path) {
            let strpath = String(path)
            // 判断文件是否已经在编辑器内
            let tabs = _this.editableTabs
            let editableName = null
            for (let index = 0; index < tabs.length; index++) {
                if (tabs[index].path === strpath) {
                    editableName = tabs[index].name
                    break
                }
            }
            if (editableName === null) {
                // 获取到文件路径和文件名发送到editorstab处理
                let pos = strpath.lastIndexOf('/')
                if (pos === -1) {
                    pos = strpath.lastIndexOf('\\')
                }
                let filename = strpath.substring(pos + 1)
                let newTabName = ++_this.tabIndex + ''
                _this.editableTabs.push({
                    title: filename,
                    name: newTabName,
                    path: strpath
                    });
                _this.editableTabsValue = newTabName
                _this.originName[newTabName] = filename
            } else { // 说明已经存在该文件
                _this.editableTabsValue = editableName
            }
        })
        // this.editor.dispose();
        // 信号2，来自MenuBar.vue的新建文件事件，信号名：newFile，接收参数：事件、null
        ipcRenderer.on('newFile', function (event, data) {
            _this.handleTabsEdit(null, 'add')
        })
        // 信号3，来自FileMenuBar.vue的通过菜单树切换tab的信号，信号名：changeTabFromFileMenu，接收参数：事件、{文件名，文件路径}
        ipcRenderer.on('changeTabFromFileMenu', function (event, thedata) {
            let tabs = _this.editableTabs
            if (thedata.path !== undefined) {
                if (thedata.path === null) {
                    for (let index = 0; index < tabs.length; index++) {
                        if (tabs[index].title === thedata.label) {
                            _this.editableTabsValue = tabs[index].name
                            break
                        }
                    }
                } else {
                    for (let index = 0; index < tabs.length; index++) {
                        if (tabs[index].path === thedata.path) {
                            _this.editableTabsValue = tabs[index].name
                            break
                        }
                    }
                }
            }
        })
        // 信号4，来自MonacoEditor.vue的编辑器区域被修改事件，信号名：editorContentHasChanged，接收参数：事件、{文件名，文件路径}
        ipcRenderer.on('editorContentHasChanged', function (event, thedata) {
            let tabs = _this.editableTabs
            if (thedata.path !== undefined) {
                if (thedata.path === null) { // 变化的是unname文件
                    for (let index = 0; index < tabs.length; index++) {
                        if (tabs[index].title === thedata.title) {
                            _this.editableTabs[index].title = _this.originName[tabs[index].name] + _this.editedMark
                            break
                        }
                    }
                } else {
                    for (let index = 0; index < tabs.length; index++) {
                        if (tabs[index].path === thedata.path) {
                            _this.editableTabs[index].title = _this.originName[tabs[index].name] + _this.editedMark
                            break
                        }
                    }
                }
            }
        })
    },
    methods: {
      handleTabsClick(thetab) { // 点击标签时
          let tabs = this.editableTabs
          tabs.forEach((tab, index) => {
              if (tab.name === thetab['name']) {
                  ipcRenderer.send('change-file-menu-from-tab', {path: tab.path, title: tab.title})
                }
            });
      },
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + ''
          let theTitle = 'unname' + this.unnameMount++
          this.editableTabs.push({
            title: theTitle,
            name: newTabName,
            path: null
          });
          this.editableTabsValue = newTabName
          // 发送信号，通知FileMenuBar更新树形目录
          ipcRenderer.send('filemenu-new-file')
          this.originName[newTabName] = theTitle
        }
        if (action === 'remove') {
          let tabs = this.editableTabs
          let activeName = this.editableTabsValue
          let ifCloseCurrTab = (activeName === targetName)
          let sendRemoveInfo = {path: null, name: null, activetab: null}
          let activeTabAfterClose = null
          tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                  // 发送信号，通知FileMenuBar删除目录中相应项
                  sendRemoveInfo['path'] = tab.path
                  sendRemoveInfo['name'] = tab.title
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                    activeName = nextTab.name;
                    activeTabAfterClose = {title: nextTab.title, path: nextTab.path}
                  }
                }
            });
          this.editableTabs = tabs.filter(tab => tab.name !== targetName)
          if (ifCloseCurrTab) {
              this.editableTabsValue = activeName
          } else {
              activeTabAfterClose = null
          }
          sendRemoveInfo['activetab'] = activeTabAfterClose
          ipcRenderer.send('filemenu-remove-file', sendRemoveInfo)
        }
      }
    }
  }
</script>

<style>

</style>