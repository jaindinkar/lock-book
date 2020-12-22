// Use fetch APi for Form submit button. (Save Key feature.)


document.addEventListener('DOMContentLoaded', function() {

    // Selecting button elements to attach event listeners.
    regenerate_button = document.querySelector('.regenerate-button')
    save_button = document.querySelector('.save-button')
    copy_button = document.querySelector('.copy-icon')
    save_form = document.querySelector('#saveform')

    // Event listener for copy button
    copy_button.addEventListener('click', copyPass);

    // Event listener for regenerate button.
    regenerate_button.addEventListener('click', regeneratePass);

    // Save buttun has no event listener right now, it triggers a bootstrap modal
    // which has its own event trigger.
    save_button.addEventListener('click', savePass);

    // Event listener for form submit action.
    save_form.addEventListener('submit', postFormData, false);


    // Modal trigged when save button is clicked.
//     This JQuery code is courtesy of getbootstrap.com
//     $('#saveButtonModal').on('show.bs.modal', function (event) {
//         var modal = $(this)
//         console.log("modal function executed.")
// 
//         var passText = document.querySelector(".password-text").textContent
// 
//         if (sessionStorage.status == 1) {
//             modal.find('.modal-body .passwd-input').val(passText)
//             console.log("modal found the session status variable")
//         }
//         else {
//             modal.find('.modal-title').text('Access Denied')
//             modal.find('.modal-body').text('Login to access Save feature')
//             modal.find('.modal-footer input').remove()
//             modal.find('.modal-footer button').text('Close')
//             console.log("modal did not found the session status variable")
//         }
//     })

})



function copyPass(event){
    // Surety check!
    // console.log('Executed: Copy button clicked.');
    var passText = event.target.previousSibling.previousElementSibling.textContent;
    // console.log('Retreived Pass:', passText);
    copyTextToClipboard(passText);
}

function regeneratePass(event){
    // Surety check!
    // console.log('Executed: Re-Generate button clicked.');

    var passTextBox = document.querySelector(".password-text");
    // console.log(`Retreived Pass: ${passTextBox.textContent}`);

    fetch('/pass')
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        // console.log(data.pass);
        passTextBox.textContent = "";
        passTextBox.textContent = `${data.pass}`

    })
    .catch(error => {
            // If error is returned.
            ////// 1. Log the error on console.
            console.log('Error! couldn\'t fetch form server.', error);
    })
}



function savePass(event){
    // Surety check!
    // console.log('Executed: Save button clicked.');
    
    // User is authenticated.
    if (sessionStorage.status == 1) {
        // Surety check.
        // console.log("Modal found the session status variable : User is authenticated")
        // Grab password text.
        var passText = document.querySelector(".password-text").textContent
        // Grab modal password input box
        var modelPasswdTextBox = document.querySelector(".passwd-input")
        // Jquery line here. Append password text to modal's password input box. (Method-I)
        // $(".passwd-input").val(passText)
        // vanilla-Javascript line here. Append password text to modal's password input box. (Method-II)
        modelPasswdTextBox.value = passText
        // Trigger the save key model. Jquery line here.
        $('#saveButtonModal').modal()
    }
    // User is not authenticated.
    else {
        // Surety check.
        // console.log("Modal did not found the session status variable : User is not authenticated")
        // Trigger the access denied model. Jquery line here.
        $('#saveAccessDeniedModal').modal()
    }
}



// save_form.addEventListener('submit', postFormData);
// 
// form.addEventListener('submit', function(event) {
//         if (form.checkValidity() === false) {
//           event.preventDefault();
//           event.stopPropagation();
//         }
//         form.classList.add('was-validated');
//       }, false);



// Handling form events.
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
function postFormData(event){
    //Surety check!
    // console.log("Form post button clicked.")

    // Fetch API to send the data insted of form.
    // Your code here.

    // Validity check and bootstrap form-control class addition/deletion
    // Your code here.
    // Bootstrap validation https://getbootstrap.com/docs/4.5/components/forms/?#custom-styles

    // site-addr and passwd is strictly required.
    if (event.target.checkValidity() === false) {
        console.log("Form validity checked.")
        event.preventDefault();
        event.stopPropagation();
    }

    event.target.classList.add('was-validated');

    // Retrieve form contents
    var site_addr = document.querySelector('.form-control#site-addr').value
    var email = document.querySelector('.form-control#email').value
    var username = document.querySelector('.form-control#username').value
    var password = document.querySelector('.form-control#passwd').value
    // var comments = document.querySelector('.form-control#comments').value

    // var comments = ""

    console.log("Form capture parameters")
    console.log(`site_addr: ${site_addr}`)
    console.log(`email: ${email}`)
    console.log(`username: ${username}`)
    console.log(`password: ${password}`)
    // console.log(`comments: ${comments}`)

    // Block form submission if site-addr and password are not provided.
    if(site_addr == ''){
        return;
    }

    if(password == ''){
        return;
    }

    //------------- Steps for POSTing the content on server -------------
        
    // 1. Get the csrf token for the request
    const csrftoken = getCookie('csrftoken');

    // 2. Preparing HTTP header object and apending important HTTP header info with it.
    ////// ---> Info. Link : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const requestHeaders = new Headers();
    requestHeaders.append('X-CSRFToken', csrftoken);

    // 3. Creating Request Object for fetch call. Headers go in there.
    const request = new Request('/save', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
            "site_addr": site_addr,
            "email": email,
            "username": username,
            "password": password,
            // "comments": comments
        })
    });

    // 4. Make a request using Fetch API with request object.
    fetch(request)
    // 5. Converting the response from server to a JSON object.
    .then(response => response.json())
    // 6. Acting on the result (JSON object). Product of above conversion.
    .then(result => {

        // Value check! --> Printing the result on console.
        console.log(result);

        // Desired response from server for successfull submission.
        if(result['message'] == "Update successful."){
            
            // If successfull submission.

            ////// 1. Log the status on console.
            console.log('Password successfully updated on server.');

            ////// 2. Destroy current model
            $('#saveButtonModal').modal('hide')
            // OR
            // $('#saveButtonModal').modal('dispose')

            ////// 3. Reset the form inside model and remove validation marker.
            event.target.classList.remove('was-validated');
            event.target.reset();
            
            ////// 4. Show Update successful model
            $('#updateSuccessModal').modal()
        }

        else {

            // If error is returned.
            ////// 1. Log the error on console.
            console.log(result['error']);

            ////// 2. Destroy current model
            $('#saveButtonModal').modal('hide')

            ////// 3. Show Update Failed model
            $('#updateFailedModal').modal()

        }
    })

    // 7. Acting on any errors generated while making/receiving the HTTP request.
    .catch(error => {

        // If error is returned.
        ////// 1. Log the error on console.
        console.log('Error', error);

        ////// 2. Destroy current model
        $('#saveButtonModal').modal('hide')

        ////// 3. Show Update Failed model
        $('#updateFailedModal').modal()

    })

    // This prevents Form to use browser submission.
    event.preventDefault();

}



function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if the element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //

    // Place in the top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of the white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } 
    catch (err) {
        console.log('Oops, unable to copy!', err);
    }

    document.body.removeChild(textArea);
}


// Function to retrieve selected cookie.
////// ---> Info Link : https://docs.djangoproject.com/en/3.1/ref/csrf/#ajax
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
