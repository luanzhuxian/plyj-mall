<template>
    <div v-if="skuAttr" :class="$style.skuLabel">
        <div
            :class="$style.attrName"
            v-text="skuAttr.productAttributeName"
        />
        <div :class="$style.labelList">
            <label
                v-for="(item, i) of skuAttr.productAttributeValues"
                :key="i"
            >
                <input
                    type="radio"
                    :name="skuAttr.id + '_' + _uid"
                    :value="item.id"
                    :disabled="item.disabled"
                    :checked="item.checked"
                    @change="labelChange(item)"
                >
                <span v-text="item.productAttributeValueName" />
            </label>
        </div>
        <LabelSku
            v-if="skuAttr.children"
            :sku-attr="skuAttr.children"
            :sku-list="skuList"
            @change.capture="change"
        />
    </div>
</template>

<script>
export default {
    name: 'LabelSku',
    props: {
        skuAttr: {
            type: Object,
            default: null
        },
        skuList: {
            type: Array,
            default () {
                return []
            }
        },
        // 默认选中的skuAttrs
        defaultSkuAttrs: {
            type: Array,
            default () {
                return []
            }
        }
    },
    watch: {
        defaultSkuAttrs (val) {
            if (val === this.attrGroup) {
                return
            }
            this.$nextTick(() => {
                let labelSku = this
                for (const attr of val) {
                    if (labelSku && attr) {
                        labelSku.labelChange(attr)
                    }
                    labelSku = this.$children[0]
                }
                this.$emit('change', val)
            })
        }
    },
    data () {
        return {
            currentSku: null
        }
    },
    methods: {
        async labelChange (attr) {
            this.currentSku = attr
            // for (const SKU of this.skuAttr.productAttributeValues) {
            //     SKU.checked = false
            // }
            attr.checked = true

            // const currentLabel = this
            // 按两级sku处理，要么有父级，要么有子级
            if (this.$parent.$options.name === 'LabelSku') {
                // 假设点击的是子级，则去判断父级
                this.checkSku(attr.id, this.$parent.skuAttr.productAttributeValues)
            }
            if (this.$children.length > 0) {
                // 假设点击的是父级，则去判断子级
                this.checkSku(attr.id, this.$children[0].skuAttr.productAttributeValues)
            }
            this.change([attr])
        },
        change (attrs) {
            let parent = this.$parent
            let children = this.$children[0]
            while (parent.$options.name === 'LabelSku') {
                attrs.unshift(parent.currentSku)
                parent = parent.$parent
            }
            while (children && children.$options.name === 'LabelSku') {
                attrs.push(children.currentSku)
                children = children.$children[0]
            }
            this.attrGroup = [...new Set(attrs)]
            this.$emit('change', this.attrGroup)
        },

        /**
         * 检查和当前sku匹配的其它sku，并设置禁用状态
         * @param currentSkuId 当前选中的sku属性id
         * @param attrs 其它可以与当前sku组合的sku属性
         */
        checkSku (currentSkuId, attrs) {
            for (const attr of attrs) {
                const findedSku = this.skuList.find(item => (item.skuCode1 === currentSkuId || item.skuCode2 === currentSkuId) && (item.skuCode1 === attr.id || item.skuCode2 === attr.id))
                if (!findedSku) {
                    attr.disabled = true
                } else {
                    attr.disabled = findedSku.stock < findedSku.minBuyNum
                }
            }
        }
    }
}
</script>

<style module lang="scss">
    .skuLabel {
        position: relative;
        padding: 20px 0;
        border-bottom: 1px solid #e7e7e7;
        > .skuLabel {
            border-bottom: none;
        }
    }
    .attrName {
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .labelList {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: 5px;
        overflow: auto;
        box-sizing: border-box;

        > label {
            > input {
                display: none;
                &:checked + span {
                    color: $--primary-color;
                    border: 1px solid currentColor;
                    border-radius: 9px;
                    background: none;
                }
                &:disabled + span {
                    color: #ccc !important;
                }
            }
            > span {
                display: inline-block;
                position: relative;
                margin: 0 13px 13px 0;
                padding: 10px 20px;
                width: max-content;
                color: #666;
                font-size: 24px;
                background-color: #f3f3f3;
                border: 1px solid #f3f3f3;
                border-radius: $--radius2;
                overflow: visible;
                box-sizing: border-box;
            }
        }
    }
</style>
