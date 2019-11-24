<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <!-- <error-log class="errLog-container right-menu-item"></error-log> -->
      <!-- <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip> -->
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <span style="font-size:16px;">{{orgName + '-' + perName}}</span>
          <img class="user-avatar" :src="avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link> -->
          <router-link to="/myApproval">
            <el-dropdown-item>
              我的审批
            </el-dropdown-item>
          </router-link>
          <router-link to="/myMessage">
            <el-dropdown-item>
              我的消息
            </el-dropdown-item>
          </router-link>
          <router-link to="/myProfile">
            <el-dropdown-item>
              个人资料
            </el-dropdown-item>
          </router-link>
          <router-link to="/updatePassword">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </router-link>
          <!-- <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              github
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item divided style="padding:0; text-align:center">
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="footer">
      <div> v4.1.1.3 &nbsp;&nbsp;&copy; 2018&nbsp;杭州凯立通信
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import ThemePicker from '@/components/ThemePicker'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'orgName',
      'perName'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 40px;
  line-height: 40px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -10px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style scoped>
.footer{
  height: 36px;
  position: fixed;
  bottom: 6px;
  right: 40px;
}
</style>
