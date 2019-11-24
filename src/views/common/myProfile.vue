<template>
  <div class="myProfile">
    <h2 class="title-header">我的资料</h2>
    <div class="formSearch">
      <el-form :rules="rules" ref="dataForm" :model="popData">
        <el-form-item label="用户名" prop="userName">
          <el-input class="filter-item input" placeholder="请输入用户名" maxlength="64" v-model="popData.userName">
          </el-input>
        </el-form-item>
        <el-form-item label="部门" prop="orgName">
          <el-input class="filter-item input" v-model="popData.orgName" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="orgName">
          <el-input class="filter-item input" v-model="popData.stationName" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input class="filter-item input" placeholder="请输入手机号码" v-model="popData.phoneNumber" maxlength="11"> 
          </el-input>
        </el-form-item>
        <el-form-item label="短号" prop="shortNumber">
          <el-input class="filter-item input" placeholder="请输入短号" v-model="popData.shortNumber" maxlength="8" onkeyup="this.value=this.value.replace(/\D/g,'')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateData">确认</el-button>
          <el-button type="info" @click="resetData">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, fetchPerson, updatePerson } from '@/api/common/myProfile'
import { isvalidUsername } from '@/utils/validate'
export default {
  name: 'sysUser',
  data() {
    // 用户名验证
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // 手机号码验证
    var validatephone = (rule, value, callback) => {
      if (value != '') {
        if ((/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/).test(value) == false) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 短号验证
    const ishortNumber = (rule, value, callback) => {
      if (value != '') {
        if ((/^[0-9]+$/g).test(value) == false) {
          callback(new Error('请输入正确的短号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      // 用户工号
      workNumber: undefined,
      popData: {
        userName: undefined,
        orgName: undefined,
        stationName: undefined,
        phoneNumber: undefined,
        shortNumber: undefined,
        workNumber: undefined
      },
      rules: {
        userName: [{ required: false, trigger: 'change', validator: validateUsername }],
        shortNumber: [{ required: false, trigger: 'change', validator: ishortNumber }],
        phoneNumber: [{ required: false, validator: validatephone, trigger: 'change' }]
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      // 获取当前用户信息
      getCurrentUser().then(response => {
        this.popData.workNumber = response.data.data.workNumber
        this.popData.userName = response.data.data.userName
      })
      setTimeout(() => {
        // 获取当前人员信息
        fetchPerson(this.popData.workNumber).then(response => {
          this.popData.orgName = response.data.data.orgName
          this.popData.stationName = response.data.data.stationName
          this.popData.phoneNumber = response.data.data.phoneNumber
          this.popData.shortNumber = response.data.data.shortNumber
        })
      }, 1 * 1000)
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.popData)
          updatePerson(tempData).then(response => {
            if (response.data.code == 200) {
              this.$message({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '警告',
                message: response.data.msg,
                type: 'warning',
                duration: 3000
              })
            }
          })
        }
      })
    },
    resetData() {
      getCurrentUser().then(response => {
        this.popData.userName = response.data.data.userName
      })
      setTimeout(() => {
        // 获取当前人员信息
        fetchPerson(this.popData.workNumber).then(response => {
          this.popData.stationName = response.data.data.stationName
          this.popData.phoneNumber = response.data.data.phoneNumber
          this.popData.shortNumber = response.data.data.shortNumber
        })
      }, 1 * 300)
    }
  }
}
</script>
<style scoped>
    .myProfile{
        padding:20px;
    }
    .title-header {
        font-size: 20px;
        color: #409eff;
        margin: 20px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
    }
    .formSearch {
        width:60%;
        background:#fafafa;
        border: 1px solid #e9e9e9;
        border-radius: 3px;
        padding: 20px;
        margin: 0 30px;
    }
</style>