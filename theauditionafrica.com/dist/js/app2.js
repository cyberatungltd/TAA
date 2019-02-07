// const rootUrl = 'http://localhost:8000/';
const rootUrl  = 'http://www.theauditionafrica.com/';
const verifyMessage =  'Please enter the verification code sent to your number'
const phoneMessage = 'Please enter your phone number'
$(document).ready(function() {
  
});

document.getElementById("vid_detail").addEventListener('timeupdate', function(e) {
  if(this.currentTime >= 2) {
    if(document.getElementById("skip_btn")) {
      document.getElementById("skip_btn").style.display = "block";
    }
  }
});

document.getElementById("vid_detail").addEventListener('play', function(e) {
  console.log('playing video')
});

function playAudition(video) {
 if (video.url) {
    const videoPlayer = document.getElementById('vid_detail')
    videoPlayer.src = video.url;
    videoPlayer.play()
    $('#vid_detail').removeAttr('onended')
    $('#skip_btn').remove()
 }
}

function offOverLay() {
  document.getElementById("overlay-loader").style.display = "none";
}

$("#regForm").submit(function(){
  event.preventDefault()

  $('#submitRegBtn').attr('disabled', true);
  $('#submitRegBtn').text('Please wait ...');
  if($('#country_id').val() === "") {
    $('#submitRegBtn').attr('disabled', false);
    $('#submitRegBtn').text('Submit');
    $('#regErrorWrap').empty().append('<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>Please select your country</p></div>');
    $('html, body').animate({scrollTop: '0px'}, 300);
    return;
  }
  if(!$('#check1').is(':checked')) {
    $('#submitRegBtn').attr('disabled', false);
    $('#submitRegBtn').text('Submit');
    $('#regErrorWrap').empty().append('<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>Please read and accept the terms and conditions</p></div>');
    $('html, body').animate({scrollTop: '0px'}, 300);
    return;
  }
  var formData = new FormData($("#regForm")[0]);
  if ($('#profileImg')[0].files[0]){
    formData.append('image', $('#profileImg')[0].files[0], $('#profileImg')[0].files[0].name);
  }
  formData.append('_method', 'POST')
  $.ajax({
    url: `/api/auth/register`,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
    },
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(data, statusText, xhr){
      if (xhr.status === 201) {
        window.location.href = `verify/user`;
      } else {
        $('#submitRegBtn').attr('disabled', false);
        $('#submitRegBtn').text('Submit');
        $('#regErrorWrap').empty().append('<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>Something went wrong, please try again</p></div>');
      }
    },
    error: function(errorThrown) {
      $('#submitRegBtn').attr('disabled', false);
      $('#submitRegBtn').text('Submit');
      if(errorThrown && errorThrown.responseText) {
        const error = JSON.parse(errorThrown.responseText)
        let result = []
        Object.keys(error).map(function(key) {
          result.push({key, message:  error[key] })
        });
        let  errorList = []
        if (result[0].message === 'An error occurred' || result[0].message === "Sorry, an error occurred") {
          $('#regErrorWrap').empty().append('<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>Something went wrong, please try again</p></div>');
          $('html, body').animate({scrollTop: '0px'}, 300);
          return;
        }
        if (result.length > 0) {
          Object.keys(result[0].message).map(function(key) {
            errorList.push({key, message:  result[0].message[key][0] })
          });
        }

        if(errorList.length > 0) {
          let messageList = '';
          errorList.forEach(err => { 
            messageList += `<li>${err.message}</li>`
          })
          $('#regErrorWrap').empty().append(`<div data-abide-error class="alert callout"><p><ul>${messageList}</ul></p></div>`);
          $('html, body').animate({scrollTop: '0px'}, 300);
          return;
        }
        $('#regErrorWrap').empty().append('<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>Something went wrong, please try again</p></div>');
      }
     
   }
  })
});

$('#resendBtn').click(function() {
  $('#regErrorWrap').empty()
  if($('#phone').val().length < 1) {
    $('#regErrorWrap').empty().append(`<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>Please enter your phone number</p></div>`);
    return;
  }
  event.preventDefault()
  $('#submitVerifyBtn').attr('disabled', true);
  $('#submitVerifyBtn').text('Please wait ...');
  $('#resendBtn').attr('disabled', true);
  $('#resendBtn').text('Please wait ...');
  var formData = new FormData($("#verifyForm")[0]);
  formData.append('_method', 'POST')
  $.ajax({
    url: `/api/auth/sendVerificationCode`,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
    },
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(data, statusText, xhr){
      if (xhr.status === 200) {
        document.getElementById('phone').style.display = 'none'
        document.getElementById('resendBtn').style.display = 'none'
        document.getElementById('code').style.display = 'inherit';
        document.getElementById('submitVerifyBtn').style.display = 'inherit';
        $('#submitVerifyBtn').attr('disabled', false);
        $('#submitVerifyBtn').text('Verify');
        $('#resendBtn').attr('disabled', false);
        $('#resendBtn').text('Resend Code');
        $('#showMessage').text(verifyMessage);
        event.stopPropagation();
      } else {
        $('#submitVerifyBtn').attr('disabled', false);
        $('#submitVerifyBtn').text('Verify');
        $('#resendBtn').attr('disabled', false);
        $('#resendBtn').text('Resend Code');
        $('#regErrorWrap').empty().append(`<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>${data.message}</p></div>`);
      }
    },
    error: function(errorThrown) {
      if (errorThrown && errorThrown.responseText) {
        const errMessage = JSON.parse(errorThrown.responseText)
        $('#regErrorWrap').empty().append(`<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>${errMessage.message}</p></div>`);
        $('#submitVerifyBtn').attr('disabled', false);
        $('#submitVerifyBtn').text('Verify');
        $('#resendBtn').attr('disabled', false);
        $('#resendBtn').text('Resend Code');
        return;
      }
      $('#submitVerifyBtn').attr('disabled', false);
      $('#submitVerifyBtn').text('Verify');
      $('#resendBtn').attr('disabled', false);
      $('#resendBtn').text('Resend Code');
      $('#regErrorWrap').empty().append('<div data-abide-error class="alert callout"><p><i class="fa fa-exclamation-triangle"></i>Something went wrong, please try again</p></div>');
    }
  })
});
$('#submitVerifyBtn').submit(function() {
  event.stopPropagation();
})

function reSendCode() {
  document.getElementById('code').style.display = 'none';
  document.getElementById('submitVerifyBtn').style.display = 'none';
  document.getElementById('phone').style.display = 'inherit'
  document.getElementById('resendBtn').style.display = 'inherit'
  $('#showMessage').text(phoneMessage);
}


function getToken() {
  if (getCookie('user_access_token') === "") {
    window.location.href = rootUrl;
  }
  return getCookie('user_access_token');
}

function getCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieValues = decodedCookie.split(';');
  for(let i = 0; i < cookieValues.length; i++) {
      let cookie = cookieValues[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
          return cookie.substring(name.length, cookie.length);
      }
  }
  return "";
}
