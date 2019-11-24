<template>
  <div class="myProfile">
    <h2 class="title-header">修改密码</h2>
    <div class="formSearch">
      <el-form>
        <el-form-item label="用户名">
          <el-input class="filter-item input" maxlength="20" v-model="popData.userName" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="原密码">
          <el-input type="password" class="filter-item input" v-model="popData.oldPassword" maxlength="20" minlength="8" onkeyup="value=value.replace((/[^\d|chun]/g,'')" @blur.prevent="checkPassword">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" class="filter-item input" v-model="popData.password" maxlength="20" minlength="8" onkeyup="value=value.replace((/[^\d|chun]/g,'')" @blur.prevent="newPassword">
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" class="filter-item input" v-model="popData.passwordOk" maxlength="20" minlength="8" onkeyup="value=value.replace((/[^\d|chun]/g,'')" @blur.prevent="confirmPassword">
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
import { getCurrentUser, updatePassword } from '@/api/common/myProfile'
export default {
  name: 'sysUser',
  data() {
    return {
      // 用户id
      userId: undefined,
      popData: {
        id: undefined,
        userName: undefined,
        oldPassword: undefined,
        password: undefined,
        passwordOk: undefined
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
        this.popData.id = response.data.data.id
        this.popData.userName = response.data.data.userName
        this.popData.oldPassword = ''
        this.popData.password = ''
        this.popData.passwordOk = ''
      })
    },
    // 验证原密码
    checkPassword() {
      const tempData = Object.assign({}, this.popData)
      updatePassword(tempData).then(response => {
        if (response.data.code === 402) {
          this.$message({
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        }
      })
    },
    // 验证新密码长度
    newPassword() {
      if (this.popData.password.length < 8) {
        this.$message({
          message: '密码长度应在8-20位之间',
          type: 'warning',
          duration: 3000
        })
      }
    },
    // 确认新密码
    confirmPassword() {
      if (this.popData.passwordOk !== this.popData.password) {
        this.$message({
          message: '两次密码不一致，请重新输入',
          type: 'warning',
          duration: 3000
        })
      }
    },
    // 提交修改
    updateData() {
      const tempData = Object.assign({}, this.popData)
      if (this.popData.password.length < 8) {
        this.$message({
          message: '密码长度应在8-20位之间',
          type: 'warning',
          duration: 3000
        })
        return
      }
      if (this.popData.passwordOk !== this.popData.password) {
        this.$message({
          message: '两次密码不一致，请重新输入',
          type: 'warning',
          duration: 3000
        })
        return
      }
      updatePassword(tempData).then(response => {
        if (response.data.code === 402) {
          this.$message({
            message: response.data.msg,
            type: 'warning',
            duration: 3000
          })
        } else if (response.data.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 3000
          })
        }
      })
    },
    // 重置
    resetData() {
      this.getUser()
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