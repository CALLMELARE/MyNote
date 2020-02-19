# DRF快速上手

**Django REST Framework (DRF)**

## 为什么是DRF

DRF是一个Django的APP，被设计于帮助开发符合RESTful规范的web应用

### 什么是RESTful规范

即接口的规范，规则，程序之间做数据交互所遵循的规则

### RESTful建议

- https代替http,保证数据传输时安全。
- 在url中一般要体现api标识，这样看到url就知道他是一个api。
`http://www.xxx.com/api/....`（建议，可避免跨域的问题）
`http://api.xxx.com/....`
- 在接口中要体现版本
`http://www.xxx.com/api/v1....`
- restful也称为面向资源编程，视网络上的一切都是资源，对资源可以进行操作，所以一般资源都用名词。
`http://www.xxx.com/api/user/`
- 如果要加入一些筛选条件，可以添加在url中
`http://www.xxx.com/api/user/?page=1&type=9`
- 根据method不同做不同操作。
`get`/`post`/`delete`/`patch`/`put`
- 返回给用户状态码

```bash
200，成功
300，301永久/302临时
400，403拒绝/404找不到
500，服务端代码错误
```

- 返回值

`GET` `http://www.xxx.com/api/user/`

```json
[
{'id':1,'name':'alex','age':19},
{'id':1,'name':'alex','age':19},
]
```

`POST` `http://www.xxx.com/api/user/`

```json
 {'id':1,'name':'alex','age':19}
```

`GET` `http://www.xxx.com/api/user/2/`

```json
{'id':2,'name':'alex','age':19}
```

`PUT` `http://www.xxx.com/api/user/2/`

```json
{'id':2,'name':'alex','age':19}
```

`PATCH` `https//www.xxx.com/api/user/2/`

```json
{'id':2,'name':'alex','age':19}
```

`DELETE` `https//www.xxx.com/api/user/2/`

- 操作异常时，要返回错误信息

```json
{
    error: "Invalid API key"
}
```

- 对于下一个请求要返回一些接口

```json
{
    'id':2,
    'name':'alex',
    'age':19,
    'depart': "http://www.xxx.com/api/user/30/"
}
```

## DRF安装

```bash
# 安装django
pip install django

# 安装djangorestframework
pip install djangorestframework
```

## APIView的理解

> **重要**
> 所有的请求都是通过APIView来分发的

先来观察View的源码

```py
# urls.py
from django.urls import path, include, re_path
from classbasedView import views
urlpatterns = [
    re_path('login/$', views.LoginView.as_view())
]

# views.py
from django.views import View
class LoginView(View):
    def get(self, request):
        pass
    def post(self, request):
        pass

# 父类View
class View:
    http_method_names = ['get', 'post', 'put', ...]
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
    @classonlymethod
    def as_view(cls, **initkwargs):
        for key in initkwargs:
            ...
        def view(request, * args, **kwargs):
            self = cls(**initkwargs)
            if hassttr(self, 'get') and not hasattr(self, 'head'):
                self.head = self.get
            self.request = request
            self.args = args
            self.kwargs = kwargs
            return self.dispatch(request, *args, **kwargs)
        view.view_class = cls
        view.view_initkwargs = initwargs
        update_wrapper(view, cls, updated=())
        update_wrapper(view, cls.dispatch, assigned=())
        return view
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_name:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)
```

执行流程如下

- 启动django项目, 即执行`python manage.py runserver 127.0.0.1:8000`
- 加载配置文件`settings.py`
  - 读取`models.py`
  - 加载`views.py`
  - 加载`urls.py`, 执行`as_view(): views.LoginView.as_view()`
- 执行父类**View**中的**as_view**方法，方法中定义了**view**函数, 此时url与某一个函数的对应关系建立, 并开始等待用户请求
- 当用户发来请求(如`GET`), 开始执行url对应的view函数, 并传入request对象，请求url对应view函数的执行结果, 最后将结果返回给用户

## DRF的使用

### Step 1:设计表结构

```py
from django.db import models
class Category(models.Model):#分类
    name = models.CharField(verbose_name='分类',max_length=32)

class Article(models.Model):#文章
    title = models.CharField(verbose_name='标题',max_length=32)
    summary = models.CharField(verbose_name='简介',max_length=255)
    content = models.TextField(verbose_name='文章内容')
```

