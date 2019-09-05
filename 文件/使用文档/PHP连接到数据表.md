# PHP连接到数据表

## 连接数据库

需要知道数据库的`主机名`、`用户名`、`密码`，以及想要写入的`数据库名`

```php
$username="root";//用户名
$password="123456";//密码
$servernmae="localhost";//主机名
$dbname="test";//数据库名
$connect=new mysqli($servernmae,$username,$password,$dbname);//建立数据库连接
```

## 插入数据的语句的格式

```php
$sql="insert into test (username,age,register_time) values ('liming',20,'{$time1}') ";//字段名和字段值要一一对应
```

## 执行语句

```php
$query=$connect->query($sql);
if($query){
echo "成功插入数据!";//返回成功
}
else{
echo $connect->error;//返回错误
}
```

## 测试

先开启本地的`apache`和`mysql`服务

## 参考

* [php怎样把数据添加到数据表](https://www.php.cn/php-ask-429934.html)
