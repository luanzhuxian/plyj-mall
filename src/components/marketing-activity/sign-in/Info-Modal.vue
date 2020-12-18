<template>
    <pl-mask :show="show" @close="close">
        <div :class="$style.modal">
            <div :class="$style.head">
                <div :class="$style.title">打卡第{{ answer }}天答案揭晓</div>
            </div>
            <div :class="$style.main">
                <img v-if="[8, 13, 16, 17, 20].includes(answer)" :src="answerList[answer - 7]">
                <span>{{ answerList[answer - 7] }}</span>
            </div>
            <div :class="$style.text">提示：本答案是打卡最后一天智慧题的答案哦~</div>
        </div>
    </pl-mask>
</template>
<script>
export default {
    name: 'InfoModel',
    data () {
        return {
            answerList: [
                '根据电脑键盘排列，下一个字母是“I"',
                'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/eight.png',
                '土星比地球大4，带入第一个等式，4+2个地球=20，地球=8、土星=12，所以最后一个等式12*8=96',
                '如果只有1头牛，这块草地可以让他吃30*40=1200天，如果有40头牛，1200÷40=30，因此可以吃30天',
                '1位老师完成1门考试阅卷需要10天，因此 20位老师需要10天才能完成20门考试阅卷',
                '第一行有1个1,第二行记为11,第二行有2个1 第三行记为21,第三行有3个1,1个2,第四行记 为3112,最后一行有4个1、1个2、2个3、1个4，所以应该接41122314',
                'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/thirteen.png',
                'E和D同时最先注满水',
                '除了132之外，其余的数字个位、十位和百位之和都是9，因此答案是132',
                '百位之和都是9，因此答案是132',
                'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/sixteen.png',
                'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/seventeen.png',
                '朋友照片拍倒了，正过来看是07735',
                '用假设法排除：如果古尔布是A，那么A在说谎、B也在说谎，C说的是真话。同样方法其余假设都不成立，所以A是古尔布',
                'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/twenty.png'
            ]
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        answer: {
            type: Number,
            default: 0
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module scoped lang="scss">
  .modal{
    width: 533px;
    background: #fff;
    border-radius: 10px;
    .head{
      background: url("https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/popup_top.png") no-repeat;
      background-size: 100% 175px;
      padding-top: 40px;
      height: 135px;
      .title{
        text-align: center;
        font-size: 40px;
        color: #FFDCB3;
      }
    }
    .main{
      margin: 60px 50px;
      font-size: 24px;
      line-height: 40px;
    }
    .text{
      text-align: center;
      font-size: 22px;
      line-height: 115px;
      color: #A8A8A8;
      height: 115px;
      border-top: 1px solid #E7E7E7;
    }
    .loading {
      &:global {
        animation: rotate 2s linear infinite;
      }
    }
  }
</style>
