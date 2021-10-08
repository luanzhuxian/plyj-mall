// 检测长任务，进行实时监测上报
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

export default observeLongTask
