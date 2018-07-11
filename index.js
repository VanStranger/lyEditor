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
        $(eid).html(`
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
            `);
        this.addclickfns();
        return this;
    },
    addclickfns:function(){
        var that=this;
        console.log(that.eid);
        (function upimg(){
                $(that.eid +" .upfile").change(function(event) {
                    console.log("up");
                    console.log(that.uploadUrl);
                        if(that.uploadUrl){
                                var formdata=new FormData();
                                if(that.path){
                                    formdata.append("path",that.path);
                                }
                                formdata.append("filename",that.uploadName);
                                var files=$(this)[0].files;
                                for(var i=0,len=files.length;i<len;i++){
                                    formdata.append(that.uploadName+"[]",files[i])
                                }
                                $.ajax({
                                    url: that.uploadUrl,
                                    type: 'post',
                                    dataType: 'json',
                                    processData:false,
                                    contentType:false,
                                    data: formdata,
                                })
                                .done(function(data) {
                                    if(data['state']=="1"){
                                        for(var i=0,len=data['files'].length;i<len;i++){
                                            var html1=$(that.eid +" .addtree_content_cont").html();
                                            document.execCommand("InsertImage", false, that.showpath+data['files'][i]);
                                            if(html1==$(that.eid +" .addtree_content_cont").html()){
                                                $(that.eid +" .addtree_content_cont").html($(that.eid +" .addtree_content_cont").html()+
                                                '<div><img src="'+that.showpath+data['files'][i]+'"></div>'+
                                                '');
                                            }
                                            that.imgs.push(that.showpath + data['files'][i]);
                                            console.log(that.imgs);
                                        }
                                    }
                                })
                                .fail(function() {
                                    console.log("error");
                                })
                                .always(function() {
                                // upimg();
                                    that.uploadCallback();
                                    console.log("complete");
                                });
                    }

                    return false;
                });
            })();
            $(document).on("click",this.eid +" .ops_a",function(event) {
                $(this).parent().parent(".ops_zi").removeClass('active');
                if($(this).hasClass('clearall')){
                    document.execCommand("formatBlock",false,"div");
                    document.execCommand("removeFormat",false,null);
                }
                if($(this).attr("data-role")){
                    if($(this).parents(".ishtml").length){
                        return;
                    }
                    var cmd=$(this).attr("data-cmd") || null;
                    document.execCommand($(this).data('role'), false, cmd);
                }else if($(this).hasClass('imgup')){
                    $(that.eid + " .upfile").click();
                }else{
                    var obj=$(this).parent();
                    if(obj.hasClass('htmltext')){
                        obj.addClass('none').siblings('.htmltext').removeClass('none');
                        if(obj.hasClass('behtml')){
                            obj.parent().addClass('ishtml');
                            that.isHtml=1;
                            $(".addtree_content_cont")[0].innerText = $(".addtree_content_cont").html().replace(/[^\n](<\/?div>)/g, "\r\n$1\r\n").replace(/\n(<\/?div>)[^\r]/g, "$1\r\n");
                        }else{
                            that.isHtml=0;
                            obj.parent().removeClass('ishtml');
                            $(".addtree_content_cont").html($(".addtree_content_cont").text());
                        }
                    }else{
                        var obj=$(this).next('.ops_zi');
                        if(obj.hasClass('active')){
                            $(".ops_zi").removeClass('active');
                        }else{
                            $(".ops_zi").removeClass('active');
                            obj.addClass('active');
                        }
                    }
                }
            });
    },
    getHtml:function(){
        return this.isHtml ? $(this.eid + " .addtree_content_cont").text() : $(this.eid + " .addtree_content_cont").html();
    },
    getText:function(len){

        var text=$(this.eid +" .addtree_content_cont").text();
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
        $(this.eid +" .addtree_content_cont").html(htmlstr);
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
var lyEditor=new liyangEditor();