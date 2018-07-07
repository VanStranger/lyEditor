lyEditor
====
一个自制的富文本编辑器，支持切换html源码编辑。
----
![image](https://github.com/VanStranger/lyEditor/blob/master/images/demo.jpg)
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
 e.upload("../php/upload.php","imgs","../images/uploads/", "/lyEditor/images/uploads/",function(){//"../upload.php"为处理上传的文件，"imgs"为上传文件name，第三个参数为上传路径相对处理上传的后台文件的路径，第四个参数为展示html展示上传文件的路径（最好是相对网站根目录),第五个参数为回调参数。
        console.log("uploaded");
    });
```
