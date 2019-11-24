<template>
  <div class='chart-container'>
    <!-- <chart height='100%' width='100%'></chart> -->
   
     <button @click="toggle1()" :class="{'black':greenShow1,'public':!greenShow1}" style="width:70px;height:36px">关机</button>
      <span>{{guanji}}</span><span>/</span>
        <span style="margin-right:10px;" v-cloak>{{33}}</span>


     <button @click="toggle2()" :class="{'green':greenShow2,'public':!greenShow2}">加工</button>
     <button @click="toggle3()" :class="{'red':greenShow3,'public':!greenShow3}">停工</button>
     <button @click="toggle4()" :class="{'orange':greenShow4,'public':!greenShow4}">调试</button>
    
    <ul v-for="item in listColor">
      <li  @click="colorButong" class="gong" :class="{'black':item.state==0,'green':item.state==1,'red':item.state==2,'orange':item.state==3}" >{{item.title}}</li>
    </ul>





  </div>
</template>

<script>
import Chart from '@/components/Charts/keyboard'

export default {
  name: 'keyboardChart',
  components: { Chart },
  data(){
    return {
      listColor:[
        {title:'1#机',active:'关机',state:1},
        {title:'2#机',active:'关机',state:2},
        {title:'3#机',active:'关机',state:3},
        {title:'4#机1',active:'加工',state:0},
        {title:'4#机1',active:'加工',state:0},
        {title:'4#机1',active:'加工',state:0}

      ],
      batList:[
         {nums: 21, rate: 0, state: "0", stateType: "关机"},
         {nums: 9, rate: 0, state: "1", stateType: "加工"},
         {nums: 0, rate: 0, state: "2", stateType: "停工"},
         {nums: 1, rate: 0, state: "3", stateType: "调试"}
      ],
   

      greenShow1:true,
      greenShow2:true,
      greenShow3:true,
      greenShow4:true,
      colorShow:true,
      greepo:true,
      ppp:[],

    }
  },
  created(){
   this.pos()
  },
  methods:{
  // 按钮的数据
  pos(){
    for(var i=0;i<this.batList.length;i++){
          console.log(this.batList[0].nums)
          this.guanji = this.batList[0].nums
   } 
  },

    // 关机按钮
     toggle1(){
        this.greenShow1 =!this.greenShow1
        if(this.greenShow1){
          console.log(12134)
        }
     },   
    //加工按钮
  toggle2:function(){
         this.greenShow2 =!this.greenShow2
    },
    //停工按钮
    toggle3:function(){
         this.greenShow3 =!this.greenShow3
    },
     //  调试按钮
    toggle4:function(){
       this.greenShow4 =!this.greenShow4
    }, 

    colorButong(){
      console.log(568)
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
.gong{
  width: 45px; 
  height: 60px;
  margin: 10px 0;
  box-shadow: 10px 10px 15px #a19e9e;
  display: inline-flex;
}
.gong:hover{
   cursor: pointer;
    box-shadow: 10px 15px 20px #807e7e;
}

/* 按钮的颜色 */
.public{
  background:#ccc;
}
.hose{
   background:#000;
   color:#fff;
}

.hose1{
   background:#FFA650;
   color:#fff;
}

.hose2{
   background:red;
   color:#fff;
}

.hose3{
   background:#00CC00;
   color:#fff;
}

/*定义设备状态颜色*/
.red {   
    background-color:red;
     color:#fff;  
}  
.green {  
    background-color: #00CC00; 
     color:#fff; 
}
.orange {
    background-color:#FFA650; 
     color:#fff;
}
.gray {
    background-color:#606060;
     color:#fff;
}
.black {
    background-color:black;
     color:#fff;
}

</style>

