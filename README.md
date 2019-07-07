### 一个使用Swagger + pm2 + jenkins构建的在线文档模板

### pm2 + jenkins + gitlab自动化部署实践

运行`pm2 ecosystem`在根目录生产`ecosystem.config.js`文件，然后编辑相应的设置项，具体参考官网。

1. `pm2 start process.json` or `pm2 start ecosystem.config.js`

### docker常用命令
- `docker ps` #列出正在运行的容器
- `docker ps -a` #查看所有容器，包括停止的
- `docker container kill [containerID]` #停止指定的容器运行

> 容器停止运行之后，并不会消失，用下面的命令删除容器文件

- `docker container ls --all` #查出容器的ID
- `docker container rm [containerID]` #删除指定的容器文件

> 也可以使用docker container run命令的--rm参数，在容器终止运行后自动删除容器文件

- `docker container run --name api-doc --rm -p 8000:5000 -it yusingz/yee_api bash`

- `docker image rm [选项] <镜像1> [<镜像2> ...]` #删除本地镜像 <镜像> 可以是 镜像短 ID、镜像长 ID、镜像名 或者 镜像摘要

- `docker exec -it api-doc bash`命令行进入`api-doc`容器
touch test.html
echo "<h1>test</h1> > test.html

- 退出时，使用`[ctrl + D]`，这样会结束docker当前线程，容器结束，可以使用`[ctrl + P][ctrl + Q]`退出而不终止容器运行


### docker启动
> 镜像是文件, 容器是进程。 容器是基于镜像创建的, 即容器中的进程依赖于镜像中的文件, 这里的文件包括进程运行所需要的可执行文件， 依赖软件， 库文件， 配置文件等等，简单点说容器是镜像运行的一个实例。

1. 编写Dockerfile文件

```javascript
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 5000
```

- FROM node:8.4：该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。
- COPY . /app：将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
- WORKDIR /app：指定接下来的工作路径为/app。
- RUN npm install：在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
- EXPOSE 5000：将容器 5000 端口暴露出来， 允许外部连接这个端口。

2. 制作image
`docker image build -t yusingz/yee_api .`

`-t参数用来指定 image 文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是latest。最后的那个点表示 Dockerfile 文件所在的路径，上例是当前路径，所以是一个点`

3. 生成容器
`docker container run -p 8000:5000 -it yusingz/yee_api bash`

- -p参数：容器的 5000 端口映射到本机的 8000 端口
- \-it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器
- yee_api:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）
- bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 

4. 修改容器
- 运行`docker commit`，可以查看该命令的参数列表
- 你需要指定要提交保存容器的ID(通过`docker ps -l` 命令获得)
- 无需拷贝完整的id，通常来讲最开始的三至四个字母即可区分
- **查看docker容器修改信息**`docker diff <container_id>`
- 保存容器内的修改`docker commit <container_id> <image_name>`

5. 在容器里启动应用  
启动成功后会出现：`root@7972e2f4fd7e:/app#`  
启动应用：`npm start`  

本机即可通过http://127.0.0.1:8000访问

6. 发布image文件
- `docker login`
- `docker image tag [imageName] [username]/[repository]:[tag]`
- `docker image tag yee_api:0.0.1 yusingz/yee_api:0.0.1` #标注用户名和版本，也可以不标注用户名
- `docker image build -t [username]/[repository][:tag]` #重新构建image文件
- `docker image push [username]/[repository]:[tag]`

### Linux 环境安装

1. 配置好git权限
2. 使用 nvm 来安装和管理 node，运行 `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`来安装 nvm ，安装完需要重启命令行才能生效，通过命令行`nvm ls-remote`查看可安装的node版本，安装指定版本`nvm install 10.16.0`
3. 安装 pm2 来管理项目进程
4. 安装 nginx 参考`https://qizhanming.com/blog/2018/08/06/how-to-install-nginx-on-centos-7` 查看nginx安装目录`ps -ef | grep nginx`， 查看nginx.conf配置文件目录`nginx -t`