### Step 2:注册DRF

```py
#setting.py INSTALLED_APPS下添加
'rest_framework'
```

### Step 3:设计路由

```py
from django.conf.urls import url
from django.contrib import admin
from drf_app import views
urlpatterns = [
    url(r'^admin/', admin.site.urls),# 文章类型url
    url(r'^drf/categore/$', views.DrfCategoreView.as_view()),#展示用
    url(r'^drf/categore/(?P<pk>\d+)/$', views.DrfCategoreView.as_view()), #编辑删除用
]
```

### Step 4:设计View

```py
from django.shortcuts import render 
from drf_app import models
from rest_framework.response import Response
from rest_framework.views import APIView
from django.forms import model_to_dict
# 文章类型
class DrfCategoreView(APIView):#继承APIView
#接口：实现访问接口时，创建一个文章类型
def post(self,request,*args,**kwargs):   #添加文章类型数据
    name = request.POST.get('name')      #获取提交的内容,key_values
    category_obj = models.Category(
    name=name #创建文章类型数据
)
    category_obj.save()       
    return Response('成功')              #给前端返回结果
#接口：获取所有文章类型
def get(self,request,*args,**kwargs):    #获取数据,在前端展示
    pk = kwargs.get('pk')                #获取单条数据的p值k
    if not pk:                           #判断pk知否存在
        obj = models.Article.objects.all().values()
        data = list(obj)
        return Response(data)            #Response只接受列表,字典,字符串类型的数据
    else:
        obj_dict = models.Article.objects.filter(pk=pk).first()
        data = model_to_dict(obj_dict)   #把对象转换成字典
        return Response(data)            #接口：更新文章类型
def put(self,request,*args,**kwargs):     #更新数据
    pk = kwargs.get('pk')
    models.Category.objects.filter(id=pk).update(**request.data)#request.data 返回解析之后的请求体数据
    return Response('更新成功')

#接口:删除文章类型
def delete(self,request,*args,**kwargs):   #删除数据
    pk = kwargs.get('pk')
    if not pk:
        return Response('删除失败,没有该条数据')
    models.Article.objects.filter(pk=pk).delete()
    return Response('删除成功')
```

## DRF相关操作

### DRF序列化

```py
from rest_framework import serializers
class NewCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        # fields = "__all__"
        fields = ['id','name']

class NewCategoryView(APIView):
    def get(self,request,*args,**kwargs):
        pk = kwargs.get('pk')
        if not pk:
            queryset = models.Category.objects.all()
            ser = NewCategorySerializer(instance=queryset,many=True)
            return Response(ser.data)
        else:
            model_object = models.Category.objects.filter(id=pk).first()
            ser = NewCategorySerializer(instance=model_object, many=False)
            return Response(ser.data)

    def post(self,request,*args,**kwargs):
        ser = NewCategorySerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(ser.errors)

    def put(self,request,*args,**kwargs):
        pk = kwargs.get('pk')
        category_object = models.Category.objects.filter(id=pk).first()
        ser = NewCategorySerializer(instance=category_object,data=request.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(ser.errors)

    def delete(self,request,*args,**kwargs):
        pk = kwargs.get('pk')
        models.Category.objects.filter(id=pk).delete()
        return Response('删除成功')
   #局部更新
    def patch(self,request,*args,**kwargs):
        pk = kwargs.get('pk')
        article_obj = models.Article.objects.filter(pk=pk).first()
        ser = ArticleSerializer(instance=article_obj, data=request.data,partial=True)  # partial=True
        if ser.is_valid():
            ser.save()
            return Response('更新成功')
        return Response(ser.errors)
```

### DRF分页

#### 方式一:PageNumberPagination

针对于每页固定显示数据个数,在访问路径需要加:?page=xx,看第几页的数据

