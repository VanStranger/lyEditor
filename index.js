var HTMLFormat = (function() {
    function style_html(html_source, indent_size, indent_character, max_char) {
    var Parser, multi_parser;

    function Parser() {

        this.pos = 0;
        this.token = '';
        this.current_mode = 'CONTENT';
        this.tags = {
            parent: 'parent1',
            parentcount: 1,
            parent1: ''
        };
        this.tag_type = '';
        this.token_text = this.last_token = this.last_text = this.token_type = '';


        this.Utils = {
            whitespace: "\n\r\t ".split(''),
            single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed'.split(','),
            extra_liners: 'head,body,/html'.split(','),
            in_array: function(what, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (what === arr[i]) {
                        return true;
                    }
                }
                return false;
            }
        }

        this.get_content = function() {
            var char = '';
            var content = [];
            var space = false;
            while (this.input.charAt(this.pos) !== '<') {
                if (this.pos >= this.input.length) {
                    return content.length ? content.join('') : ['', 'TK_EOF'];
                }

                char = this.input.charAt(this.pos);
                this.pos++;
                this.line_char_count++;


                if (this.Utils.in_array(char, this.Utils.whitespace)) {
                    if (content.length) {
                        space = true;
                    }
                    this.line_char_count--;
                    continue;
                } else if (space) {
                    if (this.line_char_count >= this.max_char) {
                        content.push('\n');
                        for (var i = 0; i < this.indent_level; i++) {
                            content.push(this.indent_string);
                        }
                        this.line_char_count = 0;
                    } else {
                        content.push(' ');
                        this.line_char_count++;
                    }
                    space = false;
                }
                content.push(char);
            }
            return content.length ? content.join('') : '';
        }

        this.get_script = function() {
            var char = '';
            var content = [];
            var reg_match = new RegExp('\<\/script' + '\>', 'igm');
            reg_match.lastIndex = this.pos;
            var reg_array = reg_match.exec(this.input);
            var end_script = reg_array ? reg_array.index : this.input.length;
            while (this.pos < end_script) {
                if (this.pos >= this.input.length) {
                    return content.length ? content.join('') : ['', 'TK_EOF'];
                }

                char = this.input.charAt(this.pos);
                this.pos++;


                content.push(char);
            }
            return content.length ? content.join('') : '';
        }

        this.record_tag = function(tag) {
            if (this.tags[tag + 'count']) {
                this.tags[tag + 'count']++;
                this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
            } else {
                this.tags[tag + 'count'] = 1;
                this.tags[tag + this.tags[tag + 'count']] = this.indent_level;
            }
            this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent;
            this.tags.parent = tag + this.tags[tag + 'count'];
        }

        this.retrieve_tag = function(tag) {
            if (this.tags[tag + 'count']) {
                var temp_parent = this.tags.parent;
                while (temp_parent) {
                    if (tag + this.tags[tag + 'count'] === temp_parent) {
                        break;
                    }
                    temp_parent = this.tags[temp_parent + 'parent'];
                }
                if (temp_parent) {
                    this.indent_level = this.tags[tag + this.tags[tag + 'count']];
                    this.tags.parent = this.tags[temp_parent + 'parent'];
                }
                delete this.tags[tag + this.tags[tag + 'count'] + 'parent'];
                delete this.tags[tag + this.tags[tag + 'count']];
                if (this.tags[tag + 'count'] == 1) {
                    delete this.tags[tag + 'count'];
                } else {
                    this.tags[tag + 'count']--;
                }
            }
        }

        this.get_tag = function() {
            var char = '';
            var content = [];
            var space = false;

            do {
                if (this.pos >= this.input.length) {
                    return content.length ? content.join('') : ['', 'TK_EOF'];
                }

                char = this.input.charAt(this.pos);
                this.pos++;
                this.line_char_count++;

                if (this.Utils.in_array(char, this.Utils.whitespace)) {
                    space = true;
                    this.line_char_count--;
                    continue;
                }

                if (char === "'" || char === '"') {
                    if (!content[1] || content[1] !== '!') {
                        char += this.get_unformatted(char);
                        space = true;
                    }
                }

                if (char === '=') {
                    space = false;
                }

                if (content.length && content[content.length - 1] !== '=' && char !== '>' && space) {
                    if (this.line_char_count >= this.max_char) {
                        this.print_newline(false, content);
                        this.line_char_count = 0;
                    } else {
                        content.push(' ');
                        this.line_char_count++;
                    }
                    space = false;
                }
                content.push(char);
            } while (char !== '>');

            var tag_complete = content.join('');
            var tag_index;
            if (tag_complete.indexOf(' ') != -1) {
                tag_index = tag_complete.indexOf(' ');
            } else {
                tag_index = tag_complete.indexOf('>');
            }
            var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
            if (tag_complete.charAt(tag_complete.length - 2) === '/' || this.Utils.in_array(tag_check, this.Utils.single_token)) {
                this.tag_type = 'SINGLE';
            } else if (tag_check === 'script') {
                this.record_tag(tag_check);
                this.tag_type = 'SCRIPT';
            } else if (tag_check === 'style') {
                this.record_tag(tag_check);
                this.tag_type = 'STYLE';
            } else if (tag_check.charAt(0) === '!') {
                if (tag_check.indexOf('[if') != -1) {
                    if (tag_complete.indexOf('!IE') != -1) {
                        var comment = this.get_unformatted('-->', tag_complete);
                        content.push(comment);
                    }
                    this.tag_type = 'START';
                } else if (tag_check.indexOf('[endif') != -1) {
                    this.tag_type = 'END';
                    this.unindent();
                } else if (tag_check.indexOf('[cdata[') != -1) {
                    var comment = this.get_unformatted(']]>', tag_complete);
                    content.push(comment);
                    this.tag_type = 'SINGLE';
                } else {
                    var comment = this.get_unformatted('-->', tag_complete);
                    content.push(comment);
                    this.tag_type = 'SINGLE';
                }
            } else {
                if (tag_check.charAt(0) === '/') {
                    this.retrieve_tag(tag_check.substring(1));
                    this.tag_type = 'END';
                } else {
                    this.record_tag(tag_check);
                    this.tag_type = 'START';
                }
                if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) {
                    this.print_newline(true, this.output);
                }
            }
            return content.join('');
        }

        this.get_unformatted = function(delimiter, orig_tag) {
            if (orig_tag && orig_tag.indexOf(delimiter) != -1) {
                return '';
            }
            var char = '';
            var content = '';
            var space = true;
            do {


                char = this.input.charAt(this.pos);
                this.pos++

                if (this.Utils.in_array(char, this.Utils.whitespace)) {
                    if (!space) {
                        this.line_char_count--;
                        continue;
                    }
                    if (char === '\n' || char === '\r') {
                        content += '\n';
                        for (var i = 0; i < this.indent_level; i++) {
                            content += this.indent_string;
                        }
                        space = false;
                        this.line_char_count = 0;
                        continue;
                    }
                }
                content += char;
                this.line_char_count++;
                space = true;


            } while (content.indexOf(delimiter) == -1);
            return content;
        }

        this.get_token = function() {
            var token;

            if (this.last_token === 'TK_TAG_SCRIPT') {
                var temp_token = this.get_script();
                if (typeof temp_token !== 'string') {
                    return temp_token;
                }
                //token = js_beautify(temp_token, this.indent_size, this.indent_character, this.indent_level);
                //return [token, 'TK_CONTENT'];
                return [temp_token, 'TK_CONTENT'];
            }
            if (this.current_mode === 'CONTENT') {
                token = this.get_content();
                if (typeof token !== 'string') {
                    return token;
                } else {
                    return [token, 'TK_CONTENT'];
                }
            }

            if (this.current_mode === 'TAG') {
                token = this.get_tag();
                if (typeof token !== 'string') {
                    return token;
                } else {
                    var tag_name_type = 'TK_TAG_' + this.tag_type;
                    return [token, tag_name_type];
                }
            }
        }

        this.printer = function(js_source, indent_character, indent_size, max_char) {
            this.input = js_source || '';
            this.output = [];
            this.indent_character = indent_character || ' ';
            this.indent_string = '';
            this.indent_size = indent_size || 2;
            this.indent_level = 0;
            this.max_char = max_char || 70;
            this.line_char_count = 0;
            for (var i = 0; i < this.indent_size; i++) {
                this.indent_string += this.indent_character;
            }

            this.print_newline = function(ignore, arr) {
                this.line_char_count = 0;
                if (!arr || !arr.length) {
                    return;
                }
                if (!ignore) {
                    while (this.Utils.in_array(arr[arr.length - 1], this.Utils.whitespace)) {
                        arr.pop();
                    }
                }
                arr.push('\n');
                for (var i = 0; i < this.indent_level; i++) {
                    arr.push(this.indent_string);
                }
            }


            this.print_token = function(text) {
                this.output.push(text);
            }

            this.indent = function() {
                this.indent_level++;
            }

            this.unindent = function() {
                if (this.indent_level > 0) {
                    this.indent_level--;
                }
            }
        }
        return this;
    }




    multi_parser = new Parser();
    multi_parser.printer(html_source, indent_character, indent_size);
    while (true) {
        var t = multi_parser.get_token();
        multi_parser.token_text = t[0];
        multi_parser.token_type = t[1];

        if (multi_parser.token_type === 'TK_EOF') {
            break;
        }


        switch (multi_parser.token_type) {
        case 'TK_TAG_START':
        case 'TK_TAG_SCRIPT':
        case 'TK_TAG_STYLE':
            multi_parser.print_newline(false, multi_parser.output);
            multi_parser.print_token(multi_parser.token_text);
            multi_parser.indent();
            multi_parser.current_mode = 'CONTENT';
            break;
        case 'TK_TAG_END':
            multi_parser.print_newline(true, multi_parser.output);
            multi_parser.print_token(multi_parser.token_text);
            multi_parser.current_mode = 'CONTENT';
            break;
        case 'TK_TAG_SINGLE':
            multi_parser.print_newline(false, multi_parser.output);
            multi_parser.print_token(multi_parser.token_text);
            multi_parser.current_mode = 'CONTENT';
            break;
        case 'TK_CONTENT':
            if (multi_parser.token_text !== '') {
                multi_parser.print_newline(false, multi_parser.output);
                multi_parser.print_token(multi_parser.token_text);
            }
            multi_parser.current_mode = 'TAG';
            break;
        }
        multi_parser.last_token = multi_parser.token_type;
        multi_parser.last_text = multi_parser.token_text;
    }
    return multi_parser.output.join('');
    }

    return function(data) {
    var dataHolder = ['__dataHolder_', [Math.random(), Math.random(), Math.random(), Math.random()].join('_').replace(/[^0-9]/g, '_'), '_'].join('_');
    var dataHolders = {};
    var index = 0;
    data = data.replace(/(\")(data:[^\"]*)(\")/g, function($0, $1, $2, $3) {
        var name = dataHolder + index++;
        dataHolders[name] = $2;
        return $1 + name + $3;
    })
    data = style_html(data, 1, '\t', 0x10000000);
    data = data.replace(new RegExp(dataHolder + '[0-9]+', 'g'), function($0) {
        return dataHolders[$0];
    });

    return data;
    }
    })();
