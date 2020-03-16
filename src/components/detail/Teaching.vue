<template>
    <div :class="$style.teaching + ' radius-20'">
        <div :class="$style.teacherFace">
            <img
                src="//img.alicdn.com/imgextra/i2/1652742042/TB2sV2wGv9TBuNjy0FcXXbeiFXa_!!1652742042.jpg_2200x2200Q50s50.jpg_.webp"
                alt=""
            >
            <div :class="$style.right">
                <span :class="$style.name">阎老师</span>
                <div :class="$style.subject">
                    <span>数学</span>
                    <span>6年教龄</span>
                </div>
            </div>
        </div>

        <div :class="$style.intro">
            <pl-list
                title="主攻方向："
                title-color="#838383"
                content-color="#a5a5a5"
                content="少儿奥数"
            />
            <pl-list
                title="个人经历："
                title-color="#838383"
                content-color="#a5a5a5"
                content="西北工业大学软件工程硕士西北工业大学软件工程硕士西北工业大学软件工程硕士西北工业大学软件工程硕士"
            />
            <pl-list
                title="荣誉资质："
                title-color="#838383"
                content-color="#a5a5a5"
                content="国家特级教师，2018年全国优"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Teaching'
}
</script>

<style module lang="scss">
  .teaching {
    margin-top: 28px;
    padding: 30px;
    background-color: #fff;
  }
  .teacher-face {
    display: flex;
    height: 80px;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .right {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 24px;
  }
  .name {
    font-size: 28px;
    color: #446889;
    font-weight: bold;
  }
  .subject {
    font-size: 24px;
    span:nth-of-type(n+2):before {
      position: relative;
      content: '|';
      padding: 0 16px;
      color: #e7e7e7;
    }
  }
  .intro {
    margin-top: 20px;
    font-size: 24px;
    line-height: 38px;
    p {
      display: flex;
    }
  }
</style>
