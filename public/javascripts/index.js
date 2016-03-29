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

    //刷新页面
    var data = $.parseJSON($("#infos").val());
    if(data && data !== ''){
        // $.parseJSON('{{ infos|json_encode }}'.replace(/&quot;/g,'"'));

        sort(data).forEach(function(item){
            initComponent(item);
        });
    }
});

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

//Array.prototype.sortby = function(attr){
//    if(!this || this.length === 0) return [];
//
//    this.forEach(function(item){
//        for(var x in item){
//            if(x === attr){
//
//            }
//        }
//    })
//
//}
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
        selectable:false,
        nodes: [],
        attrs:[{menu:'hostmenu'},{id:data.id}]};

    $.each(dbs,function(index,item){

        var id = data.id + '_' + item ;
        var dbnode = {
            text:item,
            selectable:false,
            attrs:[{menu:'dbmenu', hid: id}],
            tags:['db']
        };

        var colnode = {
            text: "集合",
            selectable:false,
            nodes: [],
            attrs:[{menu:'collmenu', hid: id, db:item }]};

        $.each(colls[item],function(index,child){
            var node = {
                text:child,
                selectable:false,
                attrs:[{menu:'tblmenu',hid: id, db:item,table:child }],
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
    $('#tree_'+ data.id).treeview({ data:[hostsnode], afterRender: function (){ initMenus(); }});
}

function initMenus(){
    $.smartMenu.init('[menu=hostmenu]','[menu=dbmenu]','[menu=collmenu]','[menu=tblmenu]');
}