```py
# settings.py
#定义每页显示的数据个数
REST_FRAMEWORK = {
    'PAGE_SIZE': 2
}  
# serializer.py
class PageArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Article
        fields = "__all__"

# view.py
from drf_app.serializer import PageArticleSerializer
from rest_framework.pagination import PageNumberPagination
class PageArticleView(APIView):
  def get(self,request,*args,**kwargs):
    queryset = models.Article.objects.all()
        # 方式一：仅数据
        # 分页对象
        page_object = PageNumberPagination()
        # 调用 分页对象.paginate_queryset方法进行分页，得到的结果是分页之后的数据
        # result就是分完页的一部分数据
        result = page_object.paginate_queryset(queryset,request,self)
        # 序列化分页之后的数据
        ser = PageArticleSerializer(instance=result,many=True)
            return Response(ser.data)
        # 方式二：数据 + 分页信息
        page_object = PageNumberPagination()
        result = page_object.paginate_queryset(queryset, request, self)
        ser = PageArticleSerializer(instance=result, many=True)
            return page_object.get_paginated_response(ser.data)
        # 方式三：数据 + 部分分页信息
        page_object = PageNumberPagination()
        result = page_object.paginate_queryset(queryset, request, self)
        ser = PageArticleSerializer(instance=result, many=True)
            return Response({'count':page_object.page.paginator.count,'result':ser.data})
```

#### 方式二: LimitOﬀsetPagination

针对于每页显示个数不固定,在访问路径上加/?offset=xx$limit=xx

```py
from rest_framework.pagination import PageNumberPagination
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import serializers
class PageArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Article
         fields = "__all__"
class HulaLimitOffsetPagination(LimitOffsetPagination):
    max_limit = 2
class PageArticleView(APIView):
    def get(self,request,*args,**kwargs):
    queryset = models.Article.objects.all()
    page_object = HulaLimitOffsetPagination()
    result = page_object.paginate_queryset(queryset, request, self)
    ser = PageArticleSerializer(instance=result, many=True)
    return Response(ser.data)
```

### DRF筛选

```py
class ArticleView(APIView):
    def get(self,request,*args,**kwargs):
        pk = kwargs.get('pk')
        if not pk:
            condition = {}
            category = request.query_params.get('category')
            if category:
                condition['category'] = category
                queryset = models.Article.objects.filter(**condition).order_by('date')
                pager = PageNumberPagination()
                result = pager.paginate_queryset(queryset,request,self)
                ser = ArticleListSerializer(instance=result,many=True)
                return Response(ser.data)
            article_object = models.Article.objects.filter(id=pk).first()
            ser = PageArticleSerializer(instance=article_object,many=False)
            return Response(ser.data)
```

### DRF版本控制

```py
class APIView(View):
    versioning_class = api_settings.DEFAULT_VERSIONING_CLASS
    def dispatch(self, request, *args, **kwargs):
        # ###################### 第一步 ###########################
        """
        request,是django的request，它的内部有：request.GET/request.POST/request.method
        args,kwargs是在路由中匹配到的参数，如：
            url(r'^order/(\d+)/(?P<version>\w+)/$', views.OrderView.as_view()),
            http://www.xxx.com/order/1/v2/
        """
        self.args = args
        self.kwargs = kwargs
        """
        request = 生成了一个新的request对象，此对象的内部封装了一些值。
        request = Request(request)
            - 内部封装了 _request = 老的request
        """
        request = self.initialize_request(request, *args, **kwargs)
        self.request = request
        self.headers = self.default_response_headers  # deprecate?
        try:
        # ###################### 第二步 ###########################
            self.initial(request, *args, **kwargs)

            执行视图函数。。
    def initial(self, request, *args, **kwargs):
        # ############### 2.1 处理drf的版本 ##############
        version, scheme = self.determine_version(request, *args, **kwargs)
        request.version, request.versioning_scheme = version, scheme
        ...
    def determine_version(self, request, *args, **kwargs):
        if self.versioning_class is None:
            return (None, None)
        scheme = self.versioning_class() # obj = XXXXXXXXXXXX()
        return (scheme.determine_version(request, *args, **kwargs), scheme)
class OrderView(APIView):
    versioning_class = URLPathVersioning
    def get(self,request,*args,**kwargs):
        print(request.version)
        print(request.versioning_scheme)
        return Response('...')

    def post(self,request,*args,**kwargs):
        return Response('post')
class URLPathVersioning(BaseVersioning):
    """
    urlpatterns = [
        url(r'^(?P<version>[v1|v2]+)/users/$', users_list, name='users-list'),
    ]
    """
    invalid_version_message = _('Invalid version in URL path.')
    def determine_version(self, request, *args, **kwargs):
        version = kwargs.get(self.version_param, self.default_version)
        if version is None:
            version = self.default_version
        if not self.is_allowed_version(version):
            raise exceptions.NotFound(self.invalid_version_message)
        return version
```

