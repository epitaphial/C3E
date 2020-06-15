<template>
  <div id="editor-body" ref="main" style="height: 100%"></div>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
import { getLanguageId, getFileNameFromPath } from '../../common/tools'

let ipcRenderer = require('electron').ipcRenderer
const iconvLite = require('iconv-lite')
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
      value: '',
      encoding: 'utf8'
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
        fs.writeFileSync(data.path, this.value) // 修改后的内容写入文件
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
    // 信号2，来自MenuBar.vue的保存信号，信号名：showFindBox，接收参数：无
    ipcRenderer.on('showFindBox', () => {
      this.editor.getAction('actions.find').run()
    })
    // 信号3，来自EditorsTab.vue的文字复制粘贴另存为事件，信号名：editorTextActionFromTab，接收参数：事件,{路径，文件名}
    ipcRenderer.on('editorTextActionFromTab', (event, data) => {
      if (data.path === this.path && data.title === this.title) {
        let action = data.action
        if (action === 1) {
          // 剪切
          this.editor.getAction('editor.action.clipboardCutAction').run()
        } else if (action === 2) {
          // 复制
          this.editor.getAction('editor.action.clipboardCopyAction').run()
        } else if (action === 3) {
          // 粘贴
          this.editor.getAction('editor.action.clipboardPasteAction').run()
        } else if (action === 4) {
          alert(`当前文件的编码为：${this.encoding}`)
        } else if (action === 5 && data.path !== null) {
          ipcRenderer.send('save-file-to-other', {
            encoding: 'utf8',
            path: data.path,
            title: this.title
          })
        } else if (action === 6 && data.path !== null) {
          ipcRenderer.send('save-file-to-other', {
            // when gbk
            encoding: 'gbk',
            path: data.path,
            title: this.title
          })
        }
      }
    })
    // 信号4，来自MonacoEditor.vue的另存为信号，信号名：saveFileToOther，接收参数：事件、{文件路径,文件名}
    ipcRenderer.on('saveFileToOther', (event, data) => {
      this.value = this.editor.getValue()
      if (data.path !== undefined && data.path === this.path) {
        if (data.encoding === 'gbk') {
          let gbkStr = iconvLite.encode(this.value, 'gbk');
          fs.writeFileSync(data.file, gbkStr)
        } else if (data.encoding === 'utf8') {
          fs.writeFileSync(data.file, this.value)
        }
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
        automaticLayout: true,
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
      // 判断文件编码
      let guessdata = fs.readFileSync(this.path)
      let jschardet = require('jschardet')
      this.encoding = jschardet.detect(guessdata).encoding
      let data = fs.readFileSync(this.path, 'utf8')
      if (this.encoding === 'GB2312') {
        let gbkData = iconvLite.decode(guessdata, 'gbk')
        data = gbkData
      } else if (this.encoding === 'Big5') {
        const iconvLite = require('iconv-lite')
        let gbkData = iconvLite.decode(guessdata, 'big5')
        data = gbkData
      } else if (this.encoding === 'windows-1252') {
        const iconvLite = require('iconv-lite')
        let gbkData = iconvLite.decode(guessdata, 'utf16')
        data = gbkData
      }

      this.value = data
      this.editor = monaco.editor.create(this.$refs['main'], {
        theme: this.curTheme,
        automaticLayout: true,
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
        fs.writeFileSync(this.path, this.value) // 修改后的内容写入文件
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
          fs.writeFileSync(this.path, this.value) // 修改后的内容写入文件
          ipcRenderer.send('not-first-time-save-file', this.path)
        }
      }
    })
    // 信号3，来自EditorsTab.vue的切换标签页事件，信号名：changeTab，接收参数：事件,{路径，文件名}
    ipcRenderer.on('changeTab', (event, data) => {
      if (data.path === this.path && data.title === this.title) {
        this.editor.layout()
      }
    })
  },
  beforeDestroy() {
  }
}
</script>


<style>
#editor-body {
  position: relative;
}
</style>  
