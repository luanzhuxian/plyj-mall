const archiver = require('archiver')
const fs = require('fs')
const join = require('path').join
const crypto = require('crypto')
const md5 = crypto.createHash('md5')

const version = require('./package.json').version
const proName = require('./package.json').name
const projectDir = `\\\\192.168.0.21\\public\\weimall\\${ proName }`

const archive = archiver('zip', {
    zlib: { level: 9 }
})

const upload = async (size, fileName) => {
    try {
        const dirPath = `${ projectDir }\\${ version }`
        console.log(`正在上传文件至：${ dirPath }`)
        await fs.promises.mkdir(dirPath)
        const output = fs.createWriteStream(`${ dirPath }\\${ fileName }`)
        const readStream = fs.createReadStream(join(__dirname, fileName))
        let len = 0
        readStream.on('data', chunk => {
            md5.update(chunk)
            len += chunk.length
            console.log(`${ (len / size * 100).toFixed(2) }%`)
        })
        output.on('close', () => {
            console.log(`上传完成，请复制路径给上线人员：${ dirPath }`)
            // 生成md5
            const md5Val = md5.digest('hex')
            fs.writeFile(`${ dirPath }\\MD5.txt`, md5Val, err => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log('MD5:', md5Val)
            })
        })
        output.on('error', err => {
            console.error(err)
            console.log('上传失败，SMB服务链接失败，请手动上传')
        })
        readStream.pipe(output)
    } catch (e) {
        console.error('上传失败：', e.message)
    }
}

const openDir = async () => {
    console.log('-------------------- 正在压缩文件，压缩级别：9 --------------------')
    const D1 = Date.now()
    const name = `${ proName }_v${ version }.zip`
    const output = fs.createWriteStream(join(__dirname, name))
    output.on('close', () => {
        console.log(`-------------------- 压缩完成：${ name } --------------------`)
        console.log(`-------------------- 用时：${ Date.now() - D1 }ms --------------------`)
        console.log(`-------------------- 压缩后大小：${ (archive.pointer() / 1024).toFixed(3) }kb --------------------`)
        upload(archive.pointer(), name)
    })
    archive.pipe(output)
    await archive.directory(`${ proName }/`, false)
    archive.finalize()
}
openDir()