var liyangEditor=function(){
    this.eid="";
    this.uploadUrl="";
    this.uploadName = "upfile";
    this.path ="../images/uploads/";
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
                            <li class="ops htmltext none"><a href="###" class="ops_a"><span class="iconfont "></span>text</a></li>
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
                                if(this.path){
                                    formdata.append("path",that.path);
                                }
                                var files=$(this)[0].files;
                                for(var i=0,len=files.length;i<len;i++){
                                    formdata.append(that.uploadName,files[i])
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
                                            document.execCommand("InsertImage", false, that.path+data['files'][i]);
                                            if(html1==$(that.eid +" .addtree_content_cont").html()){
                                                $(that.eid +" .addtree_content_cont").html($(that.eid +" .addtree_content_cont").html()+
                                                '<div><img src="'+that.path+data['files'][i]+'"></div>'+
                                                '');
                                            }
                                            that.imgs.push(that.path + data['files'][i]);
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
                            $(".addtree_content_cont")[0].innerText= HTMLFormat($(".addtree_content_cont").html());
                            console.log(HTMLFormat($(".addtree_content_cont").html()));
                        }else{
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
        return $(this.eid +" .addtree_content_cont").html();
    },
    getText:function(len){
        var text=$(this.eid +" .addtree_content_cont").text();
        if(len){
            text=text.substr(0,len);
        }
        return text;
    },
    setHtml:function(htmlstr){
        $(this.eid +" .addtree_content_cont").html(htmlstr);
        return this;
    },
    upload:function(url,upname,path,callback){
        this.uploadUrl = url;
        if(upname){
            this.uploadName=upname;
        }
        if(path){
            this.path=path;
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