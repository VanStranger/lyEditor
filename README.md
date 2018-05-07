lyEditor
====
一个自制的富文本编辑器，支持切换html源码编辑。
----
# 下载到根目录
# 引入index.js
# 初始化
```JavaScript
lyEditor.init("#editor");//editor为需要添加editor的父容器id
```
## 常用方法
*获取html
```JavaScript
lyEditor.getHtml();
```
*获取text
```JavaScript
lyEditor.getText(200);//200为需要截取的长度，可以不填。
```
*设置html
```javascript
lyEditor.setHtml("<p>这里是测试文字</p>");
```
