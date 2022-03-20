# jodoll-outSource


###########环境依赖
----node

###########部署步骤

1. npm install  //安装node运行环境

2. npm run serve   //前端编译

3. npm run test   //测试包
4. npm run build  //生产包和测试包



###########目录结构描述
├── mock						// 单元测试
├── node_modules				// 依赖包
├── public                      // 静态
├── src                      	// 主体
│   ├── api						//
│   ├── assets                	// 
│   ├── components         		// 额外组件
│   ├── icons					// 存储的图标
│   ├── layout					// 布局
│   │	├── components			// 布局使用的组件
│   │	├── mixin				// 混入 用于触发窗口大小改变时的状态
│   │	└── index.vue			// 布局的首页
│   ├── router                	// 路由
│   │	├── moudules			// 路由模块
│   │	└── index.js			// 路由的入口文件
│   ├── store             	 	// VueX
│   ├── styles					// 样式文件
│   ├── utils         			// 配置
│   │	├── auth.js				// token保存
│   │	├── get-page-title.js	// 标题设置
│   │	└── request.js			// axios封装
│   ├── views         			// 视图
│   ├── App         			// 主要
│   ├── main.js         		// 入口
│   ├── permission.js         	// 拦截器
│   └── settings.js				// 主题设置
├── borwserslistrc				// 浏览器的兼容
├── env.development             // 开发环境
├── env.production				// 生产环境
├── env.test					// 测试环境
├── gitgnore					// git
├── babel.config.js           	// 编译配置
├── package.json				// 依赖包版本
├── package-lock.json           // 依赖模块和子模块的版本号
├── Readme.md                   // 目录
└── vue.config.js				// 配置



###########V1.0.0 版本内容更新
1. 新功能     aaaaaaaaa
2. 新功能     bbbbbbbbb
3. 新功能     ccccccccc
4. 新功能     ddddddddd