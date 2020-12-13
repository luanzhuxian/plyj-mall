export default {
    methods: {
        setSkinTitleClassName () {
            const list = Array.from(document.querySelectorAll('.skin-title > .title-xmas-2020'))
            if (list.length) {
                for (const [index, item] of list.entries()) {
                    if (index % 3 === 0) {
                        item.classList.add('title-xmas-2020-man')
                    } else if (index % 3 === 1) {
                        item.classList.add('title-xmas-2020-deer')
                    } else if (index % 3 === 2) {
                        item.classList.add('title-xmas-2020-penguin')
                    }
                }
            }
        }
    }
}
