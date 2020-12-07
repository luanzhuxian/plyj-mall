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
                    @change="labelChange(skuAttr, item)"
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
        }
    },
    watch: {
        skuAttr: {
            handler (val) {
                console.log(val, this.$el)
            },
            deep: true,
            immediate: true
        }
    },
    data () {
        return {
            currentSku: null
        }
    },
    methods: {
        labelChange (attr, sku, child) {
            console.log(sku, this.$el)
            for (const SKU of attr.productAttributeValues) {
                SKU.checked = false
            }
            sku.checked = true
            const currentLabel = child || this
            currentLabel.currentSku = sku
            // 按两级sku处理，要么有父级，要么有子级
            if (currentLabel.$parent.$options.name === 'LabelSku') {
                // 假设点击的是子级，则去判断父级
                currentLabel.checkSku(sku.id, currentLabel.$parent.skuAttr.productAttributeValues)
            }
            if (currentLabel.$children.length > 0) {
                // 假设点击的是父级，则去判断子级
                currentLabel.checkSku(sku.id, currentLabel.$children[0].skuAttr.productAttributeValues)
            }
            this.change([sku])
        },
        radioChange () {
            console.log('asldjkg')
        },
        change (skus) {
            let parent = this.$parent
            let children = this.$children[0]
            while (parent.$options.name === 'LabelSku') {
                skus.unshift(parent.currentSku)
                parent = parent.$parent
            }
            while (children && children.$options.name === 'LabelSku') {
                skus.push(children.currentSku)
                children = children.$children[0]
            }
            this.$emit('change', [...new Set(skus)])
        },
        checkSku (currentSkuId, skus) {
            for (const sku of skus) {
                const findedSku = this.skuList.find(item => (item.skuCode1 === currentSkuId || item.skuCode2 === currentSkuId) && (item.skuCode1 === sku.id || item.skuCode2 === sku.id))
                if (!findedSku) {
                    sku.disabled = true
                } else {
                    sku.disabled = findedSku.stock < findedSku.minBuyNum
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
