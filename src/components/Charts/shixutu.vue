<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
 /*  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }, */
  methods: {
    initChart() {
     this.chart = echarts.init(document.getElementById(this.id))
        var data = [];
        var dataCount = 24;//数据计数
        // 毫秒换算小时：15552000毫秒=15552000/(1000x3600) = 4.32小时
        var startTimes = "2019-06-03 14:25:20"
        var statusEndTime = "2019-06-03 16:25:20"

        var secondsTime = new Date(startTimes).getTime();//开始时间
        console.log(secondsTime)
        var endtime = new Date(statusEndTime).getTime()//结束时间


         var startTime = +new Date();//毫秒数
        // var startTime = ['100','200','300','400']
        var categories = ['低压1'];//定义的y轴数据
        var types = [
            {name: '关机', color: '#000'},
            {name: '加工', color: '#00CC00'},
            {name: '停工', color: 'red'},
            {name: '调试', color: '#FFA650'}
           
        ];

// Generate mock data 生成模拟数据  Profile
echarts.util.each(categories, function (category, index) {
    var baseTime = startTime;
    for (var i = 0; i < dataCount; i++) {
        var typeItem = types[Math.round(Math.random() * (types.length - 1))];//这个是对的需要随机
        var duration = 1000
        data.push({
            name: typeItem.name,
            value: [
                index,//下标
                baseTime,//开始时间
                baseTime += duration, //结束时间
                duration//鼠标滑上去显示的值
            ],
            itemStyle: {
                normal: {
                    color: typeItem.color
                }
            }
        });
        
         baseTime += Math.round(Math.random() * 2000);
    }
    // console.log(data)
});
// 通过书写 renderItem 函数能够让开发者实现自定义的图形元素渲染逻辑
function renderItem(params, api) {
    var categoryIndex = api.value(0);//表示取出当前 dataItem 中第一个维度的数值
    var start = api.coord([api.value(1), categoryIndex]);// 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.6; // 这里使用 api.size(...) 获得 Y 轴上数值范围为 1 的一段所对应的像素长度。

    // shape 属性描述了这个矩形的像素位置和大小。
    // 其中特殊得用到了 echarts.graphic.clipRectByRect，意思是，
    // 如果矩形超出了当前坐标系的包围盒，则剪裁这个矩形。
    var rectShape = echarts.graphic.clipRectByRect({
        // 矩形的位置和大小。
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
    }, {
        // 当前坐标系的包围盒。
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });

    return rectShape && {
        type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
        shape: rectShape,
        // 用 api.style(...) 得到默认的样式设置。这个样式设置包含了
       // option 中 itemStyle 的配置和视觉映射得到的颜色。
        style: api.style()
    };
}
    


     
    this.chart.setOption({
         tooltip: {
        formatter: function (params) {
            console.log(params)
            return params.marker + params.name + ': ' + params.value[3] + ' 毫秒1';
        }
    },
    title: {
        text: '时序图',
        left: 'center'
    },
    dataZoom: [{
        type: 'slider',
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: 400,
        height: 10,
        borderColor: 'transparent',
        backgroundColor: '#e2e2e2',
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 20,
        handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
        },
        labelFormatter: ''
    }, {
        type: 'inside',
        filterMode: 'weakFilter'
    }],
    grid: {
        height:300
    },
    xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
            formatter: function (val) {
                console.log(1234)
                console.log(val)
                return Math.max(0, val - startTime) + ' 毫秒';
            }
        }
    },
    yAxis: {
        data: categories
    },
    series: [{
        type: 'custom',
        renderItem: renderItem,
        itemStyle: {
            normal: {
                opacity: 0.8
            }
        },
        encode: {
            x: [1, 2],// data 中『维度1』和『维度2』对应到 X 轴
            y: 0  // data 中『维度0』对应到 Y 轴
        },
        data: data
    }]
      })
    }
  }
}
</script>
