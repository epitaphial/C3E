<template>
  <div ref="main" style="width: 100%;"></div>
</template>

<script>
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js'
// import bus from '../../common/bus.js'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';

export default {
  name: 'monaco-editor',
  props: {
    filepath: String,
    required: false
    },
  data () {
    return {
      editor: null,
      curTheme: 'vs-light',
      value: `console.log("hello,world");`
    }
  },
  methods: {},
  created () {

  },
  mounted () {
    let fs = require('fs')
    let _this = this
    if (this.filepath === null) { // 新建标签页的情况
          this.editor = monaco.editor.create(
            this.$refs.main, {theme: this.curTheme, automaticLayout: true, language: 'javascript', value: this.value, fontSize: 20}
          )
    } else {
      fs.readFile(this.filepath, 'utf8', function(err, data) { // 打开文件的情况
        if (err === null) {
          _this.value = data
          _this.editor = monaco.editor.create(
            _this.$refs.main, {theme: _this.curTheme, automaticLayout: true, language: 'javascript', value: _this.value, fontSize: 20}
          )
          } else {
            console.log(err);
          }
        });
    }
  }
}
</script>


<style>
</style>  
