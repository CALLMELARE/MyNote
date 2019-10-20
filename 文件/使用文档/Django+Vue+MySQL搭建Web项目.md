# Django+Vue+MySQL 搭建Web项目

Django `Python` 作服务端
Vue.js `JavaScript` 作前端
MySQL 数据库

## 环境配置

* Django 相关：
  * Python `3.6+`
  * Django `2.2 LTS`
  * MySQL `5.7`
* Vue 相关
  * Node.js `10.16.3 LTS`

## 搭建Django项目

```bash
django-admin startproject projectname
```

进入项目根目录，创建app

```bash
python manage.py startapp appname
```

目录结构如下所示

* myapp
    * migrations (project)
      * \_init\_ .py
      * admin .py
      * apps .py
      * models .py
      * tests .py
      * views .py
* project (app)
    * \_init\_ .py
    * \_init\_ .pyc
    * settings .py
    * settings .pyc
    * urls .py
    * wsgi .py
* manage .py

在`settings.py`中用MySQL替换默认的SQLite3

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': '',# 名称
        'USER': 'root',
        'PASSWORD': '',# 密码
        'HOST': '127.0.0.1',
    }
}
```

将app加入**installed—apps**列表

```python
INSTALLED_APPS = [
    ......

    'appname',
]
```

在`models.py`中写model，此处仅为简单示例：

```python
from django.db import models

class SimpleModel(models.Model):
    key_name = models.CharField(max_length=64)

    def __unicode__(self):
    return self.key_name #返回值
```

对应的，在`view.py`中新增接口，使用`JsonResponse`返回Json格式的数据

```python
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.http import JsonResponse
import json
from .models import TheData # 引入数据

@require_http_methods(["GET"])
def show_key_name(request):
    response = {}
    try:
        key_name = TheData.objects.filter()
        response['data'] = json.loads(serializers.serialize("json",key_name))
        response['message'] = 'success'
        response['error_code'] = 0
    except Exception as e:
        response['message'] = str(e)
        response['error_code'] = 1

return JsonResponse(response)
```

新建文件`app/urls.py`，将接口添加到路由里

```python
from django.conf.urls import url,
from . import views

urlpatterns = [url(r'show_key_name$',views.show_key_name,),]
```

将app中urls添加到`project/urls.py`，完成路由

```python
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView
import app.urls

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include(app.urls)),
    url(r'^$', TemplateView.as_view(template_name="index.html")),
]
```

在根目录中，键入

```bash
python manage.py makemigrations myapp
python manage.py migrate
```

启动服务

```bash
python manage.py runserver
```

访问`127.0.0.1:8000/api/show_key_name`测试接口可用性

## 搭建Vue.js项目

详见 [Vue-cli 快速上手](http://www.callmelare.cn/blog/index.php/archives/19/)

## 前后端项目整合

**目标：使Django的`TemplateView`指向Vue打包后的`dist`文件**

配置模版，使Django获取入口页面`index.html`

在`project/settings.py`中

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['appfront/dist'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

配置静态文件的搜索路径

在`project/settings.py`中

```python
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "appfront/dist/static"),
]
```

Django服务端口：**8000**
node服务端口：**8080**


## 跨域问题

在Django中注入header，使用`django-cors-headers`解决跨域问题

```bash
pip install django-cors-headers
```

修改`settings.py`

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
 
CORS_ORIGIN_ALLOW_ALL = True
```
