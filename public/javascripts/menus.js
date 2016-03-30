
(function($) {

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

                  $.ajax({
                      url:'host/'+$(this).attr("hid")+'/db/'+$(this).attr("db")+'/table/'+$(this).attr("table"),
                      type:'get',
                      success:function(data){
                         console.log(data.data);


                      },
                      error:function(err){
                         console.log(err.responseText);
                      }
                  });
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

  $.extend($.smartMenu, {
      init:function(host,db,colls,table){
         $(host).smartMenu(hostmenus, {
            name: "host"    
         });
         $(db).smartMenu(dbmenus, {
            name: "db"    
         });
         $(colls).smartMenu(collsmenus, {
            name: "colls"    
         });
         $(table).smartMenu(tabmenus, {
            name: "tbl"  /* 此处有一个bug: name 的值不能为table */
         });
      }
   });

})(jQuery);