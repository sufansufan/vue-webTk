import Vue from "vue";
import Router from "vue-router";
import { getToken } from "@/utils/tools";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "home",
      component: resolve => require(["@/views/Layout"], resolve),
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: "/home",
          component: resolve => require(["@/components/Home"], resolve),
          meta: {
            title: "首页",
            requireAuth: true
          }
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: resolve => require(["@/components/common/Login"], resolve)
    },
    {
      path: "/questionBank",
      name: "questionBank",
      component: resolve => require(["@/views/Layout"], resolve),
      meta: {
        title: "题库",
        requireAuth: true
      },
      children: [
        {
          path: "allQuestions",
          name: "allquestions",
          component: resolve =>
            require([
              "@/components/questionBank/allQuestions/AllQuestions"
            ], resolve),
          meta: {
            title: "全部题目",
            requireAuth: true
          },
          children: [
            {
              path: "details/:id",
              name: "allquestionsDetails",
              component: resolve =>
                require([
                  "@/components/questionBank/subjectDetails/Details"
                ], resolve),
              meta: {
                title: "题目详情",
                requireAuth: true
              }
            }
          ]
        },
        {
          path: "addtopic",
          name: "addTopic",
          component: resolve =>
            require([
              "@/components/questionBank/subjectDetails/Details"
            ], resolve),
          meta: {
            title: "创建题目",
            requireAuth: true
          }
        },
        {
          path: "myupload",
          name: "myupload",
          component: resolve =>
            require(["@/components/questionBank/MyUpload"], resolve),
          meta: {
            title: "我的上传",
            requireAuth: true
          },
          children: [
            {
              path: "details/:id",
              name: "myuploadDetails",
              component: resolve =>
                require([
                  "@/components/questionBank/subjectDetails/Details"
                ], resolve),
              meta: {
                title: "题目详情",
                requireAuth: true
              }
            }
          ]
        },
        {
          path: "labelmanagement",
          name: "labelmanagement",
          component: resolve =>
            require([
              "@/components/questionBank/labelManager/LabelManagement"
            ], resolve),
          meta: {
            title: "标签管理",
            requireAuth: true
          }
        },
        {
          path: "questionBankFactory",
          name: "questionbankFactory",
          component: resolve =>
            require([
              "@/components/questionBank/questionBankFactory/List"
            ], resolve),
          meta: {
            title: "题库工厂",
            requireAuth: true
          },
          children: [
            {
              path: "batchImport",
              name: "batchImport",
              component: resolve =>
                require([
                  "@/components/questionBank/questionBankFactory/BatchImport"
                ], resolve),
              meta: {
                title: "批量导入",
                requireAuth: true
              }
            },
            {
              path: "details/:id",
              name: "questionbankFactoryDetails",
              component: resolve =>
                require([
                  "@/components/questionBank/subjectDetails/Details"
                ], resolve),
              meta: {
                title: "题目详情",
                requireAuth: true
              }
            }
          ]
        },
        {
          path: "topicReview",
          name: "topicReview",
          component: resolve =>
            require(["@/components/questionBank/topicReview/List"], resolve),
          meta: {
            title: "题目审核",
            requireAuth: true
          },
          children: [
            {
              path: "details/:id",
              name: "topicReviewDetails",
              component: resolve =>
                require([
                  "@/components/questionBank/subjectDetails/Details"
                ], resolve),
              meta: {
                title: "题目详情",
                requireAuth: true
              }
            }
          ]
        },
        {
          path: "parsingtemplate",
          name: "parsingtemplate",
          component: resolve =>
            require([
              "@/components/questionBank/parsingTemplate/ParsingTemplate"
            ], resolve),
          meta: {
            title: "解析模板",
            requireAuth: true
          }
        }
      ]
    },
    {
      path: "/testAssembly",
      name: "testAssembly",
      component: resolve => require(["@/views/Layout"], resolve),
      meta: {
        title: "组卷",
        requireAuth: true
      },
      children: [
        {
          path: "papersManage",
          name: "papersManage",
          component: resolve =>
            require([
              "@/components/testAssembly/papersManage/PapersManage"
            ], resolve),
          meta: {
            title: "组卷管理",
            requireAuth: true
          }
        },
        {
          path: "foundPaper",
          name: "foundPaper",
          component: resolve =>
            require([
              "@/components/testAssembly/papersManage/FoundPaper"
            ], resolve),
          meta: {
            title: "创建组卷",
            requireAuth: true
          }
        },
        {
          path: "intelligencePaper",
          name: "intelligencePaper",
          component: resolve =>
            require([
              "@/components/testAssembly/papersManage/IntelligencePaper"
            ], resolve),
          meta: {
            title: "智能组卷",
            requireAuth: true
          }
        }
      ]
    },
    {
      path: "/configure",
      name: "configure",
      component: resolve => require(["@/views/Layout"], resolve),
      meta: {
        title: "配置",
        requireAuth: true
      },
      children: [
        {
          path: "userGroup",
          name: "userGroup",
          component: resolve =>
            require(["@/components/configure/userGroup/UserGroup"], resolve),
          meta: {
            title: "用户组",
            requireAuth: true
          }
        },
        {
          path: "userManage",
          name: "userManage",
          component: resolve =>
            require(["@/components/configure/userManage/UserManage"], resolve),
          meta: {
            title: "用户管理",
            requireAuth: true
          }
        },
        {
          path: "personalInfor",
          name: "personalInfor",
          component: resolve =>
            require([
              "@/components/configure/personalInfor/PersonalInfor"
            ], resolve),
          meta: {
            title: "个人信息",
            requireAuth: true
          }
        },
        {
          path: "membersInfo",
          name: "membersInfo",
          component: resolve =>
            require([
              "@/components/configure/membersInfo/MembersInfo"
            ], resolve),
          meta: {
            title: "会员配置",
            requireAuth: true
          }
        }
      ]
    }
  ]
});

const LOGIN_PAGE_NAME = "login";

router.beforeEach((to, from, next) => {
  const token = getToken();
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({ path: LOGIN_PAGE_NAME, query: { redirect: to.fullPath } });
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next(); // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: "home" // 跳转到home页
    });
  } else {
    if (to.meta.requireAuth) {
      // 判断该路由是否需要登录权限
      next();
    }
  }
});

export default router;
