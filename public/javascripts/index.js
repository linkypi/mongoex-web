/**
 * Created by JL on 2016/3/25.
 */

'use strict';
$(document).ready(function() {
    $('#database').popover({
        content: 'Database names must begin with a letter or underscore, and can contain only letters, numbers, underscores and dots.',
    });

    $('.deleteButton').tooltip({
        title: 'Warning! Are you sure you want to delete this database? All collenctions and documents will be deleted.',
    });

    $('.deleteButton').on('click', function(event) {

        $('.deleteButton').tooltip('hide');

        event.preventDefault();

        var target = $(this);
        var parentForm = $('#' + target.attr('childof'));

        $('#confirmation-input').attr('shouldbe', target.attr('database-name'));
        $('#modal-database-name').text(target.attr('database-name'));
        $('#confirm-deletion').modal({ backdrop: 'static', keyboard: false })
            .one('shown.bs.modal', function() {
                $('#confirmation-input').focus();
            })
            .one('click', '#delete', function() {
                var input = $('#confirmation-input');
                if (input.val().toLowerCase() === input.attr('shouldbe').toLowerCase()) {
                    parentForm.trigger('submit');
                }
            });
    });


    $("#btn_conn").on('click',function(){

        $.each($('.input-group'),function(){
            $(this).removeClass('has-error');
        });
        var hname = $('#hname').val();
        var addr = $('#addr').val();
        if(hname === '' || hname === null){
            $('#hgroup').addClass('has-error');return;
        }
        if(addr === '' || addr === null){
            $('#addrgroup').addClass('has-error');return;
        }

        $.each($('.input-group'),function(){
            $(this).removeClass('has-error');
        });

        var ladda = Ladda.create(document.querySelector('#btn_conn'));

        $.ajax({
            type:'post',
            url:'/connect',
            data:{name:hname,addr:addr},
            beforeSend:function(){
                ladda.start();
            },
            complete:function(){
                ladda.stop();
            },
            success:function(result){
                console.log(JSON.stringify(result));
                if(result.success) {
                    initComponent(result.result);
                    $("#connModal").modal("hide");
                }else{
                    $("#conn_alert strong").text(result.msg);
                    $("#conn_alert").show();
                }

            },
            error:function(err){
                console.log("request take error: "+ err);
            }});
    });


    init();
    //刷新页面
    var data = $.parseJSON($("#infos").val());
    if(data && data !== ''){
        // $.parseJSON('{{ infos|json_encode }}'.replace(/&quot;/g,'"'));
        sort(data).forEach(function(item){
            initComponent(item);
        });
    }
});

function init() {
    $('#tabs').addtabs({monitor:'.topbar',close:true});
}

