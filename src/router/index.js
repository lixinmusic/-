import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'home', noCache: true }
    }]
  },
  {
    path: '/common',
    component: Layout,
    hidden: true,
    redirect: 'common',
    children: [
      {
        path: '/myApproval',
        component: () => import('@/views/common/myApproval'),
        hidden: true,
        name: 'myApproval',
        meta: { title: '我的审批' }
      },
      {
        path: '/myMessage',
        component: () => import('@/views/common/myMessage'),
        hidden: true,
        name: 'myMessage',
        meta: { title: '我的消息' }
      },
      {
        path: '/myProfile',
        component: () => import('@/views/common/myProfile'),
        hidden: true,
        name: 'myProfile',
        meta: { title: '我的资料' }
      },
      {
        path: '/updatePassword',
        component: () => import('@/views/common/updatePassword'),
        hidden: true,
        name: 'updatePassword',
        meta: { title: '修改密码' }
      }
    ]
  },
  // 流程模型管理
  {
    path: '/baseInfo',
    component: Layout,
    hidden: true,
    redirect: 'baseInfo',
    children: [
      {
        path: '/baseInfo/baseProceNode',
        component: () => import('@/views/baseInfo/baseProceNode'),
        hidden: true,
        name: 'baseProceNode',
        meta: { title: '流程节点配置' }
      }
      // {
      //   path: '/baseInfo/baseProceStaff',
      //   component: () => import('@/views/baseInfo/baseProceStaff'),
      //   hidden: true,
      //   name: 'baseProceStaff',
      //   meta: { title: '流程人员配置' }
      // }
    ]
  },
  // 备案单
  {
    path: '/equipRecord',
    component: Layout,
    hidden: true,
    redirect: 'equipRecord',
    children: [
      {
        path: '/equipRecord/equipStatistic',
        component: () => import('@/views/equipRecord/equipStatistic'),
        hidden: true,
        name: 'equipStatistic',
        meta: { title: '设备备案流程统计' }
      }
    ]
  },
  // 采购单
  {
    path: '/equipPurchase',
    component: Layout,
    hidden: true,
    redirect: 'equipPurchase',
    children: [
      {
        path: '/equipPurchase/equipPurchaseStatistic',
        component: () => import('@/views/equipPurchase/equipPurchaseStatistic'),
        hidden: true,
        name: 'equipPurchaseStatistic',
        meta: { title: '设备采购流程统计' }
      }
    ]
  },
  // 设备验收
  {
    path: '/equipMent',
    component: Layout,
    hidden: true,
    redirect: 'equipMent',
    children: [
      {
        path: '/equipMent/installCompleteStatistic',
        component: () => import('@/views/equipMent/installCompleteStatistic'),
        hidden: true,
        name: 'installCompleteStatistic',
        meta: { title: '安装完成确认单流程统计' }
      },
      {
        path: '/equipMent/equipEvaluateStatistic',
        component: () => import('@/views/equipMent/equipEvaluateStatistic'),
        hidden: true,
        name: 'equipEvaluateStatistic',
        meta: { title: '新设备评价表流程统计' }
      },
      {
        path: '/equipMent/equipTransferStatistic',
        component: () => import('@/views/equipMent/equipTransferStatistic'),
        hidden: true,
        name: 'equipTransferStatistic',
        meta: { title: '新设备移交单流程统计' }
      },
      {
        path: '/equipMent/newReceHistory',
        component: () => import('@/views/equipMent/newReceHistory'),
        hidden: true,
        name: 'newReceHistory',
        meta: { title: '新设备验收单流程统计' }
      },
      {
        path: '/equipMent/ofixWaHistory',
        component: () => import('@/views/equipMent/ofixWaHistory'),
        hidden: true,
        name: 'ofixWaHistory',
        meta: { title: '设备质保验收单流程统计' }
      },
      {
        path: '/equipMent/acceptanceSheetHistory',
        component: () => import('@/views//equipMent/acceptanceSheetHistory'),
        hidden: true,
        name: 'acceptanceSheetHistory',
        meta: { title: '开箱验收单流程统计' }
      }
    ]
  },
  {
    path: '/idleProcess',
    component: Layout,
    hidden: true,
    redirect: 'idleProcess',
    children: [
      {
        path: '/idleProcess/equipIdleStatistic',
        component: () => import('@/views/idleProcess/equipIdleStatistic'),
        hidden: true,
        name: 'equipIdleStatistic',
        meta: { title: '设备闲置申请单流程统计' }
      },
      {
        path: '/idleProcess/motorDisReviewStatistic',
        component: () => import('@/views/idleProcess/motorDisReviewStatistic'),
        hidden: true,
        name: 'motorDisReviewStatistic',
        meta: { title: '电机处置评审单流程统计' }
      },
      {
        path: '/idleProcess/idleStartStatistic',
        component: () => import('@/views/idleProcess/idleStartStatistic'),
        hidden: true,
        name: 'idleStartStatistic',
        meta: { title: '闲置设备启动申请单流程统计' }
      },
      {
        path: '/idleProcess/idleAppHistory',
        component: () => import('@/views/idleProcess/idleAppHistory'),
        hidden: true,
        name: 'idleAppHistory',
        meta: { title: '闲置设备处置申请单流程统计' }
      }
    ]
  },
  {
    path: '/allocationProcess',
    component: Layout,
    hidden: true,
    redirect: 'allocationProcess',
    children: [
      {
        path: '/allocationProcess/equipRepairStatistic',
        component: () => import('@/views/allocationProcess/equipRepairStatistic'),
        hidden: true,
        name: 'equipRepairStatistic',
        meta: { title: '设备维修出厂单流程统计' }
      },
      {
        path: '/allocationProcess/equipAllotStatistic',
        component: () => import('@/views/allocationProcess/equipAllotStatistic'),
        hidden: true,
        name: 'equipAllotStatistic',
        meta: { title: '设备调拨单流程统计' }
      },
      {
        path: '/allocationProcess/migraHistory',
        component: () => import('@/views/allocationProcess/migraHistory'),
        hidden: true,
        name: 'migraHistory',
        meta: { title: '设备厂内迁移单流程统计' }
      },
      {
        path: '/allocationProcess/qualiHistory',
        component: () => import('@/views/allocationProcess/qualiHistory'),
        hidden: true,
        name: 'qualiHistory',
        meta: { title: '调拨设备质量信息报告流程统计' }
      }
    ]
  },
  // 维修管理
  {
    path: '/servicingManage',
    component: Layout,
    hidden: true,
    redirect: 'servicingManage',
    children: [
      {
        path: '/servicingManage/declHistory',
        component: () => import('@/views/servicingManage/declHistory'),
        hidden: true,
        name: 'declHistory',
        meta: { title: '设备报修单流程统计' }
      },
      {
        path: '/servicingManage/labelHistory',
        component: () => import('@/views/servicingManage/labelHistory'),
        hidden: true,
        name: 'labelHistory',
        meta: { title: '设备维修验收记录单流程统计' }
      },
      {
        path: '/servicingManage/hconfiHistory',
        component: () => import('@/views/servicingManage/hconfiHistory'),
        hidden: true,
        name: 'hconfiHistory',
        meta: { title: '设备维修质保确认单流程统计' }
      }
    ]
  },
  // 新增配件
  {
    path: '/equipSpareParts',
    component: Layout,
    hidden: true,
    redirect: 'equipSpareParts',
    children: [
      {
        path: '/equipSpareParts/addPartsStatistic',
        component: () => import('@/views/equipSpareParts/addPartsStatistic'),
        hidden: true,
        name: 'addPartsStatistic',
        meta: { title: '新增配件流程统计' }
      }
    ]
  },
  // 改造流程
  {
    path: '/equipRemould',
    component: Layout,
    hidden: true,
    redirect: 'equipRemould',
    children: [
      {
        path: '/equipRemould/remouldStatistic',
        component: () => import('@/views//equipRemould/remouldStatistic'),
        hidden: true,
        name: 'remouldStatistic',
        meta: { title: '改造备案申请流程统计' }
      },
      {
        path: '/equipRemould/remouldCompleteStatistic',
        component: () => import('@/views//equipRemould/remouldCompleteStatistic'),
        hidden: true,
        name: 'remouldCompleteStatistic',
        meta: { title: '改造安装完成确认流程统计' }
      },
      {
        path: '/equipRemould/remakeHistory',
        component: () => import('@/views//equipRemould/remakeHistory'),
        hidden: true,
        name: 'remakeHistory',
        meta: { title: '设备改造验收单' }
      },
      {
        path: '/equipRemould/remakevwHistory',
        component: () => import('@/views//equipRemould/remakevwHistory'),
        hidden: true,
        name: 'remakevwHistory',
        meta: { title: '设备改造质保验收单' }
      },
      
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// export const asyncRouterMap = [
//   {
//     path: '/permission',
//     component: Layout,
//     redirect: '/permission/index',
//     alwaysShow: true, // will always show the root menu
//     meta: {
//       title: 'permission',
//       icon: 'lock',
//       roles: ['admin', 'editor'] // you can set roles in root nav
//     },
//     children: [{
//       path: 'page',
//       component: () => import('@/views/permission/page'),
//       name: 'pagePermission',
//       meta: {
//         title: 'pagePermission',
//         roles: ['admin'] // or you can only set roles in sub nav
//       }
//     }, {
//       path: 'directive',
//       component: () => import('@/views/permission/directive'),
//       name: 'directivePermission',
//       meta: {
//         title: 'directivePermission'
//         // if do not set roles, means: this page does not require permission
//       }
//     }]
//   },

//   {
//     path: '/icon',
//     component: Layout,
//     children: [{
//       path: 'index',
//       component: () => import('@/views/svg-icons/index'),
//       name: 'icons',
//       meta: { title: 'icons', icon: 'icon', noCache: true }
//     }]
//   },

//   {
//     path: '/components',
//     component: Layout,
//     redirect: 'noredirect',
//     name: 'component-demo',
//     meta: {
//       title: 'components',
//       icon: 'component'
//     },
//     children: [
//       { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
//       { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
//       { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
//       { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
//       { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
//       { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
//       { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
//       { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
//       { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
//       { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
//       { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
//       { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
//       { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
//     ]
//   },

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
//       { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
//       { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
//       { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
//     ]
//   },

//   {
//     path: '/tab',
//     component: Layout,
//     children: [{
//       path: 'index',
//       component: () => import('@/views/tab/index'),
//       name: 'tab',
//       meta: { title: 'tab', icon: 'tab' }
//     }]
//   },

//   {
//     path: '/table',
//     component: Layout,
//     redirect: '/table/complex-table',
//     name: 'table',
//     meta: {
//       title: 'Table',
//       icon: 'table'
//     },
//     children: [
//       { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
//       { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
//       { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
//       { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
//       { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
//       { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
//     ]
//   },

//   {
//     path: '/example',
//     component: Layout,
//     redirect: '/example/list',
//     name: 'example',
//     meta: {
//       title: 'example',
//       icon: 'example'
//     },
//     children: [
//       { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
//       { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
//       { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
//     ]
//   },

//   {
//     path: '/nested',
//     component: Layout,
//     redirect: '/nested/menu1/menu1-1',
//     name: 'nested',
//     meta: {
//       title: 'nested',
//       icon: 'nested'
//     },
//     children: [
//       {
//         path: 'menu1',
//         component: () => import('@/views/nested/menu1/index'), // Parent router-view
//         name: 'menu1',
//         meta: { title: 'menu1' },
//         redirect: '/nested/menu1/menu1-1',
//         children: [
//           {
//             path: 'menu1-1',
//             component: () => import('@/views/nested/menu1/menu1-1'),
//             name: 'menu1-1',
//             meta: { title: 'menu1-1' }
//           },
//           {
//             path: 'menu1-2',
//             component: () => import('@/views/nested/menu1/menu1-2'),
//             name: 'menu1-2',
//             redirect: '/nested/menu1/menu1-2/menu1-2-1',
//             meta: { title: 'menu1-2' },
//             children: [
//               {
//                 path: 'menu1-2-1',
//                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
//                 name: 'menu1-2-1',
//                 meta: { title: 'menu1-2-1' }
//               },
//               {
//                 path: 'menu1-2-2',
//                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
//                 name: 'menu1-2-2',
//                 meta: { title: 'menu1-2-2' }
//               }
//             ]
//           },
//           {
//             path: 'menu1-3',
//             component: () => import('@/views/nested/menu1/menu1-3'),
//             name: 'menu1-3',
//             meta: { title: 'menu1-3' }
//           }
//         ]
//       },
//       {
//         path: 'menu2',
//         name: 'menu2',
//         component: () => import('@/views/nested/menu2/index'),
//         meta: { title: 'menu2' }
//       }
//     ]
//   },

//   {
//     path: '/error',
//     component: Layout,
//     redirect: 'noredirect',
//     name: 'errorPages',
//     meta: {
//       title: 'errorPages',
//       icon: '404'
//     },
//     children: [
//       { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
//       { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
//     ]
//   },

//   {
//     path: '/error-log',
//     component: Layout,
//     redirect: 'noredirect',
//     children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
//   },

//   {
//     path: '/excel',
//     component: Layout,
//     redirect: '/excel/export-excel',
//     name: 'excel',
//     meta: {
//       title: 'excel',
//       icon: 'excel'
//     },
//     children: [
//       { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
//       { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
//       { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
//     ]
//   },

//   {
//     path: '/zip',
//     component: Layout,
//     redirect: '/zip/download',
//     alwaysShow: true,
//     meta: { title: 'zip', icon: 'zip' },
//     children: [{ path: 'download', component: () => import('@/views/zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
//   },

//   {
//     path: '/theme',
//     component: Layout,
//     redirect: 'noredirect',
//     children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
//   },

//   {
//     path: '/clipboard',
//     component: Layout,
//     redirect: 'noredirect',
//     children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
//   },

//   {
//     path: '/i18n',
//     component: Layout,
//     children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
//   },

//   { path: '*', redirect: '/404', hidden: true }
// ]
