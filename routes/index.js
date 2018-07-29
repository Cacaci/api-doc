const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

router.get('/app', async (ctx, next) => {
  await ctx.render('app')
})

module.exports = router
