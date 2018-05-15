lyEditor
====
一个自制的富文本编辑器，支持切换html源码编辑。
----
![image](https://github.com/VanStranger/lyEditor/images/demo.jpg)
# 下载到根目录
# 引入index.js css.css
# 初始化
```JavaScript
var e = lyEditor.init("#editor");//editor为需要添加editor的父容器id
```
## 常用方法
* 获取html
```JavaScript
e.getHtml();
```
* 获取text
```JavaScript
e.getText(200);//200为需要截取的长度，可以不填。
```
* 设置html
```javascript
e.setHtml("<p>这里是测试文字</p>");
```
* 设置上传
```javascript
e.upload("../upload.php","imgs",function(){//"../upload.php"为处理上传的文件，"imgs"为上传文件name，第三个参数为回调。
    console.log("uploaded");
});
```
