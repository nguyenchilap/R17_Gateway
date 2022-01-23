$(document).ready(function(){
    const inputUserName = $('input[name="username"]');
    const inputPassword = $('input[name="password"]');
    const inputConfirmPassword = $('input[name="confirm-password"]');
    const inputEmail = $('input[name="email"]');
    const inputUserType = $('.user-type');
    const inputFullName = $('input[name="full-name"]');
    const inputDay = $('input[name="day"]');
    const inputMonth = $('input[name="month"]');
    const inputYear = $('input[name="year"]');
    const inputPhone = $('input[name="phone"]');
    const inputAddress = $('input[name="address"]');
    const inputImage = $('input[name="img"]');

    const inputGender = $('.user-gender');
    const inputProvince = $('.user-province');
    const inputDistrict = $('.user-district');
    const inputWard = $('.user-ward');


    const btnNext1 = $('.btn-next-1');
    const btnNext2 = $('.btn-next-2');
    const btnNext3 = $('.btn-next-3');
    const btnPrev2 = $('.btn-prev-2');
    const btnPrev3 = $('.btn-prev-3');

    const btnOtp = $('.btn-modal-otp');
    const btnNoti = $('.btn-modal-noti');

    const modalNoti = $('.modal-noti');

    class modalHandler {
      showModalNoti = (notiTitle ,notiMessage) => {
          $('.modal-noti').find('.modal-title').html(notiTitle);
          $('.modal-noti').find('.modal-body').html(notiMessage);
          $('.btn-modal-noti').click();
      }
    };
    
    //LOAD VIETNAM CITY DATA
    class loadAddress {
      constructor(dataInput){
          this.data = dataInput;
      }
    
      loadProvincesName(){
        return this.data.map(item => item.name);
      }
    
      loadDistrictsName(provinceName){
        return this.data.find(item => item.name === provinceName).districts.map(item => item.name);
      }
    
      loadWardsName(provinceName, districtName){
        return this.data.find(item => item.name === provinceName).districts.find(item => item.name === districtName).wards.map(item => item.name);            
      }
    
    }
    
    $.getJSON('/vietnam-address.json',function(data){
        const address = new loadAddress(data);
        const provinceNames = address.loadProvincesName();

        //load all name provinces
        provinceNames.forEach(name => {
          inputProvince.append(`<option>${name}</option>`);
        });

        //load name districts
        inputProvince.change(function(){
          inputDistrict.html('');
          if (this.value === 'Tỉnh') inputDistrict.html('');
          else {
            address.loadDistrictsName(this.value).forEach(name => {
              inputDistrict.append(`<option>${name}</option>`);
            });
          }
        });

        inputDistrict.change(function(){
          inputWard.html('');
          if (this.value === 'Quận/Huyện/Thành phố') inputWard.html('');
          else {
            address.loadWardsName(inputProvince.val(), this.value).forEach(name => {
              inputWard.append(`<option>${name}</option>`);
            })
          }
        })
    });

    //check password
    inputPassword.change(function(){
        const password = $(this).val();
        const minLength = Number($(this).attr('minlength'));
        const maxLength = Number($(this).attr('maxlength'));
        if (password.length < minLength || password.length > maxLength) $('.noti-length-password').css('display','block');
        else $('.noti-length-password').css('display','none');
    })

    //check username
    inputUserName.change(function(){
        const username = $(this).val();
        const minLength = Number($(this).attr('minlength'));
        const maxLength = Number($(this).attr('maxlength'));

        if (username.length < minLength || username.length > maxLength) $('.noti-length-username').css('display','block');
        else $('.noti-length-username').css('display','none');

        const url = `https://localhost:44366/api/userinfo/check-exists/${username}`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
        })
        .then(res => res.json())
        .then(user => {
            if (user.userId){
                $('.noti-exist-username').css('display','block');
            }
            else $('.noti-exist-username').css('display','none');
        })
        .catch((e) => console.log('fail to fetch!!! Error:' + e))
    })

    
    const modalHandle = new modalHandler();
    //FIRST STEP
    btnNext1.click(function(){
        if (!inputUserName.val() || !inputPassword.val() || !inputConfirmPassword.val() || !inputEmail.val() || !inputUserType.find(':selected').attr('value')){
            modalHandle.showModalNoti('THÔNG TIN KHÔNG HỢP LỆ', 'Vui lòng điền đầy đủ thông tin !!!!');
        }
        else if (inputConfirmPassword.val() != inputPassword.val()){
            modalHandle.showModalNoti('THÔNG TIN KHÔNG HỢP LỆ', 'Xác nhận mật khẩu không khớp !!!!');
        }
        else if (!inputEmail.val().includes('@')){
            modalHandle.showModalNoti('THÔNG TIN KHÔNG HỢP LỆ', 'Địa chỉ Email không hợp lệ !!!!');
        }
        else{
            btnOtp.click();

            $('.btn-re-send-otp').click(function(){
                $('.noti-sent-otp').css('display', 'block');
                $('.noti-warning-otp').css('display', 'none');
            })
            $.post('/register/send-otp', {
                email : inputEmail.val()
            }, function(res){
                $('.btn-confirm-otp').click(function(){
                    if (res.otp != $('input[name="otp"]').val()){
                      $('.noti-warning-otp').css('display', 'block');
                      $('.noti-sent-otp').css('display', 'none');
                    }
                    else{
                      $('.btn-close-modal-otp').click();
                      $('.register-form__info').css('display','block');
                      $('.register-form__account').css('display','none');
                    }
                })
            })
        }
    });

    //SECOND STEP
    btnPrev2.click(function(){
        $('.register-form__info').css('display','none');
        $('.register-form__account').css('display','block');
    });
    
    btnNext2.click(function(){
        if (!inputFullName.val() || !inputDay.val() || !inputMonth.val() || !inputYear.val() || !inputPhone.val() || !inputProvince.val() ||
            inputProvince.val() === 'Province' || !inputDistrict.val() || !inputDistrict.val() === 'District' || !inputWard.val() || 
            !inputWard.val() === 'Ward' || !inputAddress.val()){
            modalHandler.showModalNoti('THÔNG TIN KHÔNG HỢP LỆ', 'Vui lòng điền đầy đủ thông tin !!!!');
        }
        else {
            $('.register-form__info').css('display','none');
            $('.register-form__avatar').css('display','block');
        }
    })

    //THIRD STEP
    
    btnPrev3.click(function(){
        $('.register-form__avatar').css('display','none');
        $('.register-form__info').css('display','block');
    });

    $('.avatar-input').click(function(){
        inputImage.click();
    });

    inputImage.change(function(e){
        $('.avatar-default').css('background-image',`url('${URL.createObjectURL(e.target.files[0])}')`);
        btnNext3.html('DONE');
    })

    btnNext3.click(function(e){
      e.preventDefault();
      let imgUrl = '/img/default-avatar.jpg';
      if (inputImage.val()){
        imgUrl = `/img/user-avatars/${inputUserName.val()}/${inputImage.val().split(`\\`).pop()}`;
      }
      const url = `https://localhost:44366/api/account/register/${inputUserType.find(':selected').attr('value')}`;
      fetch(url, {
          method: 'POST',
          body: JSON.stringify({
              UserName : inputFullName.val(),
              UserBirth : new Date(`${inputMonth.val()}/${inputDay.val()}/${inputYear.val()}`).toISOString(),
              UserGender : Number(inputGender.val()),
              UserPhone : inputPhone.val(),
              UserEmail : inputEmail.val(),
              UserAddress : `${inputAddress.val()}, ${inputWard.val()}, ${inputDistrict.val()}, ${inputProvince.val()}`,
              UserArea : 0,
              UserLoginName : inputUserName.val(),
              UserPassword: inputPassword.val(),
              UserImg: imgUrl
          }),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
      })
      .then(res => {return res.json})
      .then(userId => {
          if(userId){
            if(inputImage.val()){
                $('input[name="url"]').val(`/img/user-avatars/${inputUserName.val()}`);
                $('.register-form__avatar').submit();
            }
            else window.location.href = '/login';
          }
      })
      .catch(exc => {
          modalNoti.find('.modal-title').html('Register failed');
          modalNoti.find('.modal-body').html('Error : ' + exc);
          btnNoti.click();
      })
    })
    
})