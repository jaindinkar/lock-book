document.addEventListener("DOMContentLoaded", function () {
	// Get all the eye buttons on the page and add event listener to them
	var eye_buttons = document.querySelectorAll('.eye-button')

	Array.from(eye_buttons).forEach(function(eye_button) {
		eye_button.addEventListener('click', toggleShowCardElements);
	})

	// Get all the delete buttons on the page and add event listener to them
	var delete_buttons = document.querySelectorAll('.delete-button')

	Array.from(delete_buttons).forEach(function(delete_button) {
		delete_button.addEventListener('click', deleteKey);
	})

	// Get all the copy buttons and add event listener to them.
	var copy_buttons = document.querySelectorAll('.copy-button')

	Array.from(copy_buttons).forEach(function(copy_button) {
		copy_button.addEventListener('click', copyField);
	})
})

// Trigger on copy button pressed
function copyField(event) {
	// Surety check!
	// console.log("Copy button pressed!!")
	// Event delegation is handeled using CSS.
	// https://css-tricks.com/slightly-careful-sub-elements-clickable-things/
	fieldText = event.target.parentElement.previousSibling.previousSibling.value
	// Value Check!
	// console.log(`Field text value is: ${fieldText}`)
	// console.log(fieldText)
	copyTextToClipboard(fieldText);

	// Show a message popup(optional) Text Copied
	// Your code here.

}

// Trigger on delete key presed
function deleteKey(event) {
	// Surety Check!
	// console.log("Delete button pressed.")


	// Get all the relevent variables filled.
	// 1. Key ID
	key_id = event.target.nextElementSibling.textContent
	// 2. Web addr
	web_addr = event.target.parentElement.previousElementSibling.innerHTML
	// 3. Card element. Hide parent card after successfull deletion.
	cardElement = event.target.parentElement.parentElement.parentElement.parentElement

	// Validation.
	// console.log(key_id)
	// console.log(web_addr)
	// console.log(cardElement)

	// 3. Update web addr in affirmation modal
	modalAddressSpace = document.querySelector('#affirmDeleteModal .addr-space')
	modalAddressSpace.innerHTML = web_addr


	// 4. Modal approve delete button
	approveDeleteButton = document.querySelector('.approve-delete-button');

	


	// Trigger affirm Modal. 
	$('#affirmDeleteModal').modal()

	// Adding event listener to approve delete button.
	approveDeleteButton.addEventListener('click', function handler(event) {
		// On approval do something.

		// Surety Check!
		console.log("User affirmed the deletion.")
		// Sanity Check! if key_id accesssible or not.
		console.log(key_id)

		// Some cleaning.
		// Remove event-listener. previously: Works only with external functions.
		// https://stackoverflow.com/questions/4950115/removeeventlistener-on-anonymous-functions-in-javascript
		this.removeEventListener('click', handler)

		// Destroy current modal
	    $('#affirmDeleteModal').modal('hide')


	    // Make a fetch call to server for deleting key.


	    //------------- Steps for POSTing the content on server -------------
        
	    // 1. Get the csrf token for the request
	    const csrftoken = getCookie('csrftoken');

	    // 2. Preparing HTTP header object and apending important HTTP header info with it.
	    ////// ---> Info. Link : https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	    const requestHeaders = new Headers();
	    requestHeaders.append('X-CSRFToken', csrftoken);

	    // 3. Creating Request Object for fetch call. Headers go in there.
	    const request = new Request('/delete', {
	        method: 'POST',
	        headers: requestHeaders,
	        body: JSON.stringify({
	            "key_id": key_id
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
	            
	            // If successful submission.

	            ////// 1. Log the status on console.
	            console.log('Key successfully deleted on server.');

	            ////// 2. Show Update successful model
	            $('#deleteSuccessModal').modal()

	            // Sanity Check!
	            console.log(cardElement)

	            ////// 3. Hide card element.
	            cardElement.style.display = "none";


	        }

	        else {

	            // If error is returned.
	            ////// 1. Log the error on console.
	            console.log(result['error']);

	            ////// 2. Destroy current model
	            $('#saveButtonModal').modal('hide')

	            ////// 3. Show Update Failed model
	            $('#deleteFailedModal').modal()

	        }
	    })

	    // 7. Acting on any errors generated while making/receiving the HTTP request.
	    .catch(error => {

	        // If error is returned.
	        ////// 1. Log the error on console.
	        console.log('Error', error);

	        ////// 2. Show Update Failed model
	        $('#deleteFailedModal').modal()

	    })


		// deleteSuccessModal Auto delete optional.

	})

}



// Trigger on eye key presed
function toggleShowCardElements(event) {
	// Surety Check!
	// console.log("Show button pressed.")

	
	// 1. Get the parent card.
	// 2. Select the card body.
	cardBody = event.target.parentElement.parentElement.parentElement.nextElementSibling

	// 3. Select all input elements from selected card.
	inputElements = cardBody.querySelectorAll('input')

	// Validation.
	// console.log(inputElements)

	// 4. Toggle
	// Check if the input element is password type or not (Toggle function.)
	var input_type = inputElements[0].type;
	if (input_type === "password") {
		// Change field type of all input elements form password to text.
		Array.from(inputElements).forEach(function(inputElement) {
			inputElement.type = "text";
		})

		// button symbol change. Remove first then add.
		event.target.classList.remove("fa-eye");
		event.target.classList.remove("text-muted");
		event.target.classList += " fa-eye-slash"

	} else {
		// Change field type of all input elements form text to password.
		Array.from(inputElements).forEach(function(inputElement) {
			inputElement.type = "password";
		})

		// button symbol change. Remove first then add.
		event.target.classList.remove("fa-eye-slash");
		event.target.classList += " fa-eye"
		event.target.classList += " text-muted"

	}


}



// Helper functions can be imported form other files (Ex. index.js)
// Violating DRY principle.

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


