// Performance.getEntries() 方法以数组形式对网页中每一个对象（脚本文件、样式表、图片文件等等）发出的请求进行统计记录

const getPerformanceTiming = () => {
    // console.log(window.performance.timing)
    const t = performance.getEntriesByType('navigation')[0]
    console.log('****** performance timing ******', t)

    // 获得两个 PerformancePaintTiming 对象，对应的分别就是 FP 和 FCP
    const paint = performance.getEntriesByType('paint')
    console.log('****** performance paint ******', paint)

    // TODO:
    // Resource timing，记录的是子资源的请求到加载完成的各阶段耗时，子资源的性能数据可以通过 getEntriesByType 接口来查询，传入的类型为 resource。
    const resource = performance.getEntriesByType('resource')
    console.log('****** performance resource ******', resource)

    // DNS 缓存时间
    const appcache = t.domainLookupStart - t.fetchStart
    console.log('****** appcache ******', appcache)

    // 准备新页面耗时
    const rs = t.fetchStart - t.navigationStart
    console.log('****** rs ******', rs)

    // 重定向时间
    const rdc = t.redirectEnd - t.redirectStart
    console.log('****** rdc ******', rdc)

    const dnsLookup = t.domainLookupEnd - t.domainLookupStart
    console.log('****** dnsLookup ******', dnsLookup)

    // TCP 建立连接完成握手的时间
    const tcp = t.connectEnd - t.connectStart
    console.log('****** tcp ******', tcp)

    const ssl = t.secureConnectionStart === 0
        ? 0 : t.connectEnd - t.secureConnectionStart
    console.log('****** ssl ******', ssl)

    // 首字节时间，网络请求耗时
    const ttfb = t.responseStart - t.requestStart
    console.log('****** ttfb ******', ttfb)

    // tt
    const trans = t.responseEnd - t.responseStart
    console.log('****** trans ******', trans)

    // dpt
    const domParse = t.domInteractive - t.responseEnd
    console.log('****** domParse ******', domParse)

    // 资源加载耗时，表示页面中的同步加载资源
    const rlt = t.domComplete - t.domContentLoadedEventEnd
    const resourceDownload = t.loadEventStart - t.domContentLoadedEventEnd
    // const resourceDownload = t.loadEventStart - t.domInteractive
    console.log('****** rlt ******', rlt)
    console.log('****** resourceDownload ******', resourceDownload)

    const bt = t.responseStart - t.navigationStart
    console.log('****** bt ******', bt)

    // 首包时间
    const fbt = t.responseStart - t.domainLookupStart
    console.log('****** fbt ******', fbt)

    // fp
    // First paint refers to the point at which the first pixel renders on a screen after a user navigates to a web page. This excludes the default background paint, but includes non-default background paint.
    // 白屏时间是指浏览器从响应用户输入网址地址，到浏览器开始显示内容的时间。
    // 这个过程包括dns查询、建立tcp连接、发送首个http请求（如果使用https还要介入TLS的验证时间）、返回html文档、html文档head解析完毕。
    // 白屏时间 = 地址栏输入网址后回车 - 浏览器出现第一个元素
    // 影响白屏时间的因素：网络，服务端性能，前端页面结构设计。

    // fcp
    // First contentful paint occurs when a browser first renders any content from the document object model (DOM), including any text, images, non-white canvas, or scalable vector graphics (SVG) onto the page.
    // 首屏时间是指浏览器从响应用户输入网络地址，到首屏内容渲染完成的时间。
    // 首屏时间 = 地址栏输入网址后回车 - 浏览器第一屏渲染完成
    // 影响首屏时间的因素：白屏时间，资源下载、执行时间。

    // If your site loads content in the first moment of rendering, the values for first paint and first contentful paint will be the same.
    // If your site loads a background before any content (image, text, etc.), the values for first paint and first contentful paint will be different.
    // If your site dynamically updates content, values for first paint and first contentful paint will not be captured if they occur after the page load event.

    // fp
    // 首次渲染时间 / 白屏时间，从请求开始到浏览器开始解析第一批 HTML 文档字节的时间差
    // 从统计起始点到页面出现第一个元素的时间，可以使用 domLoading - fetchStart 或 domLoading - navigationStart。
    // 如果采用 Navigation Timing Level 2 的标准，则使用 domInteractive - fetchStart 或 domInteractive - navigationStart。
    const fpt = t.responseEnd - t.fetchStart
    console.log('****** fpt ******', fpt)

    const ttfb2 = t.responseStart - t.fetchStart
    console.log('****** ttfb2 ******', ttfb2)

    // 首次可交互时间，浏览器完成所有 HTML 解析并且完成 DOM 构建，此时浏览器开始加载资源
    const tti = t.domInteractive - t.fetchStart
    console.log('****** tti ******', tti)

    // domContentLoadedEventStart: DOM解析完后，domContentLoaded 事件开始时间
    const fr = t.domContentLoadedEventStart - t.fetchStart
    console.log('****** fr ******', fr)

    // 首屏时间：HTML 加载完成，DOM 生成就位
    // domContentLoadedEventEnd: DOM解析完后，domContentLoaded 事件结束时间
    const domReady = t.domContentLoadedEventEnd - t.fetchStart
    console.log('****** domReady ******', domReady)

    // 页面完全加载时间，load = 首次渲染时间 + DOM 解析耗时 + 同步 JS 执行 + 资源加载耗时
    const load = t.loadEventStart - t.fetchStart
    console.log('****** load ******', load)

    const unload = t.unloadEventEnd - t.unloadEventStart
    console.log('****** unload ******', unload)

    const times = {
        appcache,
        rs,
        rdc,
        dnsLookup,
        tcp,
        ssl,
        ttfb,
        trans,
        domParse,
        // 这里不知道为什么有时候 t.loadEventStart - t.domInteractive 返回一个很大的负数，暂时先简单处理
        rlt,
        resourceDownload: resourceDownload >= 0 ? resourceDownload : 1070,
        bt,
        fbt,
        fpt,
        fpt2: paint.length ? paint.filter(({ name }) => name === 'first-paint')[0].startTime : 0,
        ttfb2,
        tti,
        fr,
        domReady,
        load,
        unload
    }

    console.log('****** times ******', times)

    return times
}

export default getPerformanceTiming
