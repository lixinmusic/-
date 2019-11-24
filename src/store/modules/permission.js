import { asyncRouterMap, constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'
import { getMenuList } from '@/api/common/menu'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

// //组装菜单数据
// fucntion recombineMenu(isParentNode, menuArr) {
//     let menuArr=[]
//     menuArr.forEach(e => {
//       e.path = '/' + name
//       e.redirect = 'noredirect'
//       if(isParentNode){
//         e.component = Layout
//       }else{
//         e.component = () => import('@/views/charts/keyboard')
//       }
//       e.meta.title = e.title
//       e.meta.icon = e.icon
//       delete e[title];
//       delete e[icon];
//       if (e.children) {

//       }

//     });
// }

function resolveRoute(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
var menuList = null
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      // return new Promise(resolve => {
      //   const { roles } = data
      //   let accessedRouters
      // if (roles.indexOf('admin') >= 0) {
      //   accessedRouters = asyncRouterMap
      // } else {
      //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
      // }

      // 调用菜单接口
      return new Promise((resolve, reject) => {
        getMenuList().then(response => {
          menuList = response.data.data.menu
          // 组装菜单数据
          const menus = []
          menuList.forEach(e => {
            const menuEle = {
              name: e.name,
              path: e.name,
              alwaysShow: true,
              redirect: 'noredirect',
              component: Layout,
              meta: {
                title: e.title,
                icon: e.name
              }

            }

            if (e.children && e.children.length > 0) {
              // 二级菜单
              menuEle.children = []
              var list = e.children
              e.children.forEach(ec => {
                const cNode = {
                  name: ec.name,
                  path: '/' + e.name + '/' + ec.name,
                  component: function(resolve) { require(['@/views/' + e.name + '/' + ec.name], resolve) },
                  meta: {
                    title: ec.title,
                    icon: 'star1'
                  }
                }

                if (ec.children && ec.children.length > 0) {
                  // 三级菜单
                  cNode.children = []
                  ec.children.forEach(eg => {
                    const gNode = {
                      name: eg.name,
                      path: '/' + e.name + '/' + ec.name + '/' + eg.name,
                      component: function(resolve) { require(['@/views/' + e.name + '/' + ec.name + '/' + eg.name], resolve) },
                      meta: {
                        title: eg.title,
                        icon: 'icon'
                      }
                    }

                    if (eg.children && eg.children.length > 0) {
                      // 四级菜单
                      gNode.children = []
                      eg.children.forEach(egg => {
                        const ggNode = {
                          name: egg.name,
                          path: '/' + e.name + '/' + ec.name + '/' + eg.name + '/' + egg.name,
                          component: function(resolve) { require(['@/views/' + e.name + '/' + ec.name + '/' + eg.name + '/' + egg.name], resolve) },
                          meta: {
                            title: egg.title,
                            icon: 'icon'
                          }
                        }
                        gNode.children.push(ggNode)
                      })
                    }
                    cNode.children.push(gNode)
                  })
                }
                menuEle.children.push(cNode)
              })
            } else {
              // 一级菜单
              menuEle.path = ''
              delete menuEle.name
              menuEle.children = []
              const cNode = {
                name: e.name,
                path: e.name,
                component: function(resolve) { require(['@/views/' + e.name + '/index'], resolve) },
                meta: {
                  title: e.title,
                  icon: e.name
                }
              }
              menuEle.children.push(cNode)
            }
            menus.push(menuEle)
          })

          commit('SET_ROUTERS', menus)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
      // accessedRouters = [

      //   {
      //     path: '/charts',
      //     component: Layout,
      //     redirect: 'noredirect',
      //     name: 'charts',
      //     meta: {
      //       title: 'charts',
      //       icon: 'chart'
      //     },
      //     children: [
      //       { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true } },
      //       { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true } },
      //       // { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true } }
      //     ]
      //   }

      // ]
      // console.log('=======> get accessedRouters')

      // commit('SET_ROUTERS', accessedRouters)
      // resolve()
      // })
    }
  }
}
export { menuList }
export default permission

