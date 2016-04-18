/**
 * 封装显示查询详情table的基本功能
 * 此功能是将 bootstrap.table 封装为一个标准模板
 * Created by JL on 2016/4/15.
 */

(function($) {
    var $table = {};
    var $remove = {};
    var selections = [];
    var _host = {};

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

        });
        $table.on('all.bs.table', function (e, name, args) {
            console.log(name, args);
        });
        $remove.click(function () {
            var ids = getIdSelections();
            $table.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
            $remove.prop('disabled', true);
        });
//    $(window).resize(function () {
//      $table.bootstrapTable('resetView', {
//        height: getHeight()
//      });
//    });
    }

    function getTemplate(host) {
        _host = host;
        var id = host.guid;
        return ['<div id="toolbar_'+ id +'">',
            '<button id="remove_'+ id +'" class="btn btn-sm btn-danger" disabled>',
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
            //' data-show-toggle="true"',
            //' data-show-columns="true"',
            //' data-show-export="true"',
            ' data-detail-view="true"',
            //' data-detail-formatter="detailFormatter"',
            ' data-minimum-count-columns="2"',
            //' data-show-pagination-switch="true"',
            ' data-pagination="true"',
            ' data-id-field="id"',
            ' data-page-list="[5,10, 25, 50, 100, ALL]"',
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
            return row.id
        });
    }

    function detailFormatter(index, row) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return html.join('');
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
})(jQuery);