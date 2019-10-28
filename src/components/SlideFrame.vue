<template>
    <div class="blue_box">
      <div class="blue_box_head">
        积分金币规则
      </div>
      <div class = "blue_box_detail">
        <ol>
          <li>积分：用户通过物业缴费、门禁、停车等获取的积分，积分实时同步（具体可查看APP首页-【我的】-【积分】-【积分记录】）</li>
          <li>金币：用户在活动期间通过【我是守门员】游戏和【世界杯竞猜】游戏获得的金币</li>
          <li>排名规则：排行榜按金币排名，前50名获得丰富礼品，相同金币的用户按报名时间先后排序</li>
          <li>排行榜前50名获得相应的奖品：iPad（第1名），小米空气净化器（2-10名），米家电饭煲（11-20名），乐心体脂秤（21-50名）</li>
          <li>活动结束积分不变，金币清零</li>
        </ol>
      </div>
      <div class="blue_box_bottom"></div>
    </div>
</template>

<script>
export default {
  name: 'slideFrame',
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
  .blue_box{
    .blue_box_head{
      .bgImg("../assets/images/rank-bg-head.png");
      background-position-y: 0.5px;
      background-size:contain;
      width: 375px;
      height: 375px * @imgRatio;
      text-align: center;
      font-size:17px;
      line-height:375px * @imgRatio;
      color:white;
      overflow: hidden;
    }
    .blue_box_detail {
      background: url('../assets/images/border-bg.png') center center repeat-y;
      padding-top:1px;
      background-size:contain;
      ol{
        margin:0;
        padding-right:.2rem;
        li{
          color:#A6D5FF;
          font-size:13px;
          line-height:30px;
        }
      }
    }
    .blue_box_bottom{
      .bgImg("../assets/images/rule-bottom.png");
      background-size:contain;
      width: 375px;
      height: 375px * @imgRatio;
    }
  }
</style>
