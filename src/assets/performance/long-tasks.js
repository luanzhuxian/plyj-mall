// https://juejin.cn/post/6960924212030603271

// Navigaiton Timing: 页面导航性能
// Resource Timing: 子资源加载性能
// Paint Timing: FP / FCP
// Element Timing: 自定义 LCP
// Event Timing: FID
// Layout Instability API: CLS
// Long Tasks API: 长任务优化
// Frame API: 慢帧优化

// 我们稍微总结一下，我们使用 Navigation Timing 获取的是页面的导航性能，Resource Timing 用于获取子资源的加载性能，中间加粗的 4 个部分，测试的是我们接下来要介绍的用户指标，最后是长任务 API 和 Frame Timing，提供了我们应用需要关注的优化信息。除了提供度量 API 外表性能工作组也提供了一系列优化策略的API页面可见性，任务调度，Resources Hint，这里不再一一展开。

//
//
//

// Performance Timeline

// 1. High Resolution Time
// Performance.now()
// Performance.timeOrigin()
// Performance.toJSON()

// 2. 三个接口
// getEntries()
// getEntriesByType()
// getEntriesByName()

// 3. 两个对象
// PerformanceEntry
// PerformanceObserver

// 首先我们看一下 performance timeline，performance 他们主要包含三个部分：
// 第一部分是高精度时间的接口，包括 performance，对象上面的 NAO 方法。
// 第二个是 performance time 来提供的查询性能接口的主要 API 比如说 getEntries 以及 getEntries byType 、byName两个接口。
// 最后 performance timeline 也定义了两个重要的对象，这两个重要的对象是我们检测性能的一个基础对象。其中 PerformanceEntry 是其他 Entry 的一个基类。我们通过 getEntry 可以看到浏览器返回了一些 Entry 列表，这里所有的 Entry 列表都继承于 PerformanceEntry。
// 另外一个是 PerformanceObserver，用来监测基于事件的指标，我们可以看一下 API 的一个使用情况。

// Navigation Timing，页面导航性能
// 定义的是文档，导航过程中完整的性能度量及文档，从发起请求到完成加载的各阶段号时，其中页面的导航性能可以通过 performance 的 timing 接口来获得。
// const t = performance.getEntriesByType('navigation')[0]

// Resource Timing，记录的是子资源的请求到加载完成的各阶段耗时，子资源的性能数据可以通过 getEntriesByType 接口来查询，传入的类型为 resource。
// const resource = performance.getEntriesByType('resource')

// Element Timing，自定义 LCP
const observeLCP = () => {
    const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
            console.log('observeLCP:', entry.startTime, entry)
        }
    })

    observer.observe({
        type: 'largest-contentful-paint',
        buffered: true
    })

    return observer
}

// Paint Timing，用来测试两个指标，一个是 FP，另外一个是 FCP，分别是首次绘制和首次内容绘制，计算也比较简单，通过前面 observer 的接口来监听。
// const paint = performance.getEntriesByType('paint')
const observePaintTiming = () => {
    const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
            console.log('observePaintTiming:', entry)
        }
    })

    observer.observe({ entryTypes: ['paint'] })

    return observer
}

// Event Timing 提出的背景是我们需要跟踪页面输入事件的处理延迟，目前处于一个草案阶段，这个 API 目前主要用来计算 FID 这个指标，算法也是比较简单，是把开始处理时间和首次输入接收到的时间做一个相减。
const observeFirstInputDelay = () => {
    const observer = new PerformanceObserver((entryList, observer) => {
        const firstInput = entryList.getEntries()[0]
        const inputDelay = firstInput.processingStart - firstInput.startTime
        console.log('observeFirstInputDelay:', inputDelay)
        // Report inputDelay to analytics
        observer.disconnect()
    })

    observer.observe({
        type: 'first-input',
        buffered: true
    })

    return observer
}

const observeCLS = () => {
    let cls = 0
    const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                cls += entry.value
            }
        }
        console.log('observeCLS:', cls)
    })

    observer.observe({
        type: 'layout-shift',
        buffered: true
    })

    return observer
}

// Frame timing 提供的是记录慢帧信息的能力，也是一个草案阶段的标准，其中帧的定义是两个 vsync 之间在 60 赫兹的屏幕刷新率下，慢帧的时处理时间上限是 16.6 毫秒
const observeFrameTiming = () => {
    const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
            console.log('observePaintTiming:', entry)
            // Process slow frame notifications
            console.log('slow frame:', entry)
        }
    })

    observer.observe({ entryTypes: ['frame'] })

    return observer
}

// 检测长任务，进行实时监测上报 > 50ms
// 通过 PerformanceObserver，观察者模式，得到所要监听类型的对象
// 监听回调中得到所有 long tasks 长任务对象

const observeLongTask = () => {
    const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            console.log('long tasks entry', entry)
        }
    })

    // 监听 long tasks
    observer.observe({ entryTypes: ['longtask'] })

    return observer
}

export default {
    observeLongTask,
    observeLCP,
    observePaintTiming,
    observeFirstInputDelay,
    observeCLS,
    observeFrameTiming
}
