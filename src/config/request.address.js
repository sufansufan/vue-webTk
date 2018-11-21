export default {
  install(Vue) {
    Vue.prototype.reqLink = {
      // 登录
      userLogin: "/sys/userLogin",
      // 身份验证
      authenCheck: "/sys/authenCheck",
      // 获取用户信息
      getUserLoginInfo: "/a/sys/getUserLoginInfo",
      // 获取会员信息配置列表
      getMemberList: "/a/sys/getMemberList",
      // 注册
      register: "/sys/register",
      // 获取验证码
      getAutenCode: "/sys/getAutenCode",
      // 获取数据库字典
      getDictListByType: "/a/utils/getDictListByType",
      // 获取数据库字典(带统计)
      getTopicCountByType: "/a/utils/getTopicCountByType",
      // 添加修改数据库字典值
      createAndUpdateAndDeleteDictInfo:
        "/a/utils/createAndUpdateAndDeleteDictInfo",
      // 删除数据库字典
      deleteDictInfo: "/a/utils/deleteDictInfo",
      // 获取知识树列表
      getKonwledgeTreeList: "/a/topicBank/getKonwledgeTreeList",
      // 添加/编辑知识树节点
      creatAndUpdateKonwledgeTree: "/a/topicBank/creatAndUpdateKonwledgeTree",
      // 删除知识树节点
      deleteKonwledgeTree: "/a/topicBank/deleteKonwledgeTree",
      // 获取题库题目列表
      getTopicList: "/a/topicBank/getTopicList",
      // 上传题库题目
      updateTopicForUpload: "/a/topicBank/updateTopicForUpload",
      // 上/下架题目
      updateTopicForDownway: "/a/topicBank/updateTopicForDownway",
      // 题目审核
      updateTopicForAudit: "/a/topicBank/updateTopicForAudit",
      // 删除题库题目
      deleteTopic: "/a/topicBank/deleteTopic",
      // 获取题库题目详情
      getTopicInfo: "/a/topicBank/getTopicInfo",
      // 添加修改题目基本信息
      createAndUpdateTopicInfo: "/a/topicBank/createAndUpdateTopicInfo",
      // 上传文件
      uploadFile: "/a/utils/uploadFile",
      // 查询题目解析模板
      getTopicAnalysisTempleteList: "/a/topicBank/getTopicAnalysisTempleteList",
      // 添加编辑解析模板
      createAndUpdateTopicAnalysisTemplete:
        "/a/topicBank/createAndUpdateTopicAnalysisTemplete",
      // 删除题目解析模板
      deleteTopicAnalysisTemplete: "/a/topicBank/deleteTopicAnalysisTemplete",
      // 删除题目解析模板内容
      deleteTopicAnalysisTempleteContent:
        "/a/topicBank/deleteTopicAnalysisTempleteContent",
      // 获取题目解析信息
      getKonwledgeAnalysis: "/a/topicBank/getKonwledgeAnalysis",
      // 添加编辑题目解析
      createAndUpdateKonwledgeAnalysis:
        "/a/topicBank/createAndUpdateKonwledgeAnalysis",
      // 删除题目解析
      deleteTopicAnalysis: "/a/topicBank/deleteTopicAnalysis",
      // 获取题目操作历史
      getTopicOperationHistory: "/a/topicBank/getTopicOperationHistory",
      // 发表题目评论
      createTopicComment: "/a/topicBank/createTopicComment",
      // 获取题目评论列表
      getTopicCommentList: "/a/topicBank/getTopicCommentList",
      // 题目评论点赞或取消点赞
      createtopicCommentLike: "/a/topicBank/createtopicCommentLike",
      // 获取题库工厂列表
      findTopicFactoryInfoList: "/a/topicBank/findTopicFactoryInfoList",
      // 获取题目导入模板
      getTopicTempleteFile: "/a/topicBank/getTopicTempleteFile",
      // 题库工厂上传文件模板
      getTopicInfoByFile: "/a/topicBank/getTopicInfoByFile",
      // 确定导入文件模板
      createTopicInfoByFile: "/a/topicBank/createTopicInfoByFile"
    };
  }
};
