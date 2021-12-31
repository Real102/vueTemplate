const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.all('/*', function(req, res, next) {
	// 类似全局拦截器，所有请求的接口都会通过这里
	console.log('request addressed...')
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

// * 测试接口只需要使用 app.get 或 app.post 方法，注意post方法只能接受form表单格式数据（axios的qs模块格式化后可以接收），不能接收application/json格式的数据
app.get('/getUserInfo', function(req, res) {
	console.log(req.query)

	res.send({
		code: 10200,
		message: '成功',
		data: {
			account: 'wolfBerry',
			name: '云山水水',
			legalPerson: '法人',
			creditCode: 'dontknow1234567890',
			businessLicense: '4f1b9456-9abd-4a60-8af9-9d36803123e4-2021-02-02.png',
			location: '广东',
			category: '食宿服务-食品和饮料供应服务',
			introduction: '咖啡',
			email: '906368000@qq.com',
			website: '',
			telephone: '',
			status: 1,
			createTime: '2021-02-02T10:16:34.000+0000',
			updateTime: '2021-02-02T10:21:38.000+0000'
		},
		timestamp: 1612247171494
	})
})

app.post('/setUserInfo', function(req, res) {
	console.log(req.body)
	res.send({
		code: 10200,
		message: '成功',
		timestamp: 1612247171494
	})
})

app.use(function(req, res, next) {
	res.status(404).send('Sorry, can not find that!')
	next()
})

app.use(function(err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('Something broke!')
	next()
})

app.listen(3000, 'localhost')
