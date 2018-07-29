module.exports = {
  apps: [{
    name: 'yee-api-doc',
    script: './bin/www',
    watch: true,
    instances: 'max',
    exec_mode: 'cluster',
    ignore_watch: ['node_modules'],
    log_file: 'log/combine.outerr.log',
    out_file: "./logs/pm2-out.log",
    error_file: "./logs/pm2-err.log",
    combine_logs: true,
    env: {
      // NODE_ENV: 'development'
      COMMON_VARIABLE: 'true'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  // 部署环境的设置，自己只用到了开发环境，需要修改完代码之后立刻看到结果，所以就没有生产环境的配置
  deploy: {
    production: {
      user: 'root',
      host: '127.0.0.1',
      ref: 'origin/master',
      repo: 'git@github.com:yusingz/yee_api.git',
      // 项目要部署到服务器上的位置，PM2 默认会部署到该路径的 source 子文件夹下
      path: '/www/wwwroot/yee_api_doc',
      // 服务器下载到最新的代码之后要执行的命令
      // 'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'post-deploy': 'npm install && npm run prd',
    },
  }
};