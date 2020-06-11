<template>
  <div ref="main" style="width: 100%"></div>
</template>

<script>
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
// import bus from '../../common/bus.js'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';

let ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'monaco-editor',
  props: {
    filepath: String,
    title: String
    },
  data () {
    return {
      path: this.filepath,
      editor: null,
      curTheme: 'vs-light',
      value: `console.log("hello,world");`
    }
  },
  methods: {},
  created () {
    let fs = require('fs')
    // 信号1，来自MonacoEditor.vue的保存信号，信号名：saveFile，接收参数：事件、{文件路径,文件名}
    ipcRenderer.on('saveFile', (event, data) => {
        this.value = this.editor.getValue()
        if (data.path !== undefined && data.thetitle === this.title) {
          fs.writeFileSync(data.path, this.value, 'utf8') // 修改后的内容写入文件
          this.path = data.path
          ipcRenderer.send('unnamed-file-has-saved', {path: data.path, title: this.title})
        }
      })
  },
  mounted () {
    // 每调用一次create，monaco.editor model 数量+1
    let fs = require('fs')
    if (this.path === null) { // 新建标签页的情况
          this.editor = monaco.editor.create(
            this.$refs['main'], {theme: this.curTheme, automaticLayout: false, language: 'javascript', value: this.value, fontSize: 20}
          )
    } else {
      let data = fs.readFileSync(this.path, 'utf8')
      this.value = data
      this.editor = monaco.editor.create(
        this.$refs['main'], {theme: this.curTheme, automaticLayout: false, language: 'javascript', value: this.value, fontSize: 20}
        )
    }
    this.editor.onDidChangeModelContent(() => { // 当编辑器内容变了
      ipcRenderer.send('editor-content-has-changed', {path: this.path, title: this.title})
    })
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      if (this.path == null) { // 是unname文件的情况
        this.value = this.editor.getValue()
        ipcRenderer.send('save-file', this.title)
      } else {
        this.value = this.editor.getValue()
        fs.writeFileSync(this.path, this.value, 'utf8') // 修改后的内容写入文件
        ipcRenderer.send('not-first-time-save-file', this.path)
      }
      })
  }
}
</script>


<style>
</style>  
