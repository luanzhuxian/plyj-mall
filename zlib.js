const archiver = require('archiver')
const fs = require('fs')
const join = require('path').join
const version = require('./package.json').version
const proName = require('./package.json').name
const archive = archiver('zip', {
    zlib: { level: 9 }
})
const openDir = async path => {
    console.log('-------------------- 正在压缩文件，压缩级别：9 --------------------')
    const D1 = Date.now()
    const name = `${ proName }_v${ version }.zip`
    const output = fs.createWriteStream(join(__dirname, name))
    output.on('close', () => {
        console.log(`-------------------- 压缩完成：${ name } --------------------`)
        console.log(`-------------------- 用时：${ Date.now() - D1 }ms --------------------`)
        console.log(`-------------------- 压缩后大小：${ (archive.pointer() / 1024).toFixed(3) }kb --------------------`)
    })
    archive.pipe(output)
    await archive.directory(`${ path }/`, false)
    archive.finalize()
}
openDir('mall')