### DRF多版本使用

#### 局部使用

- url中写version

```py
url(r'^(?P<version>[v1|v2]+)/users/$', users_list, name='users-list'),
```

- 在视图中应用

```py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.versioning import URLPathVersioning
class OrderView(APIView):

    versioning_class = URLPathVersioning
    def get(self,request,*args,**kwargs):
        print(request.version)
        print(request.versioning_scheme)
        return Response('...')

    def post(self,request,*args,**kwargs):
        return Response('post')
```

- 在settings中配置

```py
REST_FRAMEWORK = {
    "PAGE_SIZE":2,
    "DEFAULT_PAGINATION_CLASS":"rest_framework.pagination.PageNumberPagination",
    "ALLOWED_VERSIONS":['v1','v2'],
    'VERSION_PARAM':'version'
}
```

#### 全局使用

- url中写version

```py
url(r'^(?P<version>[v1|v2]+)/users/$', users_list, name='users-list'),
url(r'^(?P<version>\w+)/users/$', users_list, name='users-list'),
```

- 在视图中应用

```py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.versioning import URLPathVersioning
class OrderView(APIView):
    def get(self,request,*args,**kwargs):
        print(request.version)
        print(request.versioning_scheme)
        return Response('...')

    def post(self,request,*args,**kwargs):
        return Response('post')
```

-在settings中配置

```py
REST_FRAMEWORK = {
    "PAGE_SIZE":2,
    "DEFAULT_PAGINATION_CLASS":"rest_framework.pagination.PageNumberPagination",
    "DEFAULT_VERSIONING_CLASS":"rest_framework.versioning.URLPathVersioning",
    "ALLOWED_VERSIONS":['v1','v2'],
    'VERSION_PARAM':'version'
}
```

### 访问频率限制

逻辑:

- 获取当前时间
- 时间早于当前时间减去时间间隔的记录全部删除
- 判断时间间隔内已访问次数
- 决定是否允许访问

