// 递归，遍历存储文件树的对象，插入节点
let addNode = function (dirTree, pDir, nodeName, ifDir, slash) {
    if (dirTree.path === pDir) {
        dirTree.children.push({
            ifdir: ifDir,
            label: nodeName,
            path: pDir + slash + nodeName,
            children: []
        })
    } else {
        for (let index = 0; index < dirTree.children.length; index++) {
            dirTree.children[index] = addNode(dirTree.children[index], pDir, nodeName, ifDir, slash)
        }
    }
    return dirTree
}

// 语言后缀名替换为Monaco language
let languageList = [{
    id: 'abap',
    extensions: ['.abap']
},
{
    id: 'apex',
    extensions: ['.cls']
},
{
    id: 'azcli',
    extensions: ['.azcli']
},
{
    id: 'bat',
    extensions: ['.bat', '.cmd']
},
{
    id: 'cameligo',
    extensions: ['.mligo']
},
{
    id: 'clojure',
    extensions: ['.clj', '.cljs', '.cljc', '.edn']
},
{
    id: 'coffeescript',
    extensions: ['.coffee']
},
{
    id: 'c',
    extensions: ['.c', '.h']
},
{
    id: 'cpp',
    extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx']
},
{
    id: 'csharp',
    extensions: ['.cs', '.csx', '.cake']
},
{
    id: 'css',
    extensions: ['.css']
},
{
    id: 'dockerfile',
    extensions: ['.dockerfile'],
    filenames: ['Dockerfile']
},
{
    id: 'fsharp',
    extensions: ['.fs', '.fsi', '.ml', '.mli', '.fsx', '.fsscript']
},
{
    id: 'go',
    extensions: ['.go']
},
{
    id: 'graphql',
    extensions: ['.graphql', '.gql']
},
{
    id: 'handlebars',
    extensions: ['.handlebars', '.hbs']
},
{
    id: 'html',
    extensions: ['.html', '.htm', '.shtml', '.xhtml', '.mdoc', '.jsp', '.asp', '.aspx', '.jshtm']
},
{
    id: 'ini',
    extensions: ['.ini', '.properties', '.gitconfig'],
    filenames: ['config', '.gitattributes', '.gitconfig', '.editorconfig']
},
{
    id: 'java',
    extensions: ['.java', '.jav']
},
{
    id: 'javascript',
    extensions: ['.js', '.es6', '.jsx'],
    filenames: ['jakefile']
},
{
    id: 'kotlin',
    extensions: ['.kt']
},
{
    id: 'less',
    extensions: ['.less']
},
{
    id: 'lua',
    extensions: ['.lua']
},
{
    id: 'markdown',
    extensions: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext']
},
{
    id: 'mips',
    extensions: ['.s']
},
{
    id: 'objective-c',
    extensions: ['.m']
},
{
    id: 'pascal',
    extensions: ['.pas', '.p', '.pp']
},
{
    id: 'perl',
    extensions: ['.pl']
},
{
    id: 'php',
    extensions: ['.php', '.php4', '.php5', '.phtml', '.ctp']
},
{
    id: 'powershell',
    extensions: ['.ps1', '.psm1', '.psd1']
},
{
    id: 'pug',
    extensions: ['.jade', '.pug']
},
{
    id: 'python',
    extensions: ['.py', '.rpy', '.pyw', '.cpy', '.gyp', '.gypi']
},
{
    id: 'r',
    extensions: ['.r', '.rhistory', '.rprofile', '.rt']
},
{
    id: 'ruby',
    extensions: ['.rb', '.rbx', '.rjs', '.gemspec', '.pp'],
    filenames: ['rakefile']
},
{
    id: 'rust',
    extensions: ['.rs', '.rlib']
},
{
    id: 'scheme',
    extensions: ['.scm', '.ss', '.sch', '.rkt']
},
{
    id: 'scss',
    extensions: ['.scss']
},
{
    id: 'shell',
    extensions: ['.sh', '.bash']
},
{
    id: 'sol',
    extensions: ['.sol']
},
{
    id: 'sql',
    extensions: ['.sql']
},
{
    id: 'swift',
    aliases: ['Swift', 'swift']
},
{
    id: 'typescript',
    extensions: ['.ts', '.tsx']
},
{
    id: 'vb',
    extensions: ['.vb']
},
{
    id: 'xml',
    extensions: ['.xml', '.dtd', '.ascx', '.csproj', '.config', '.wxi', '.wxl', '.wxs', '.xaml', '.svg', '.svgz', '.opf', '.xsl']
},
{
    id: 'yaml',
    extensions: ['.yaml', '.yml']
}
]

let lpcprint = function (message) {
    console.log(message)
}

let getLanguageId = function (languageList, suffix, filename) {
    let languageId = 'plaintext'
    for (let index = 0; index < languageList.length; index++) {
        // 判断DockerFile一类的无后缀名文件
        if (languageList[index].filenames !== undefined) {
            for (
                let nameIndex = 0;
                nameIndex < languageList[index].filenames.length;
                nameIndex++
            ) {
                if (
                    languageList[index].filenames[nameIndex].toLowerCase() ===
                    filename.toLowerCase()
                ) {
                    languageId = languageList[index].id
                    break
                }
            }
        }
        // 判断有后缀名的文件
        if (languageList[index].extensions !== undefined) {
            for (
                let extIndex = 0;
                extIndex < languageList[index].extensions.length;
                extIndex++
            ) {
                if (
                    languageList[index].extensions[extIndex].toLowerCase() ===
                    suffix.toLowerCase()
                ) {
                    languageId = languageList[index].id
                }
            }
        }
    }
    return languageId
}

let getFileNameFromPath = function (path) {
    let pos = path.lastIndexOf('/')
    if (pos === -1) {
      pos = path.lastIndexOf('\\')
    }
    let filename = path.substring(pos + 1)
    return filename
}
export { addNode, getLanguageId, lpcprint, getFileNameFromPath, languageList }
