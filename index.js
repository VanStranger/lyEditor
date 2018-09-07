var lyEditor =(function(){
    var liyangEditor=function(){
        this.eid="";
        this.isHtml=0;
        this.uploadUrl="";
        this.uploadName = "upfile";
        this.path ="../images/uploads/";
        this.showpath=this.path;
        this.imgs=[];
        this.uploadCallback=function(){

        };
    }
    liyangEditor.prototype={
        init:function(eid){
            if(eid){
                this.eid=eid;
            }else{
                return true;
            }
            var oldhtml= document.querySelector(this.eid).innerHTML;
           document.querySelector(this.eid).innerHTML=`
                    <div class="addtree_content">
                        <div class="addtree_content_ops">
                            <ul class="clear">
                                <li class="ops htmltext behtml"><a href="###" class="ops_a"><span class="iconfont "></span>Html</a></li>
                                <li class="ops htmltext none"><a href="###" class="ops_a"><span class="iconfont "></span>DOM</a></li>
                                <li class="ops"><a href="###" class="ops_a"  data-role='undo'><span class="icon-undo"></span></a></li>
                                <li class="ops"><a href="###" class="ops_a" data-role='redo'><span class="icon-redo"></span></a></li>

                                <li class="ops">
                                    <a href="###" class="ops_a"><span class="iconfont "></span><b>H</b></a>
                                    <ul class="ops_zi">
                                            <li class="ops"><a href="###" class="ops_a" data-role='formatBlock' data-cmd='h1'><span class="iconfont "></span><h1>H1</h1></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='formatBlock' data-cmd='h2'><span class="iconfont "></span><h2>H2</h2></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='formatBlock' data-cmd='h3'><span class="iconfont "></span><h3>H3</h3></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='formatBlock' data-cmd='h4'><span class="iconfont "></span><h4>H4</h4></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='formatBlock' data-cmd='h5'><span class="iconfont "></span><h5>H5</h5></a></li>
                                    </ul>
                                </li>
                                <li class="ops">
                                    <a href="###" class="ops_a"><span class="iconfont "></span><b>字号</b></a>
                                    <ul class="ops_zi">
                                            <li class="ops"><a href="###" class="ops_a" data-role='fontsize' data-cmd='1'><span class="iconfont "></span><font size="1">1</font> </a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='fontsize' data-cmd='2'><span class="iconfont "></span><font size="2">2</font></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='fontsize' data-cmd='3'><span class="iconfont "></span><font size="3">3</font></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='fontsize' data-cmd='4'><span class="iconfont "></span><font size="4">4</font></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='fontsize' data-cmd='5'><span class="iconfont "></span><font size="5">5</font></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='fontsize' data-cmd='6'><span class="iconfont "></span><font size="6">6</font></a></li>
                                            <li class="ops"><a href="###" class="ops_a" data-role='fontsize' data-cmd='7'><span class="iconfont "></span><font size="7">7</font></a></li>
                                    </ul>
                                </li>
                                <li class="ops">
                                    <a href="###" class="ops_a" data-role='formatBlock' data-cmd='BLOCKQUOTE'><span class="icon-quotes-left"></span></a>
                                </li>


                                <li class="ops"><a href="###" class="ops_a" data-role='bold'><span class="iconfont "></span><b>B</b></a></li>
                                <li class="ops"><a href="###" class="ops_a" data-role='italic'><span class="iconfont "></span><em>Italic</em></a></li>
                                <li class="ops"><a href="###" class="ops_a" data-role='underline'><span class="iconfont "></span><u><b>U</b></u></a></li>
                                <li class="ops"><a href="###" class="ops_a"  data-role='strikeThrough'><span class="iconfont "></span><strike>abc</strike></a></li>
                                <li class="ops"><a href="###" class="ops_a"  data-role='JustifyLeft'><span class="icon-paragraph-left"></span></a></li>
                                <li class="ops"><a href="###" class="ops_a"  data-role='JustifyCenter'><span class="icon-paragraph-center"></span></a></li>
                                <li class="ops"><a href="###" class="ops_a"  data-role='JustifyRight'><span class="icon-paragraph-right"></span></a></li>



                                <li class="ops"><a href="###" class="ops_a imgup"><span class="icon-image"></span></a></li>
                                <li class="ops right"><a href="###" class="ops_a clearall"  data-role='removeFormat'>清除</a></li>

                                <li class="none"><input type="file" class="upfile" name="upfile[]" multiple="multiple"></li>
                            </ul>
                        </div>

                        <div class="addtree_content_cont" contenteditable="true">

                        </div>
                    </div>
                `;
            this.addclickfns();
            this.setHtml(oldhtml);
            return this;
        },
        addclickfns:function(){
            var that=this;
            console.log(that.eid);
            (function upimg(){
                document.querySelector(that.eid + " .upfile").addEventListener("change",function(){
                        console.log("up");
                        console.log(that.uploadUrl);
                            if(that.uploadUrl){
                                    var formdata=new FormData();
                                    if(that.path){
                                        formdata.append("path",that.path);
                                    }
                                    formdata.append("filename",that.uploadName);
                                    var files=this.files;
                                    for(var i=0,len=files.length;i<len;i++){
                                        formdata.append(that.uploadName+"[]",files[i])
                                    }

                                    var xhr = new XMLHttpRequest();
                                    //设置请求的类型及url
                                    xhr.open('post', that.uploadUrl);
                                    //post请求拼接字符串添加请求头才行不然会报错
                                    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                    //发送请求
                                    xhr.send(formdata);
                                    xhr.onreadystatechange = function () {
                                        // 这步为判断服务器是否正确响应
                                        if (xhr.readyState == 4 && xhr.status == 200) {
                                            console.log(xhr.responseText);
                                            var data=JSON.parse(xhr.responseText);
                                            if (data['state'] == "1") {
                                                for (var i = 0, len = data['files'].length; i < len; i++) {
                                                    var html1 = document.querySelector(that.eid + " .addtree_content_cont").innerHTML;
                                                    document.execCommand("InsertImage", false, that.showpath + data['files'][i]);
                                                    if (html1 == document.querySelector(that.eid + " .addtree_content_cont").innerHTML) {
                                                        document.querySelector(that.eid + " .addtree_content_cont").innerHTML = document.querySelector(that.eid + " .addtree_content_cont").innerHTML +
                                                            '<div><img src="' + that.showpath + data['files'][i] + '"></div>' +
                                                            '';
                                                    }
                                                    that.imgs.push(that.showpath + data['files'][i]);
                                                    console.log(that.imgs);
                                                    that.uploadCallback();
                                                }
                                            }
                                        }
                                    };

                                    // $.ajax({
                                    //     url: that.uploadUrl,
                                    //     type: 'post',
                                    //     dataType: 'json',
                                    //     processData:false,
                                    //     contentType:false,
                                    //     data: formdata,
                                    // })
                                    // .done(function(data) {
                                    //     if(data['state']=="1"){
                                    //         for(var i=0,len=data['files'].length;i<len;i++){
                                    //             var html1=document.querySelector(that.eid +" .addtree_content_cont").innerHTML;
                                    //             document.execCommand("InsertImage", false, that.showpath+data['files'][i]);
                                    //             if (html1 == document.querySelector(that.eid + " .addtree_content_cont").innerHTML){
                                    //                 document.querySelector(that.eid + " .addtree_content_cont").innerHTML = document.querySelector(that.eid + " .addtree_content_cont").innerHTML+
                                    //                 '<div><img src="'+that.showpath+data['files'][i]+'"></div>'+
                                    //                 '';
                                    //             }
                                    //             that.imgs.push(that.showpath + data['files'][i]);
                                    //             console.log(that.imgs);
                                    //         }
                                    //     }
                                    // })
                                    // .fail(function() {
                                    //     console.log("error");
                                    // })
                                    // .always(function() {
                                    // // upimg();
                                    //     that.uploadCallback();
                                    //     console.log("complete");
                                    // });
                        }

                        return false;
                    });
                })();
                document.addEventListener("click",function(event){
                    var e = event || window.event;
                    var target =e.target || e.srcElement;
                    var opsas = document.querySelectorAll(that.eid + " .ops_a");
                    function getNextElement(element) {
                        if (element.nextElementSibling) {
                            return element.nextElementSibling;
                        } else {
                            var next = element.nextSibling;//下一个兄弟节点
                            while (next && next.nodeType !== 1) {//一直往后找的条件，1有 2不是我要的
                                next = next.nextSibling;//继续往后找兄弟节点
                            }
                            return next;
                        };
                    }
                    while(target && target.parentNode){
                        for(var i=0,len=opsas.length;i<len;i++){
                            if(target==opsas[i]){
                                var objpp = target.parentNode.parentNode;
                                if(objpp.className.match("ops_zi")){
                                    objpp.className=objpp.className.replace("active","");
                                }

                                if (target.className.match('clearall')) {
                                    console.log("clearall");
                                    document.execCommand("formatBlock", false, "div");
                                    document.execCommand("removeFormat", false, null);
                                }
                                if (opsas[i].getAttribute("data-role")) {
                                    console.log("data-role");
                                    if (document.querySelector(that.eid).className.match("ishtml")) {
                                        return;
                                    }

                                        var cmd = opsas[i].getAttribute("data-cmd") || null;
                                        document.execCommand(opsas[i].getAttribute('data-role'), false, cmd);

                                } else if (target.className.match('imgup')) {
                                    document.querySelector(that.eid + " .upfile").click();
                                } else {
                                    var obj = target.parentNode;
                                    if (obj.className.match('htmltext')) {
                                        // obj.addClass('none').siblings('.htmltext').removeClass('none');
                                        obj.className+=" none";
                                        if (obj.className.match('behtml')) {
                                            console.log(obj);
                                            console.log(obj.nextElementSibing);
                                            console.log(getNextElement(obj));
                                            getNextElement(obj).className = getNextElement(obj).className.replace(/ none/g,"");
                                            document.querySelector(that.eid).className="ishtml";
                                            // obj.parent().addClass('ishtml');
                                            that.isHtml = 1;
                                            document.getElementsByClassName("addtree_content_cont")[0].innerText = document.getElementsByClassName("addtree_content_cont")[0].innerHTML.replace(/[^\n](<\/?div>)/g, "\r\n$1\r\n").replace(/\n(<\/?div>)[^\r]/g, "$1\r\n");
                                        } else {
                                            obj.previousElementSibling.className = obj.previousElementSibling.className.replace(/ none/g, "");
                                            that.isHtml = 0;
                                            // obj.parent().removeClass('ishtml');
                                            document.querySelector(that.eid).className = "";
                                            document.getElementsByClassName("addtree_content_cont")[0].innerHTML=document.getElementsByClassName("addtree_content_cont")[0].innerText;
                                        }
                                    } else {
                                        // var obj = $(this).next('.ops_zi');
                                        // if (obj.hasClass('active')) {
                                        //     $(".ops_zi").removeClass('active');
                                        // } else {
                                        //     $(".ops_zi").removeClass('active');
                                        //     obj.addClass('active');
                                        // }
                                        if(getNextElement(target).className.indexOf("active")!=-1){
                                            getNextElement(target).className=getNextElement(target).className.replace("active","");
                                        }else{
                                            target.className+=" active";
                                            getNextElement(target).className+=" active";
                                        }
                                    }
                                }
                                return;
                            }
                        }
                        target=target.parentNode;
                    }

                });
        },
        getHtml:function(){
            return this.isHtml ? document.querySelector(this.eid + " .addtree_content_cont").innerText : document.querySelector(this.eid + " .addtree_content_cont").innerHTML;
        },
        getText:function(len){

            var text = document.querySelector(this.eid +" .addtree_content_cont").innerText;
            if(this.isHtml){
                var dom=document.createElement("div");
                dom.innerHTML=text;
                text=dom.innerText;
            }
            if(len){
                text=text.substr(0,len);
            }
            return text;
        },
        setHtml:function(htmlstr){
            document.querySelector(this.eid +" .addtree_content_cont").innerHTML=htmlstr;
            return this;
        },
        upload:function(url,upname,path,showpath,callback){
            this.uploadUrl = url;
            if(upname){
                this.uploadName=upname;
            }
            if(path){
                this.path=path;
            }
            if(showpath){
                this.showpath=showpath;
            }
            if(typeof callback === "function"){
                this.uploadCallback=callback;
            }
        },
        getimgs:function(){
            return this.imgs;
        },
    }
    return new liyangEditor();
})();