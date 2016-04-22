/**
 * 封装显示查询详情table的基本功能
 * 此功能是将 bootstrap.table 封装为一个标准模板
 * Created by JL on 2016/4/15.
 */

(function($,window) {
    var $table = {};
    var $remove = {};
    var selections = [];
    var _host = {
        get sname(){/*缩写名称*/
            return this.justify(this.name);
        },
        get sdb(){  /*缩写名称*/
           return this.justify(this.db);
        },
        get stable(){/*缩写名称*/
            return this.justify(this.table);
        },
        justify:function(str){
            return str ? ( str.length > 15 ? str.substr(0,12)+'...': str):'';
        },
    };
    var current = {};

    function initTable() {
        var guid = _host.guid;
        $table = $('#table_' + guid);
        $remove = $('#remove_' + guid);

        $table.bootstrapTable({
            detailFormatter: detailFormatter,
            height: getHeight(),
            columns: [
                [
                    {
                        field: 'state',
                        checkbox: true,
                        rowspan: 1,
                        align: 'center',
                        valign: 'middle'
                    },
                    {
                        title: 'Key',
                        field: '_id',
                        rowspan: 1,
                        align: 'center',
                        valign: 'middle',
                        formatter: keyFormater,
                        footerFormatter: totalTextFormatter
                    },
                    {
                        title: 'Value',
                        //field: '_id',
                        colspan: 1,
                        formatter: valueFormater,
                        align: 'center'
                   }
                ]
            ]
        });
        // sometimes footer render error.
        setTimeout(function () {
            $table.bootstrapTable('resetView');
        }, 200);
        $table.on('check.bs.table uncheck.bs.table ' +
            'check-all.bs.table uncheck-all.bs.table', function () {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });
        $table.on('expand-row.bs.table', function (e, index, row, $detail) {
            showEditor("code_" + row._id,row);
        });
        /*双击*/
        $table.on('dbl-click-row.bs.table',function(row,element){
            $('#json-target').show();
            $('#codeform').remove();

            current = element;
            var data = $.extend(true, {}, element);
            data._id = "ObjctId('"+ data._id +"')";
            //showEditor('code',data);
            showViewDocModal(data);
        });
        $table.on('all.bs.table', function (e, name, args) {
            console.log(name, args);
        });
        $remove.click(function () {
            var ids = getIdSelections();
            var url = '/host/'+$(this).attr('hid')+'/db/'+$(this).attr('db')+'/table/'+$(this).attr('table');
            $.ajax({
                type: 'delete',
                url : url,
                data: {_id:ids},
                beforeSend:function(){
                    //ladda.start();
                },
                complete:function(){
                    //ladda.stop();
                },
                success:function(result){
                    console.log(JSON.stringify(result));
                    if(result.success) {
                        $table.bootstrapTable('remove', {
                            field: '_id',
                            values: ids
                        });
                        $remove.prop('disabled', true);
                    }else{

                    }
                },
                error:function(err){
                    console.log("remove docs take error: "+ err);
                }
            });
        });
//    $(window).resize(function () {
//      $table.bootstrapTable('resetView', {
//        height: getHeight()
//      });
//    });
        var events = $._data($("#btn_edit")[0],'events');
        if(!events || !events['click']){
            $('#btn_edit').on('click',function(){
                $('#json-target').hide();
                $('code').parent().show();
                showEditor('code',current);
            });
        }
    }

    function showViewDocModal(data) {
        $("#shost").text(_host.sname);
        $("#sdb").text(_host.sdb);
        $("#stable").text(_host.stable);
        $('#json-target').html(new JSONFormat(JSON.stringify(data),4).toString());

        $('#viewdocModal').attr('hid',_host.id).attr('db',_host.db).attr('table',_host.table);
        $("#viewdocModal").modal();
    }

    function showEditor(id,data,theme) {
        $('#'+id).parent().children('form').remove();
        var html = '<form id="codeform"><textarea id="code" name="code"></textarea></form>';
        $('#json-target').parent().append(html);
        $('#'+id).text(format(JSON.stringify(data)));
        var editor = CodeMirror.fromTextArea(
            /*此处只能使用getElementById 获取元素，不可使用$("#id")*/
            window.document.getElementById(id), {
                lineNumbers: true,
                styleActiveLine: true,
                matchBrackets: true
            });
        editor.setOption("theme", theme||"mbo");
    }

    function getTemplate(host) {
        _host = $.extend(true,_host,host) ;/*克隆对象 防止取不到缩写名称*/
        var id = host.guid;
        return ['<div id="toolbar_'+ id +'">',
            '<button id="remove_'+ id +'" class="btn btn-sm btn-danger"',
            ' hid="'+ host.id +'"',
            ' db="'+ host.db +'"',
            ' table="'+ host.table +'"',
            ' disabled>',
            '<i class="glyphicon glyphicon-remove"></i> Delete',
            '</button></div>',
            '<table id="table_'+ id +'"',
            ' data-toolbar="#toolbar_'+ id +'"',
            ' hid="'+ host.id +'"',
            ' db="'+ host.db +'"',
            ' table="'+ host.table +'"',
            ' data-url="'+ host.url +'"',
            //' data-search="true"',
            //' data-height="80%"',
            ' data-show-refresh="true"',
            //' data-icon-size="xs"',
            //' data-show-toggle="true"',
            //' data-show-columns="true"',
            //' data-show-export="true"',
            ' data-detail-view="true"',
            //' data-detail-formatter="detailFormatter"',
            ' data-minimum-count-columns="2"',
            //' data-show-pagination-switch="true"',
            ' data-pagination="true"',
            ' data-id-field="_id"',
            ' data-page-list="[10, 25, 50, 100, ALL]"',
            ' data-show-footer="false"',
            ' data-side-pagination="server">',
            //'data-response-handler="responseHandler">',
            '</table>'].join('');
    }
    function valueFormater(value,row,index) {
        var result = JSON.stringify(row);
        if(result.length > 80) return result.substr(0,75) + ' ...';
        return result;
    }
    function keyFormater(value,row,index) {
        return 'ObjectId("' + value + '")';
    }
    function responseHandler(res) {
        $.each(res.rows, function (i, row) {
            row.state = $.inArray(row.id, selections) !== -1;
        });
        return res;
    }

    function totalTextFormatter(data) {
        return 'Total';
    }

    function totalNameFormatter(data) {
        return data.length;
    }
    var operateEvents = {
        'click .like': function (e, value, row, index) {
            alert('You click like action, row: ' + JSON.stringify(row));
        },
        'click .remove': function (e, value, row, index) {
            $table.bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            });
        }
    };
    function totalPriceFormatter(data) {
        var total = 0;
        $.each(data, function (i, row) {
            total += +(row.price.substring(1));
        });
        return '$' + total;
    }
    function getHeight() {
        return $(window).height() * 0.8 ;//- $('h1').outerHeight(true);
    }
    function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            return row._id
        });
    }
    function detailFormatter(index, row) {
        var data = $.extend(true, {}, row);
        data._id = "ObjctId('"+ data._id +"')";
        var html = ['<form><textarea id="code_'+ row._id +'" name="code">',
            format(JSON.stringify(data),false),
            '</textarea></form>'];
        return html.join('');
    }

    function format(txt,compress/*是否为压缩模式*/){/* 格式化JSON源码(对象转换为JSON文本) */
        compress = compress?compress:false;
        var indentChar = '    ';
        if(/^\s*$/.test(txt)){
            console.log('数据为空,无法格式化! ');
            return;
        }
        try{var data=eval('('+txt+')');}
        catch(e){
            console.log('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');
            return;
        };
        var draw=[],last=false,This=this,line=compress?'':'\n',nodeCount=0,maxDepth=0;

        var notify=function(name,value,isLast,indent/*缩进*/,formObj){
            nodeCount++;/*节点计数*/
            for (var i=0,tab='';i<indent;i++ )tab+=indentChar;/* 缩进HTML */
            tab=compress?'':tab;/*压缩模式忽略缩进*/
            maxDepth=++indent;/*缩进递增并记录*/
            if(value&&value.constructor==Array){/*处理数组*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
                for (var i=0;i<value.length;i++)
                    notify(i,value[i],i==value.length-1,indent,false);
                draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
            }else   if(value&&typeof value=='object'){/*处理对象*/
                draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/
                var len=0,i=0;
                for(var key in value)len++;
                for(var key in value)notify(key,value[key],++i==len,indent,true);
                draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/
            }else{
                if(typeof value=='string')value='"'+value+'"';
                draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
            };
        };
        var isLast=true,indent=0;
        notify('',data,isLast,indent,false);
        return draw.join('');
    }

    function operateFormatter(value, row, index) {
        return [
            '<a class="like" href="javascript:void(0)" title="Like">',
            '<i class="glyphicon glyphicon-heart"></i>',
            '</a>  ',
            '<a class="remove" href="javascript:void(0)" title="Remove">',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</a>'
        ].join('');
    }

    $.table = $.table || {};
    $.extend($.table, { init : initTable ,  template : getTemplate });
})(jQuery,window);