function sort(arr){
    for(var i=0;i<arr.length;i++)
    {
        for(var j =i+1;j<arr.length;j++){
            if(arr[i].sort > arr[j].sort){
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

function initComponent(data){
    //初始化树
    initTree(data);
    //初始化右键菜单
    initMenus();

    $('body').mousedown(function(event, a){
        if(event.which == 1 || a == 'left'){
            $('#smartMenu_table').hide();
        }
        if(event.which == 3 || a == 'right'){
            $('#smartMenu_table').hide();
        }
    });
}

function initTree(data) {
    var dbs = data.databases;//$.parseJSON('{{ databases|json_encode }}'.replace(/&quot;/g,'"'));
    var colls = data.colls;// $.parseJSON('{{ collections|json_encode }}'.replace(/&quot;/g,'"'));
    if(!dbs || !colls || dbs === '' || colls === '') return;

    var hostsnode = {
        text: data.name,
        icon: 'tree_host',
        selectable:false,
        nodes: [],
        attrs:[{menu:'hostmenu'},{ id:data.id }]
    };

    $.each(dbs,function(index,item){

        var id = data.id ;
        var dbnode = {
            text:item,
            icon: 'tree_db',
            selectable:false,
            attrs:[{ menu:'dbmenu', hid: id,hname:data.name }],
            tags:['db']
        };

        var colnode = {
            text: "集合",
            icon: 'tree_coll',
            selectable:false,
            nodes: [],
            attrs:[{menu:'collmenu', hid: id, db:item,hname:data.name }]
        };

        $.each(colls[item],function(index,child){
            var node = {
                text:child,
                icon: 'tree_tbl',
                selectable:false,
                attrs:[{menu:'tblmenu',hid: id, db:item,table:child,hname:data.name }],
                tags:['table']
            };
            colnode.nodes.push(node);
        });
        dbnode.nodes = [colnode];
        hostsnode.nodes.push(dbnode);
    });
    hostsnode.text = hostsnode.text + ' ['+hostsnode.nodes.length+']';
    //$("div.left").append("<div id='tree_"+ data.id + "'></div>");
    $("#ul_tree").append("<li><div id='tree_"+ data.id + "'></div></li>");
    $('#tree_'+ data.id).treeview({ data:[hostsnode], afterRender: function (){ initMenus(); },showIcon:true});
}

/************************************************************************************/
/*******************************    右键菜单     ************************************/
/************************************************************************************/
var hostmenus = [
    [
        {
            text: "创建数据库",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        },
        {
            text: "刷新",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        }
    ]
];

/************ ======================================== ************/
/************                 DB右键菜单             ************/
/************ ======================================== ************/
var dbmenus = [
    [
        {
            text: "删除数据库",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        },
        {
            text: "刷新",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        }
    ]
];
/************ ======================================== ************/
/************                 集合右键菜单             ************/
/************ ======================================== ************/
var collsmenus = [
    [
        {
            text: "创建集合",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        },
        {
            text: "刷新",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        }
    ]
];
/************ ======================================== ************/
/************                  表右键菜单              ************/
/************ ======================================== ************/
var tabmenus = [
    [
        {
            text: "查看",
            func: function() {
                var host = {
                    name:$(this).attr("hname"),
                    guid:guid(),
                    id:$(this).attr("hid"),
                    db:$(this).attr("db"),
                    table:$(this).attr("table")
                };
                host.url = 'host/'+ host.id +'/db/'+ host.db +'/table/'+ host.table;
                Addtabs.add({
                    id: host.guid,
                    title: $(this).attr('table'),
                    content: $.table.template(host),
                    url: '',
                    ajax:'',
                    close:true
                });

                $.table.init();
            }
        }
    ],
    [
        {
            text: "添加文档",
            func: function() {
                $(this).css("padding", "10px");
            }
        },
        {
            text: "更新文档",
            func: function() {
                $(this).css("background-color", "#beceeb");
            }
        },
        {
            text: "删除文档",
            func: function() {
                $(this).css("background-color", "#beceeb");
            }
        },
        {
            text: "删除所有文档",
            func: function() {
                $(this).css("background-color", "#beceeb");
            }
        }
    ],
    [{
        text: "重命名",
        func: function() {
            var src = $(this).attr("src");
            window.open(src.replace("/s512", ""));
        }
    },
        {
            text: "复制集合",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        },
        {
            text: "删除集合",
            func: function() {
                var src = $(this).attr("src");
                window.open(src.replace("/s512", ""));
            }
        }
    ]
];

function initMenus(){
    //$.smartMenu.init('[menu=hostmenu]','[menu=dbmenu]','[menu=collmenu]','[menu=tblmenu]');
    $('[menu=hostmenu]').smartMenu(hostmenus, {
        name: "host"
    });
    $('[menu=dbmenu]').smartMenu(dbmenus, {
        name: "db"
    });
    $('[menu=collmenu]').smartMenu(collsmenus, {
        name: "colls"
    });
    $('[menu=tblmenu]').smartMenu(tabmenus, {
        name: "tbl"  /* 此处有一个bug: name 的值不能为table */
    });
}

function guid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).replace(/-/g,'');
}