```py
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.throttling import AnonRateThrottle,BaseThrottle

class ArticleView(APIView):
    throttle_classes = [AnonRateThrottle,]
    def get(self,request,*args,**kwargs):
        return Response('文章列表')

class ArticleDetailView(APIView):
    def get(self,request,*args,**kwargs):
        return Response('文章列表')
class BaseThrottle:
    """
    Rate throttling of requests.
    """

    def allow_request(self, request, view):
        """
        Return `True` if the request should be allowed, `False` otherwise.
        """
        raise NotImplementedError('.allow_request() must be overridden')

    def get_ident(self, request):
        """
        Identify the machine making the request by parsing HTTP_X_FORWARDED_FOR
        if present and number of proxies is > 0. If not use all of
        HTTP_X_FORWARDED_FOR if it is available, if not use REMOTE_ADDR.
        """
        xff = request.META.get('HTTP_X_FORWARDED_FOR')
        remote_addr = request.META.get('REMOTE_ADDR')
        num_proxies = api_settings.NUM_PROXIES

        if num_proxies is not None:
            if num_proxies == 0 or xff is None:
                return remote_addr
            addrs = xff.split(',')
            client_addr = addrs[-min(num_proxies, len(addrs))]
            return client_addr.strip()

        return ''.join(xff.split()) if xff else remote_addr

    def wait(self):
        """
        Optionally, return a recommended number of seconds to wait before
        the next request.
        """
        return None


class SimpleRateThrottle(BaseThrottle):
    """
    A simple cache implementation, that only requires `.get_cache_key()`
    to be overridden.

    The rate (requests / seconds) is set by a `rate` attribute on the View
    class.  The attribute is a string of the form 'number_of_requests/period'.

    Period should be one of: ('s', 'sec', 'm', 'min', 'h', 'hour', 'd', 'day')

    Previous request information used for throttling is stored in the cache.
    """
    cache = default_cache
    timer = time.time
    cache_format = 'throttle_%(scope)s_%(ident)s'
    scope = None
    THROTTLE_RATES = api_settings.DEFAULT_THROTTLE_RATES

    def __init__(self):
        if not getattr(self, 'rate', None):
            self.rate = self.get_rate()
        self.num_requests, self.duration = self.parse_rate(self.rate)

    def get_cache_key(self, request, view):
        """
        Should return a unique cache-key which can be used for throttling.
        Must be overridden.

        May return `None` if the request should not be throttled.
        """
        raise NotImplementedError('.get_cache_key() must be overridden')

    def get_rate(self):
        """
        Determine the string representation of the allowed request rate.
        """
        if not getattr(self, 'scope', None):
            msg = ("You must set either `.scope` or `.rate` for '%s' throttle" %
                   self.__class__.__name__)
            raise ImproperlyConfigured(msg)

        try:
            return self.THROTTLE_RATES[self.scope]
        except KeyError:
            msg = "No default throttle rate set for '%s' scope" % self.scope
            raise ImproperlyConfigured(msg)

    def parse_rate(self, rate):
        """
        Given the request rate string, return a two tuple of:
        <allowed number of requests>, <period of time in seconds>
        """
        if rate is None:
            return (None, None)
        num, period = rate.split('/')
        num_requests = int(num)
        duration = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}[period[0]]
        return (num_requests, duration)

    def allow_request(self, request, view):
        """
        Implement the check to see if the request should be throttled.

        On success calls `throttle_success`.
        On failure calls `throttle_failure`.
        """
        if self.rate is None:
            return True

        # 获取请求用户的IP
        self.key = self.get_cache_key(request, view)
        if self.key is None:
            return True

        # 根据IP获取他的所有访问记录，[]
        self.history = self.cache.get(self.key, [])

        self.now = self.timer()

        # Drop any requests from the history which have now passed the
        # throttle duration
        while self.history and self.history[-1] <= self.now - self.duration:
            self.history.pop()
        if len(self.history) >= self.num_requests:
            return self.throttle_failure()
        return self.throttle_success()

    def throttle_success(self):
        """
        Inserts the current request's timestamp along with the key
        into the cache.
        """
        self.history.insert(0, self.now)
        self.cache.set(self.key, self.history, self.duration)
        return True

    def throttle_failure(self):
        """
        Called when a request to the API has failed due to throttling.
        """
        return False

    def wait(self):
        """
        Returns the recommended next request time in seconds.
        """
        if self.history:
            remaining_duration = self.duration - (self.now - self.history[-1])
        else:
            remaining_duration = self.duration

        available_requests = self.num_requests - len(self.history) + 1
        if available_requests <= 0:
            return None

        return remaining_duration / float(available_requests)


class AnonRateThrottle(SimpleRateThrottle):
    """
    Limits the rate of API calls that may be made by a anonymous users.

    The IP address of the request will be used as the unique cache key.
    """
    scope = 'anon'

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            return None  # Only throttle unauthenticated requests.

        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request)
        }
```

### DRF用户认证

#### 方式一 token

- 用户登录成功之后，生成一个随机字符串，自己保留一分，给前端返回一份
- 以后前端再来发请求时，需要携带字符串
- 后端对字符串进行校验

#### 方式二 jwt(JSON Web Token)

- 用户登录成功之后，生成一个随机字符串，给前端。
  - 生成随机字符串

```json
{typ:"jwt","alg":'HS256'}
{id:1,username:'alx','exp':10}
```

`98qow39df0lj980945lkdjflo.saueoja8979284sdfsdf.asiuokjd978928374`

- 类型信息通过base64加密
  - 数据通过base64加密
  - 两个密文拼接在h256加密校验
  - 给前端返回`98qow39df0lj980945lkdjflo.saueoja8979284sdfsdf.asiuokjd978928375`

- 前端获取随机字符串之后，保留起来。以后再来发送请求时，携带`98qow39df0lj980945lkdjflo.saueoja8979284sdfsdf.asiuokjd978928375`。

- 后端接受到之后，
  - 先做时间判断
  - 字符串合法性校验。