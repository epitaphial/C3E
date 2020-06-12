<template>
  <div ref="main" style="width: 100%"></div>
</template>

<script>
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
// import bus from '../../common/bus.js'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/basic-languages/monaco.contribution.js'
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js'
import { getLanguageId, getFileNameFromPath } from '../../common/tools'

let ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'monaco-editor',
  props: {
    filepath: String,
    title: String
  },
  data() {
    return {
      theLanguageList: null,
      path: this.filepath,
      editor: null,
      curTheme: 'vs-light',
      value: ''
    }
  },
  methods: {},
  created() {
    this.theLanguageList = monaco.languages.getLanguages()
    let fs = require('fs')
    // 信号1，来自MonacoEditor.vue的保存信号，信号名：saveFile，接收参数：事件、{文件路径,文件名}
    ipcRenderer.on('saveFile', (event, data) => {
      this.value = this.editor.getValue()
      if (data.path !== undefined && data.thetitle === this.title) {
        fs.writeFileSync(data.path, this.value, 'utf8') // 修改后的内容写入文件
        this.path = data.path
        let filename = getFileNameFromPath(this.path)
        let index = filename.lastIndexOf('.')
        let suffix = filename.substring(index)
        let languageId = getLanguageId(this.theLanguageList, suffix, filename)
        // 保存后的文件也根据文件名判断高亮
        monaco.editor.setModelLanguage(this.editor.getModel(), languageId)
        ipcRenderer.send('unnamed-file-has-saved', {
          path: data.path,
          title: this.title
        })
      }
    })
  },
  mounted() {
    // 每调用一次create，monaco.editor model 数量+1
    let fs = require('fs')
    if (this.path === null) {
      // 新建标签页的情况
      this.editor = monaco.editor.create(this.$refs['main'], {
        theme: this.curTheme,
        automaticLayout: false,
        language: 'plaintext',
        value: this.value,
        fontSize: 20
      })
    } else {
      // 取文件后缀名
      let filename = this.title
      let index = filename.lastIndexOf('.')
      let suffix = filename.substring(index)
      let languageId = getLanguageId(this.theLanguageList, suffix, filename)
      let data = fs.readFileSync(this.path, 'utf8')
      this.value = data
      this.editor = monaco.editor.create(this.$refs['main'], {
        theme: this.curTheme,
        automaticLayout: false,
        language: languageId,
        value: this.value,
        fontSize: 20
      })
    }
    this.editor.onDidChangeModelContent(() => {
      // 当编辑器内容变了
      ipcRenderer.send('editor-content-has-changed', {
        path: this.path,
        title: this.title
      })
    })
    this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      if (this.path == null) {
        // 是unname文件的情况
        this.value = this.editor.getValue()
        ipcRenderer.send('save-file', this.title)
      } else {
        this.value = this.editor.getValue()
        fs.writeFileSync(this.path, this.value, 'utf8') // 修改后的内容写入文件
        ipcRenderer.send('not-first-time-save-file', this.path)
      }
    })
    // 信号2，来自EditorsTab.vue的保存按钮点击事件，信号名：saveFileByButtonFromTab，接收参数：事件,{路径，文件名}
    ipcRenderer.on('saveFileByButtonFromTab', (event, data) => {
      if (data.path === this.path && data.title === this.title) {
        if (data.path === null) {
          this.value = this.editor.getValue()
          ipcRenderer.send('save-file', this.title)
        } else {
          this.value = this.editor.getValue()
          fs.writeFileSync(this.path, this.value, 'utf8') // 修改后的内容写入文件
          ipcRenderer.send('not-first-time-save-file', this.path)
        }
      }
    })
  }
}
</script>


<style>
</style>  
