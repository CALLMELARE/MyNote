# CentOS7安装python3

### 开始前的准备

使用xshell连接到centos （方法略）

### 基本思路

1. 备份centos7自带的python2.7
2. 为python3准备一个安装目录
3. 下载python tgz包，编译，安装
4. 创建软连接
5. 测试是否安装成功

### Step 1 备份centos7自带的python2.7

切换到根目录

```bash
[root@localhost /]# cd /
```

打开python2.7的安装位置

```shell
[root@localhost /]# cd /usr/bin
[root@localhost bin]# ls python*
python python2 python2.7
```

查看依赖关系

```shell
[root@localhost bin]# ls -al  python*
lrwxrwxrwx. 1 root root   33 Oct 21 12:30 python -> python2
lrwxrwxrwx. 1 root root    9 Oct 19 23:55 python2 -> python2.7
-rwxr-xr-x. 1 root root 7136 Aug  4 08:40 python2.7
```

备份python2.7

```shell
[root@localhost bin]# mv python python.bak
```

其中`python.bak`即为备份文件

### Step 2 为python3准备一个安装目录

创建目录

```shell
[root@localhost bin]# mkdir /usr/local/python3
```

切换到新目录

```shell
[root@localhost bin]# cd /usr/local/python3
```

检查是否为空目录

```shell
[root@localhost python3]# ll
total 0
```

### Step 3 下载python tgz包，编译，安装

打开python官网选择一个合适的版本

[https://www.python.org/ftp/python/](https://www.python.org/ftp/python/)

以python3.9.1为例，根据url拼接为链接

如：https://www.python.org/ftp/python/3.9.1/Python-3.9.1.tgz

下载tgz包

```shell
[root@localhost python3]# wget https://www.python.org/ftp/python/3.9.1/Python-3.9.1.tgz
```

进行解压

```shell
[root@localhost python3]# tar -xvf Python-3.9.1.tgz 
```

查看解压后目录内文件

```shell
[root@localhost python3]# ll
```

应当看到名为`Python-3.9.1`及`Python-3.9.1.tgz`文件

进入文件目录

```shell
[root@localhost python3]# cd Python-3.9.1/
```

指定python安装目录

```shell
[root@localhost Python-3.9.1]# ./configure --prefix=/usr/local/python3Dir
```

输入编译、安装命令，中间的执行过程需要等待数分钟

```
[root@localhost Python-3.9.1]# make
[root@localhost Python-3.9.1]# make install
```

### Step 4 创建软连接

切到`/usr/bin`目录

```shell
[root@localhost Python-3.9.1]# cd /usr/bin
```

创建软链接

```shell
[root@localhost bin]# ln -s /usr/local/python3Dir/bin/python3 /usr/bin/python
```

指定yum使用的python版本

```shell
[root@localhost bin]# vi /usr/bin/yum
```

输入英文字母`i`，进入insert模式，将文件开头的`\#!/usr/bin/python`改成`#!/usr/bin/python2.7 `

按下`ESC`键，输入`:wq`后回车即可保存更改

### Step 5 测试是否安装成功

查看链接情况

```shell
[root@localhost bin]# ll -a python*
```

查看当前python版本

```shell
[root@localhost bin]# python -V
Python 3.9.1
```

