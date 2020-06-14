<template>
  <div class="console" id="terminal"></div>
</template>

<script>
import { Terminal } from 'xterm'
import './xterm.css'
export default {
  name: 'web-terminal',
  methods: {
    init() {
      let term = new Terminal({
        cursorBlink: true, // 光标闪烁
        convertEol: true, // 启用时，光标将设置为下一行的开头
        disableStdin: false, // 是否应禁用输入。
        theme: {
          foreground: 'white', // 字体
          background: '#000', // 背景色
          cursor: 'help' // 设置光标
        }
      })
      term.open(document.getElementById('terminal'))
      function runFakeTerminal() {
        if (term._initialized) {
          return
        }
        term._initialized = true
        term.prompt = () => {
          term.write('\r\n~$ ')
        }
        term.writeln('Welcome to Cheetah editor!')
        prompt(term)
        term.onKey(e => {
          const printable =
            !e.domEvent.altKey &&
            !e.domEvent.altGraphKey &&
            !e.domEvent.ctrlKey &&
            !e.domEvent.metaKey
          // enter key
          if (e.domEvent.keyCode === 13) {
            prompt(term)
          } else if (e.domEvent.keyCode === 8) {
            // BackSpace key
            if (term._core.buffer.x > 2) {
              term.write('\b \b')
            }
          } else if (printable) {
            term.write(e.key)
          }
        })
      }
      function prompt(term) {
        term.write('\r\n~$ ')
      }
      runFakeTerminal()
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style>
</style>
