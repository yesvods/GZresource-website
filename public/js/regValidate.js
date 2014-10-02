/*
    For the reg effect
   */
    $('#VIPReg>header li:first-child').toggleClass("regToggle");
    $('#VIPReg>form:last-child').toggle();
    $('#VIPReg>header li').click(function(){
      $('#VIPReg>form li i').text("");
      if(!$(this).hasClass("regToggle")){
        $('#VIPReg>form').toggle();
        $('#VIPReg>header li').toggleClass("regToggle");
      }
    });
    /*
      For the reg validate
    */
    $('#VIPReg li div').click(function(){
      var $msg = $('<span style="color:red;font-size:12px;"><span>');
      var validate = true;
      var _this = this;
      /*
        Not Empty validate
      */
      $(this).closest("form").find(".forceFill").next("input").each(function(){        
        if(this.value==""){
          $(this).next("i").text("不能为空");
          validate = false;
        }
        if(!this.value==""){
          $(this).next("i").text("");
        }
        <!-- console.log(this.value); -->
      });
      /*
        PASSWORD,USERNAME validate
      */
      var $username = $(this).closest("form").find("[name='userName']");
      if($username[0].value.length<6){
        $username.next("i").text("不能少于6位");
        validate = false;
      }
      var $password = $(this).closest("form").find("[name='password']");
      if($password[0].value.length<6){
        $password.next("i").text("不能少于6位");
        validate = false;
      }
      var $email = $(this).closest("form").find("[name='email']");
      if(!/.+@.+\..+/.test($email[0].value)){
        $email.next("i").text("格式错误");
        validate = false;
      }
      var $phone = $(this).closest("form").find("[name='phone']");
      if(!/\d+/.test($phone[0].value)){
        $phone.next("i").text("必须为数字");
        validate = false;
      }
      if(validate){
        $.ajax({
            cache: true,
            type: "POST",
            url:window.location.href,
            data:$(this).closest("form").serialize(),// 你的formid
            async: false,
            error: function(request) {
              $msg.text("注册失败，请重试！");
              $(_this).after($msg);
            },
            success: function(data) {
              data = JSON.parse(data);
              if(data.err){
                $msg.text(data.err);
                $(_this).after($msg);
              }
              else{
                $msg.text("注册成功，3秒后跳转首页..");
                $(_this).after($msg);
                _.delay(function(){window.location.replace("/")},3000);
              }
            }
        });
      }
    });