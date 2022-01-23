$(document).ready(function(){
    const userId = $('#user-identify').attr('userId');

    const inputProvince = $('.user-province');
    const inputDistrict = $('.user-district');
    const inputWard = $('.user-ward');

    const inputImage = $('input[name="img"]');
    const inputAddress = $('input[name="address"]');
    const inputDay = $('input[name="day"]');
    const inputMonth = $('input[name="month"]');
    const inputYear = $('input[name="year"]');

    //LOAD INFORMATION
    loadUserInfo = () => {
        const url = `http://localhost:8080/api/v1/userinfo/${userId}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(user => {
            console.log(user);
            $('input[name="full-name"]').val(user.userName);
            $('input[name="email"]').val(user.useremail);
            $('input[name="phone"]').val(user.userPhone);
            $('input[name="address"]').attr('value',user.userAddress);
            loadCurrentAddress();

            const d = new Date(user.userBirth);
            inputDay.val(d.getDate());
            inputMonth.val(d.getMonth() + 1);
            inputYear.val(d.getFullYear());

            $('.avatar-default').css('background-image', `url('${user.userImg}')`);
        })
        .catch(e => alert('Kết nối thất bại !!! Lỗi :' + e));
    }

    loadUserInfo();

    //SHOW MODAL
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
            inputProvince.append(`<option value="${name}">${name}</option>`);
        });

        //load name districts
        inputProvince.change(function(){
            inputDistrict.html('');
            if (this.value === 'Province') inputDistrict.html('');
            else {
                address.loadDistrictsName(this.value).forEach(name => {
                    inputDistrict.append(`<option value="${name}">${name}</option>`);
                });
            }
        });

        inputDistrict.change(function(){
            inputWard.html('');
            if (this.value === 'District') inputWard.html('');
            else {
                address.loadWardsName(inputProvince.val(), this.value).forEach(name => {
                    inputWard.append(`<option value="${name}">${name}</option>`);
                })
            }
        });

        loadCurrentAddress();
    });

    //LOAD CURRENT ADDRESS
    loadCurrentAddress = () => {
        const userAddress = $('input[name="address"]').attr('value');
        const arrayAddress = userAddress.split(', ');
        if (arrayAddress.length) {
            $(`.user-province option[value="${arrayAddress[3]}"]`).attr('selected',true);
            inputProvince.change();
            $(`.user-district option[value="${arrayAddress[2]}"]`).attr('selected',true);
            inputDistrict.change();
            $(`.user-ward option[value="${arrayAddress[1]}"]`).attr('selected', true);
            $('input[name="address"]').val(arrayAddress[0]);
        }
    }

    //EDIT INFORMATION
    changeInformation = () => {
        const url = `http://localhost:8080/api/v1/userinfo/${userId}/change-infor`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                name: $('input[name="full-name"]').val(),
                phone: $('input[name="phone"]').val(),
                email: $('input[name="email"]').val(),
                gender: Number($('.user-gender').val()),
                address: `${inputAddress.val()}, ${inputWard.val()}, ${inputDistrict.val()}, ${inputProvince.val()}`,
                birth: `${inputDay.val()}/${inputMonth.val()}/${inputYear.val()}`
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(user => {
            return user;
        })
        .catch(e => alert('Kết nối thất bại !!! Lỗi :' + e))
    }

    $('.btn-edit-infor').click(function(){
        const modal = new modalHandler();
        modal.showModalNoti('XÁC NHẬN CHỈNH SỬA THÔNG TIN', 'Tiếp tục chỉnh sửa những thông tin này ?');
        $('.btn-confirm-modal-noti').click(async function(){
            const checkChangeInfor = await changeInformation();
            if (checkChangeInfor) {
                modal.showModalNoti('CHỈNH SỬA THÔNG TIN','Chỉnh sửa thông tin thành công !!!');
                window.location.reload();
            }
            else modal.showModalNoti('CHỈNH SỬA THÔNG TIN','Chỉnh sửa thông tin thất bại !!');
        });
    })

    //EDIT AVATAR
    changeAvatar = () => {
        const url = `http://localhost:8080/api/v1/userinfo/${userId}/change-avatar`;
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                img: `/img/user-avatars/${$('#user-identify').attr('username')}/${$('input[name="img"]').val().split(`\\`).pop()}`,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json())
        .then(user => {
            return user
        })
        .catch(e => alert('Kết nối thất bại !!! Lỗi :' + e));
    }

    //SHOW IMAGE
    $('.avatar-input').click(function(){
        inputImage.click();
    });

    inputImage.change(function(e){
        $('.avatar-default').css('background-image',`url('${URL.createObjectURL(e.target.files[0])}')`);
        $('.btn-edit-ava').removeClass('disabled');
    })

    $('.btn-edit-ava').click(function(){
        const modal = new modalHandler();
        modal.showModalNoti('XÁC NHẬN ĐỔI ẢNH ĐẠI DIỆN', 'Tiếp tục đổi ảnh đại diện ?');
        $('.btn-confirm-modal-noti').click(async function(){
            const checkChangeAvatar = await changeAvatar();
            if (checkChangeAvatar) {
                $('input[name="url"]').val(`/img/user-avatars/${$('#user-identify').attr('username')}`);
                $('.edit-avatar').submit();
            }
            else modal.showModalNoti('CHỈNH SỬA THÔNG TIN','Chỉnh sửa thông tin thất bại !!');
        });
    })
})