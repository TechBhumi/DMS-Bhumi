var selectDonationButton = document.getElementById('donate');
var profileButton = document.getElementById('profile');
var selectDonationComponent = document.querySelector('.select_donaton');
var profileDetailsComponent = document.querySelector('.profile_details');
var donationButtons = document.querySelectorAll('.btn_donate');
var otherAmountInput = document.getElementById('otherAmount');
var typingTimer; // Timer identifier
var doneTypingInterval = 1000; // Time in ms (1 second)
var oneTimeButton = document.getElementById('oneTime');
var monthlyButton = document.getElementById('monthly');
var finalDonateButton = document.getElementById('finalDonateButton');
// window.jsPDF = window.jspdf.jsPDF;

function sendPDFtoServer(pdfData, customerDetails) {
  // Define the URL to which you want to send the PDF and customer details
  const url = 'email.php';
  // Prepare the data to be sent
  const data = JSON.stringify({
      pdf: pdfData,
      details: customerDetails
  });

  // Use the fetch API to send the data
  fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: data,
  })
  .then(response => response.json()) // Assuming the server responds with JSON
  .then(data => {
      console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

function generatePDF(html_reciept,customerDetails,status) { 
    let nDiv = document.createElement("div");
    nDiv.className = "receipt";
    nDiv.style.position = 'absolute';
    nDiv.style.width = "840px";
    nDiv.style.left = '-9999px'; 
    nDiv.innerHTML = html_reciept
    document.body.appendChild(nDiv);
    window.jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();
    html2canvas(nDiv, { scale: 2 })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 7);
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = canvas.height * imgWidth / canvas.width;
        doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        if (status =="open"){
        doc.output('save', '80G Reciept.pdf');  
        window.open(doc.output('bloburl'))     
      }
      else{
        const pdfBase64String = doc.output('datauristring'); // Get Base64 string
        sendPDFtoServer(pdfBase64String,customerDetails)
      }
    });
  
    nDiv.remove();
  }
  function generate_thumbnail(receiptDiv,customerDetails){html2canvas(receiptDiv).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const thumbnail = document.createElement('img');
    thumbnail.src = imgData;
    thumbnail.style = "cursor: pointer; width: 100%; height: auto;"
    const cloned = receiptDiv.innerHTML;
    generatePDF(cloned,customerDetails, "");
    receiptDiv.remove(); // Remove temporary container with the receipt
    document.getElementById('receipt-thumbnail').appendChild(thumbnail);
    // Open full PDF in new tab on thumbnail click
    thumbnail.addEventListener('click', () => {
       generatePDF(cloned,customerDetails,"open"); 
    });
  });
  } 
document.addEventListener('DOMContentLoaded', function() {

const modal = document.getElementById('thankYouModal');
const closeButton = document.querySelector('.close-button');
// Thumbnail Generation
   

// Modal Close
closeButton.addEventListener('click', () => {
  modal.style.display = 'none'; 
});

// PDF Generation Function

    // Add event listeners for closing the modals
document.querySelector("#thankYouModal .close-button").addEventListener('click', () => {
    document.getElementById("thankYouModal").classList.remove("active");
});

document.querySelector("#errorModal .close-button").addEventListener('click', () => {
    document.getElementById("errorModal").classList.remove("active");
});
    var selectDonationButton = document.getElementById('donate');
    var profileButton = document.getElementById('profile');
    var selectDonationComponent = document.querySelector('.select_donaton');
    var profileDetailsComponent = document.querySelector('.profile_details');
    var donationButtons = document.querySelectorAll('.btn_donate');
    var otherAmountInput = document.getElementById('otherAmount');
    var typingTimer; // Timer identifier
    var doneTypingInterval = 1000; // Time in ms (1 second)

    var oneTimeButton = document.getElementById('oneTime');
    var monthlyButton = document.getElementById('monthly');
    var finalDonateButton = document.getElementById('finalDonateButton');

    // Update the donate button text based on selected amount
    function updateDonateButtonText(amount) {
        finalDonateButton.innerHTML = 'Donate ₹' + amount + ' <i class="fa-solid fa-hand-holding-heart"></i>';
    }
    oneTimeButton.addEventListener('click', function() {
        this.classList.add('card_active');
        monthlyButton.classList.remove('card_active');
    });

    monthlyButton.addEventListener('click', function() {
        this.classList.add('card_active');
        oneTimeButton.classList.remove('card_active');
    });
    // On keyup, start the countdown
    otherAmountInput.addEventListener('keyup', function () {
        donationButtons.forEach(btn => btn.classList.remove('btn_active'));
        clearTimeout(typingTimer);
        if (otherAmountInput.value) {
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        
        }
    });

    // User is "finished typing," do something
    function doneTyping () {
        // Here, we handle the transition to the profile details
        
        var amount = otherAmountInput.value;
        updateDonateButtonText(amount);
        switchSection(profileDetailsComponent, selectDonationComponent);
        toggleActiveClass([selectDonationButton, profileButton], profileButton);
    }

    // Initialize with the select donation section visible
    selectDonationComponent.classList.add('active-section');

    // Function to toggle active class on buttons
    function toggleActiveClass(buttons, activeButton) {
        buttons.forEach(function(button) {
            button.classList.remove('float_active');
        });
        activeButton.classList.add('float_active');
    }

    // Function to switch active section
    function switchSection(showSection, hideSection) {
        hideSection.classList.remove('active-section');
        showSection.classList.add('active-section');
    }
    
donationButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        otherAmountInput.value = "";
        donationButtons.forEach(btn => btn.classList.remove('btn_active'));
        this.classList.add('btn_active');
        var amount = this.getAttribute('data-value');
        updateDonateButtonText(amount);
        // Delay the transition to the next section
        setTimeout(function() {
            switchSection(profileDetailsComponent, selectDonationComponent);
            toggleActiveClass([selectDonationButton, profileButton], profileButton);
        }, 200); // 200ms delay
    });
});

    selectDonationButton.addEventListener('click', function() {
        switchSection(selectDonationComponent, profileDetailsComponent);
        toggleActiveClass([selectDonationButton, profileButton], this);
    });

    profileButton.addEventListener('click', function() {
        var isDonationSelected = Array.from(donationButtons).some(btn => btn.classList.contains('btn_active'));
        var isOtherAmountEntered = otherAmountInput.value.trim() !== "";
    
        // Check if either a donation is selected or an other amount is entered
        if (isDonationSelected || isOtherAmountEntered) {
            switchSection(profileDetailsComponent, selectDonationComponent);
            toggleActiveClass([selectDonationButton, profileButton], this);
        } else {
            // Optionally, alert the user to select a donation amount or enter an amount
            alert("Please select a donation amount or enter an amount in 'Other Amount'");
        }
    });

});

function getActiveDonationValues() {
    let activeDonationAmount = null;
    let donationFrequency = oneTimeButton.classList.contains('card_active') ? 'One Time' : 'Monthly';
    let profileDetails = {
        name: document.querySelector('.profile_details input[type="text"][placeholder="Name"]').value,
        email: document.querySelector('.profile_details input[type="email"]').value,
        phone: getFullPhoneNumber(), // Using the previously defined function to get full phone number
        address: document.querySelector('.profile_details input[type="text"][placeholder="Address"]').value,
        pan: document.querySelector('.profile_details input[type="text"][placeholder="PAN"]').value
    };

    // Check if any donation button is active
    donationButtons.forEach(function(button) {
        if (button.classList.contains('btn_active')) {
            activeDonationAmount = button.getAttribute('data-value');
        }
    });

    // Check if other amount input has a value
    const otherAmount = otherAmountInput.value.trim();
    if (otherAmount) {
        activeDonationAmount = otherAmount;
    }

    // Combine all values into a structured object
    let donationData = {
        amount: activeDonationAmount,
        frequency: donationFrequency,
        profile: profileDetails
    };
  // Send data to the server
  $.ajax({
    url: 'processDonation.php',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(donationData),
    success:function(response) {
        // Check if response is already a JavaScript object or needs parsing
        var result = (typeof response === 'object') ? response : JSON.parse(response);
        
        if (result.error) {
            console.error("Error: ", result.error);
            return;
        }
        if (result.type === 'one_time') {
            openRazorpayCheckout(result.data,profileDetails);
        } else if (result.type === 'subscription') {
            openRazorpaySubscription(result.data,profileDetails);
        }
    },
    
    error: function(error) {
        console.error("Error: ", error);
    }
});

}
function openRazorpayCheckout(order, customerDetails) {
    var options = {
        "key": "rzp_test_h67POuFlUWf0Wm",
        "amount": order.amount,
        "currency": "INR",
        "name": "Bhumi",
        "order_id": order.id,
        "handler": function (response) {
            // Handle payment success
            const paymentId = response.razorpay_payment_id;
            showThankYouModal(customerDetails, order);

        },
        "modal": {
            "ondismiss": function() {
                // Handle case where the user closes the modal without completing payment
                showErrorModal("Payment was not completed."); 
            }
        },
        "prefill": {
            "name": customerDetails.name,
            "contact": customerDetails.phone,
            "email": customerDetails.email
        },
        "notes": {
            "name": customerDetails.name,
            "address": customerDetails.address,
            "pan": customerDetails.pan
        }
        // Additional Razorpay options here
    };
    var rzp = new Razorpay(options);
    rzp.open();
}

function openRazorpaySubscription(subscription, customerDetails) {
    var options = {
        "key": "rzp_test_h67POuFlUWf0Wm",
        "subscription_id": subscription.id,
        "name": "Bhumi",
        "description": "Subscription Plan",
        "handler": function (response) {
            const subscriptionId = response.razorpay_subscription_id;
              showThankYouModal(customerDetails, subscription); // Assuming amount is in plan details
            // Handle subscription success
        },
        "prefill": {
            "name": customerDetails.name,
            "contact": customerDetails.phone,
            "email": customerDetails.email
        },
        "modal": {
            //  Handle failures...
            "ondismiss": function() {
                // Handle case where the user closes the modal without completing payment
                showErrorModal("Subscription was not created."); 
            }
        }
        // Additional Razorpay options here
    };
    var rzp = new Razorpay(options);
    rzp.open();
}
function showThankYouModal(customerDetails, orderDetails) {
    
    const thankYouModal = document.getElementById("thankYouModal");
    thankYouModal.querySelector(".thankyou-name").textContent = customerDetails.name.split(" ")[0];
    thankYouModal.querySelector(".thankyou-amount").textContent = `₹${orderDetails.amount/100}`;
    thankYouModal.classList.add("active"); 
    const receiptThumbnail = document.getElementById("receipt-thumbnail");
    receiptThumbnail.innerHTML = "";
    var program = "General Donation";
    if(orderDetails.type == "subscription"){
      program = "General Donation Montlhy";
    }
    else if(orderDetails.type == "one_time"){
      program = "General Donation";
    }
    const quanity = 1;
    const tax = 0;
    const receiptDiv = document.createElement("div");
    receiptDiv.className = "receipt";
    receiptDiv.style.position = 'absolute';
    receiptDiv.style.left = '-9999px'; 
    receiptDiv.style.width = "700px";
    const html_reciept = `<div class="container_top" style="background-color: #eb8e24; display: flex; justify-content: space-between; padding: 20px;">
    <div class="circle" style="margin-top: auto; margin-bottom: auto; background-color: white; object-fit: cover; border-radius: 50%; width: 100px; height: 100px; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABd4AAARBCAMAAAAMkWJCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAZdEVYdFNvZnR3YXJlAE1pY3Jvc29mdCBPZmZpY2V/7TVxAAAACXBIWXMAABcSAAAXEgFnn9JSAAAAbFBMVEVHcEzklDXmm0LvxJDz7d3lmT6UkpPllDLv5tLhyqHczaLpr2fklDbpqFvopFTop1ikto+ivYZMS0vvvoSUvWignp+FtVGRvGKNuV1+sEhLS0vhiiJ0qjoAAACMiovqjyLulix+tUMnJydubG3eYQ+CAAAAG3RSTlMARchcB+78/RE6JL6nk3Die1j9eZi+87zc1JGJav66AAAgAElEQVR42uzd3XLjKBCG4RUShRACHehQB3D/V7mSk0w8mSS29WOL5n12qqZqkqrdsVefO00D//0HAAAAAAAAAAAAAAAAAHtp3n+3n5q/vwIAyEfXtXYcQ3BOvdHmzz/vf+J8CGGsu/lbeb0A4OzFemOr4Pt+0GZKs/hhuvr1YfmGNGk99L0fq9o2FPQAcMKC3Y7BzbFu5tiO0zT/us8c+JcPgrmsH5wfbdfxWgLAOUr21gbXa3Mp1qfV3gr6yejehdq2lPIA8EKtHb26JPu0Idm/xHyKaa7lfagsGQ8Ar4j20KtLzT7tb6nk54yfC3mWXgHgibraD+aYZP+rX5OSHnywNOQB4AllexecNunYaL8K+cu661zG06oBgOM01qvnRft1r0YrX9ONBwA52X4d8QMRDwB768Lrsv2zU5OWRg3LrQCwk7Z2+tXZflXF94FWPABsZ4NKaTqPt1a8pYgHgC3q/iSF+5eIN8rXjEwCwDrdqEyazilGox0JDwCPa4M6YeH+pU3jGaYBgIdYr88d7p9dGhIeAGSF+5+EDzRpAOCecHc6TRmJSffMwwPADZ3PK9w/SviREh4Afgn3oOOUoRiXdVbePwD4VjMOKct0f5+VdBXLrADwr1rlG+5vCW/USBMeAL70ZfrMw/2tCz8wRwMAV9pMm+7fzdF4Ah4A/vRloox0fwv4QIsGAJa+jDdiwv0j4KngARSvGbWocH/vwde8swDKZl0Sl+6XOUlFwAMomcDS/V0yrLECKFbnk9R0XwJeB95iAEWqleBwv7Tgewp4AOVphQ3M/FDAc1ABgMJYlSb5YnIMwQMoqzGjS0j3JeBVxbsNoKDGTIpTIaIeecMBFKJTaSpHTJ63HEAhjZk4FYV8B1CCJpjC0n3Od/ozAOSnu09TcaLhqj4AwllVVukeY0xp0hwxBkB6ug/l1O5Lrhut+jDajt2rAGQrZVF1KdnN0PvKduxaBVCAsYRF1SXZtQt1d/h21WZmra2qyn9jnP98/uryTfyfB+BYwRRQtRvdB3twL6btunoM3imltDFm+UT5xjTNX9Pz9zgfLg0iOkQAjskkH8Vnu+59fWTRPlfrdXD9MId6SvHi41/+9T/m47fLN6XLMoBWvfNVXXcN5+AA2DHdnexF1ZS0q4+sjzs7+iXX56yO04pPynjpG6W4VPSDC36sOkvbBgDpfqPfrvsDs721wSt9Kdh3GtZ8r+fncj6E2rZU8wBWB5TgcfeYjAqHZXtX+X5O9hiPaSely0rw0M/FvKU3D2BFuifBhbs/akvqXLW7o6L9777N+4y+86FmBRYAtfsS7ioc1Nnoaq+eEO1fd9guoz+9r2oG9gEUnO7RqGMGZRo79jq96kz8pWVj9ODCSCUPoMR0j8kdcpLMnO1PLtt/3nmrexdqVl4BlJTuMR1TuXeXbD/LX3L+a8a0rLzWlowHUES6H9Nzb+ten/CawmUzrlFPOWgBAOn+4qa7378r3dRev74n83Md/9as8Sy6ApCb7knt33Q/VVPm9/PSlGfNFSDdJc67R7N/X8Z6nXL5IIwfZ2LSqQGo3WWV7nr30r1yJmX2Sl3OxlS+4tgaoMx0l3jOTFQ771FtR5XpMfhvEU8VD5SnEZjuMfmdwz2olPOPOG8n3HvOqwGK4gWmu/G7NiNyD/friB+ZqAFKIfBupmh2bbvLCPfPiFeePg1QglFiuleE+6+dK3PwlSYATsCS7jc+/qSF+0cRr9XIOA0gOd21vOjaM90rkeF+1aYh4QGhukFeeKWw34efM7KvFSfhAamaXl56xd1mZjqvZd8qTsIDcgkciUxqp6Rqarl9GRIekE7iSKTeaa+q7UsJ9z8JH5ilAaQQODQz7TTw3npTUri/J7zuK+bhAQk6geeIRbfLS1OpNJVoadJQwgP5cwLrU71HOJVYul8NS7LhCcidl3gG8B4zkaWW7ldNGm95PoB81QIb79Owffqj4NL9ep3V1QzSAJlqBe5n2mNd1RZeun8mvBrp0QA03k9TvG+d+2iDjkQ7PRog69aMxBo1bS3eO0fp/rVHw6QkkJdOS0wjtTGKakXp/m+PhoAHctKIrFLjtrGZNrCm+kMTnoAHaM1kPPNOY+aXgA8EPEBr5oUptGnDqh0o3Ql4IHteZJ2axg0vycjEzK0xGgIeyKA1Y0Qm0JbejE+kOxU8kL1WZhsirj/nvesJdwIeECDIXEKMfnW6s1H17oAfmKIBzstqmdGz+kCCmrb7QxV8xTMEnJTURoReWVYy7f5gwBvHUQXAOYt3IzR2Vp43Q7qvCHiu/ABOqJW67z72a16OxjEys2YGVRPwwOnUUov3tGZlte1ZVF3bguc8eOBcGrmHZq1YWW1I9w0BTwseOJUgNt3N4wMdHelOCx6geD9/vD9cS3LKzOaAH2qeKYDi/fC5SEu6Pz/fIx0a4Bw6LTdoHr3Kg3Tf53XnpDGA4v1ginR/2QwNTxZA5/3I6r0h3VliBUpVS460h+KddN8VBTxA8X6S6r0j3Xcv4FliBV5ZvBvJCfNAvLeKdN+9gNcjTxjwMqJDLd6/tNpwecchS6x04IFXsaKL9/uv4uOcGTrwgDDCa9Z7d622jnQ/rgPPDDzwiuJdT8T7f8ul2eTwcQHPKQXAC0iPtTuPFAuGEKaAB0RplPRkuaturLmb6fAOPCOSwHPV4mPlnus8uDX7CQW8HrnoA3gm8cOA8Y547xh4f8qIZM+IJPA8nRYfKrf3NZHuz/pJSlc8csCzBPnBpm/GOyORrLAC4jQF1K03JyM9tTsrrIA4toBxQHNjdKamdn9ug4YReOAZStjLc2Nt1Woi99kNGiZogMO1JURbdL++BJwBTIMGEKgqYqvmb7etNo50f8EnLg0a4PDeTBHZ9tvaaqDxzgQNILE3o8rIklD4jy80aAB6M0Ljvf/pBeg4i4AJGoDeTMZ+utGD65le+ql712lAAFb1ZoZCguSnyfeRxvtr3xfHGTTAMepSGs8/TL4z8U4DHqA3k3m8f3uqWMtBYq9/Z3TgOQT215QTb9+ORnL73jka8ExIArvryulNfNedqZmJPEeDZqBBA+zeei+nNxH/3bjaMhN5mgYN+Q7srKSpwH/v0+YU4PPkuxl5GoE9FbJl9YfuDK2ZU6EBD+zJFhVw+u/84Pq9ky2wKibggf2EsgIk0Jo5dwOeIwoAWu8rF1fL/cklkwY8E/DATprCtmxej76zoemMEpc4AbTety6uctbMSX/CogEP7NJ6L62A/Tw2suOsmZPW70zAA7Tet5TvDeuqNOABwYqaev+7fGfk/cz5zgQ8sFVXXsal972RrKue+l1S5DuwTYkl7Fv5PpLuJ19gpQEPbFLiabiX8p3rVU+f7+xwArYo85bRpXznlPcMGvAcMQZsiPciZwOTZygyi3znkm1gvUKvGdVdoDWTxwcxC6zASlWZw4HRUbxnku+OHazAOqXu7EkU77l8Eg/kO7BKT8zh5PnOCTTAGu1AfIB8BwRifgQZ5Lsm34GHcZ0Fsqjf2eAEPIoDz5FFvhvyHXgQR+Iik/4M+Q48pHEEB7KQqN+Bx3AmLlhfBSRicAYZra9yQDBwPwZnQP0OiFSRGcipfiffgXtxYRHId0AkrrRAXvnO+WLAnThQDHlJPU8tcI9GkRfIrH7n/ibgHpwXifzqd9/w5AK3452xd+SX79yvDdzWkRXIrz2jKx5d4JaaXU3/s3euvW3jSgCtKBEUJVFqoCDtwguQ9///ySvb7dZtEyd2NCalOWc/5YFFY1tHo+E8YIt+p30V4D1G6iJhi36fWi5egHf0Tl0kbBKD3wHQO+zyeLXn6gW4So/eYaOMXL4AV2jQO2wVtnsAXIVlHrDZ41XKZwCuwcgZ2K7fmS4G8DYt0Tts+Hh1YDoBwFt4ZhLAlv3OdDEA9A4crwLo0jszCWDbx6uk3wHQO+zS7yznA3gdFmkD6XcA9A5QYvqd4e8ArzEzMBI2n36nuwngbxr0Dtv3O8OBAV4hoHfYPgyPBEDvsM/0O9XvAOgdSL8DKNE7I2dgD343XMsARO+wS79T/Q6A3oH0O4AGGPcOpN8B0DtAwX7vmf0OgN5hl35ntTYAeod9pt9JzwCgd9hl+G5IzwCgd9il36mOBEDvsEsS1ZEA6B3ejoEv2dg/ndV8AOgd/nR6SilG55w1F1i7fCcejj87bOGjEgeuaQD0Dmchnszu7DQMYayquvbNJb6uq6oKYVhMfzjeAEr/e1jdBIDe4Sj3ReymH+euvbYR41iQ0nStn8fF8i6WLHmaVwHQOyxRuzWh8jdVEzbej2Gy5Rqe6kgA9K4+brehvvMgsmnrYFwq87OTqI4EQO+KSa6vPregtPVjb1OJA0eZHQmA3vVG7jaskqHu5sXwxX2ComGzNsAXtjXpDN2H9arDu9m40j5DMZB+B0DvKlk3Od3UvSssR0PzKgB6V5mZWX8taXGCp3kVAL1rRKIy3PdFpWhiz6UNwK5VjeF7JfBJqk1JHyVWewCgd5V+d0EgedGGkgJ4VnsAzOhdZe2MHQWKS2pbjt9pXgVA70oD+GQEqku6ghI0rPYA9I7e1WZohvXzF12fyvn7qI4E5VR4TnOGRiABX0wXK6s9AL2D4gxNv74By0nAx570O6jGOyynWfACGfhuKCVBk1jtAegdFGfgBRI0cykBPKs9QLfeLYrTjROYv+VNGRn4ODE7EtA7KE7AC1QQNmMZATyzIwG9g+oKGgkHdkMRPazMjgTNGGaKqU/PyBxBjraEI1aqIwG9g2rBzxI5jCJKaBhOAOgddOdnZEoIS8jAs1kb1NL06B3E1k/7Pn8JDcMJAL2D6voZW4l8vto5ewY+Uv0OWmFdE5wkKBXk+uxTJKOh+h10MqJ3OAe5Qn5vsq/5SKzmA/QO+F2COvf5vWM1H6ikZugMSPs99xj4yGo+QO+g3O9SPUDZ97AauptAIS1WgwccQlZ5S+BJv4NKvTN0Bh7h98w9rAwXA/QOuklyfs+coGG4GCjU+4TT4DKLIVcknndPn8XvoI1m2FBlZFz+O8QU04n4Gz++t3z39ItQnt+brC1OrNYGfWygbfU/fR+ctdYMC/3CWF0wHr9z/MkwLb/jDj/9j69v9rvgDK4uq9/pXgV1ek/lav0Qz043ZhrGca67I7+OyJpfXKabjr/k53kMvTHWuZPnsfYNCDYBdTk/bpKJJ4ASmYtU3ylcX7w+hLny/nd/fzwZ0DStr8awBPQOx3/8tRcaD/wznMj3PjAcGJRRFSf2k9dNGOuuXamYrW39PPbGHpD8h3CSfp9zHrDOXPCgSu+upLgxOjuFUHuJp+glkp/DEsjHhOLfeR9EZ6Tn7HBK+B004cvQ+yloN8NYt7LtJ01bj4NxiVPX61UmleB7kLNAUvQPAyiM1pQQtTtrwuwfdfLV+rk3NhHFX/G75BCujAU0LPcATTSZp7UuYbszoeoe3TPe+DosiieIf+NtmfA7wOb1nnMd3zFsH8Zs11vTLYp3KP51v0t2AbUZ/T7hd1BDtr6mH2F77uSUH3vyNK+9PUOD3wG2zZiyud0XMsWvPQfxKP33KhNZv/cZ/U57EyhhTpncXtQ11noM/5ffRbs823yHPrIPJgDl4B8v99Lc/iMT78NgMfyl30W7PHPmZwbid1BBZx/rdjvU5V5b3UwMf4HsDuqc8Tv5d0Dvq1dBTmPh11VDlubi/RJtX83p94TfQQOPu8aS6+stPBQvhp9SQu7yfveW+B1Akscs9IjJFlMp84F7Xk0a/vy2yXYB1fgdQJJHFL6fjlO39bL40TgEL73kqLJ7vXMBlMD4CLmPGyxVaKueLPwhGlG/jymj31m/Cnunlp4Zmey41To0H8jRyJa/Nxm3QUbmA8PeER4JvGG5H+lGo13wwkuOhoyn2C5QAA+7prGicg9bz3A2de9019FEUb93OWeWsn8Vdq73SbCuLuzi+MoPugUvG793OY+wo+GAFfaMVPYzJrObsysfNAs+yravjjk3hnHACvvWexK6buY9TW5aInjFOXjZJXYhZr13BRwAu2V2IhfN0O3sddIseNki8TbvyrDUd1gAdopE6Uya9vjIW/dqq2hk/Z5xOsG5AIAEDexV71bgeXef8VBTG62r+2SXYIx5TzbiXiskm4bR9spZfZv2noOhZrRa/W4EDdgMmV/VtMcKmrbubcDvyll3m3aMw65TmV1QmoKPkjXinc391+1OhD6YFKNB78pZtXAh2t13enuljayiPUBj7sLTuK8AvjvP04gDflPOuKKsVMxZbWedGZokWP6ePT1zCuDbHcld/C2DbUSj65XOJCVbLP2gMoCXbG/yroD71z4Kvrr/JuHJHojDJoLRtfKe0Y1qMn06j1idYOZtLqAvOLp+84K/HHPqmImJ3qe1rg1N5cOdxgy85FucublpJ0W93eUM62iwG6yT9tQ2vUNnBl5we1PliriDbXmEdTteLihgIRV8WWnqjPBanxKpJoXxu6Df+zJezpjM3G5T7r8/UbKuBBbqVS57hZFCO+ibIylYG5W9+P1C8NuL4P+U+yFRFAlf1ila0Dm2oxn19TgJdsqMxdwtNyf4tv7zLEh4Czpshc5wqnr3k4++BLxcq0xjynkxNyX4dp7+Ouh3zEmDda4qxR+lblKXoEli/fvelnQbS3YbVTSvyV16RS5sR++fHUug+qPUBnUVknJ+r92hLMH3dbtFuctOCIJN8cmOktjrnls0O31+l3otQ2HPQtFNY8lFA38dqP48ACfxDj+fiT8VM/FRqrQl4KNYO2RrSnsplxB+qLtNyf1woOIdfuWPP5PypHniy5daXQW8WKVUV5zfF8En21flPaGeRv6+fhZWITVYJWRirsVJSsoOWOV6lIusRYrpYEJVUjq7uZwt82fujEsSLjOe919RkRP60x2yV+d3qYRFWcerF4Z3JvhCDN/WvXvzRJ9LEn7jEyPfOcP5ccEFbfl3se18Y6l3yiWGt6GAPHw3T1dO8+lWhbUCJponflnJafO7kOiaUO6T0DEPP9RdxkT8tayM6NsCm00d33u2SvOEYr8nqfi9DSVnuuKxHH72eQzfjcZd7bNI2B3+jAjuHfnOXItLZm1+l2p4aAqf1bYY3k2hevSHv62vB+7E7vAqdyaOE6kZ3X6X2s7XlD+LczG87cfHBfGNH016r0GaOWLwmpfuupq0t6vi9yjn9w2cVMdTNU39AMUf3e7eH34RLfEW/M19m3IcDU3q4/dZs99/BPGL4iUPWxs/f8Tt2B3e4K6zVepr8buk37fSSRCP5TRSUfwH4/bTv4MyNnide2Ily1A6/C7nlGZLu7DiOYqf1+176urwUbcTu8Pb3HG2Suszfj/d5T1+/y+Kd2ZYwvg1HL+E7b1d3B6z32dh89S3X0kTwTt+P0jOlGvC5iY9LIo/Fk0eHd99Ru23hO3E7vAOt88EZiodfpf2exu2OcnnKHlnTT/Ovr01Id/6MRibbt0RQ+wOV+KFW89Wo+FFw+8/0nRi27WbsN1VKfGUrLFmCHNV+6Z57zVqlph9DDclZIjd4WPcerZK8H4NZfMJ4tDK3Sm3Part6PjkFsubPozjXHdnfrr+/JWf5zFMxrp432JH7A7XufExmOB91Zdz8/G7XI1svYNVWPEYyh89n9zBWWunJaY/My1fWXdYfnL8jbuzY9gdrnJjYxPB+ztP2srmvwumfuv9rDpcNH/O2vzicJb6Z/5E5szAe9zW2BTN48YRtG3rv379+vT0/O0Xy5dPX+tu+Vmhr6ey/R6SKxkL3M+3lu1X+b9gd3g33LzpGnpE8N40flH687fvLy///u9Pzt/59+Xl+/Pz89OTb4qbftMOqvZ7SEqm07YK67ZzbewO78r0lsYm8eC9674+f/vn5ezw65xc//LP9+evT11Rjm+tKr+nIPfqtwG/Y3f4TIrzhuS7ZMNq0z09f3s5SfvfGzjeCF7+Kcrx3uoSjWQX89YLaMQemnrsDh8JmG/Qu1jDavv0/P3l/Yj9/+ydC4+bSBCEYx5iGBsMMuIhIw38/z8ZwPvetY1tuhmmq6LoLsklm2Ph26K6p/sW5MvBx2s7EvmdqPZIyvh9uJYhDDxrxxLkWPg+/0GmmfKts6p5nuxfGT8gPrfB1cjKFOiWa0/vQh78+88LDrpDczW/FEgxKnJge7kE2z8RXxW5At/d8ZIBCqw/X5fQ7g7Njjdnz6ZLLGf7R1DTVCubeCXLctLudwlSBPDf6I6zJ9D8t99onYdY5QPbWxqNJn5VwmtR7TO08cx4wgkG/rNlBrvSoAcwO7PRwxwW/aJS1D0V3G0gvC+qvEodBus9/PvblUbLDPTQu+/M8H3B8+cBoXH/Sfi1cvhUlOGkPu+25RGSS74mnRNsW4AeC99ngWi5I006r3oGuL8Rvl6r0npAPLOkdiH4bqIUuIIowvelCqs6q7nY/kH4bI0XWlnlVfr96tqTHsAbDy0zEE34Hi6CSF0ww/1C+LLIA0u/bCKemX2fCg9ouiNid4gmRjCHBfjI7ty/WXj2jEbU8ib6eObfv51gA2+6BHSHnqkCzsD7AoXVIF8L7hfCNwV3S9lBEo0Mw1FKfZBq4E14AqggqhTh5ROrQV6tCfdVGmnUURKMWFa9+DIrrOh2hwjD95etWczXLXOT8BVrCO8jnlnci3idPMB3e/RDQs8a6/vh+4snVlVRWgD3C+AbTsCnklDEM+kqSKWdYUU/JPRSDbCjNWbrhu5rOnhZ3ZERT4IgzMB3RwQzEGX4bl6p6+jCIri/AT625tK6Fc/wfN0cDLyRY93RMQO9JH1v5vsrTe95Yxndp0b4jC2ekZQkRFztHWIMPKb/Qi/rzsSmF6aJqcI+uE+Ar5g8kah4xoRcTlOIgUfHDEReAXx+TZNVqfuPNvicyWhKWr1q+PYIxXvnDbwJ0wBwgl5OZyKSbEYXtsJ9SuAznmcnEVUH5Ns14bqBN6ipQss8KR5FNhPXFtN9BHwR8FxcSfGMx9ihrV2eQmMiDP+FGBzmc223QV62lospgBd1uIl3zbPvaonVIHWHlgvfo6WzmaDoW/tVszxDoka/h6xYUm4eckLqDjHV/57KZuJqC3Rvexa+y6qu7nnBFLuX0JhuD+sO8eTDz/TN2NjsvqJ/P4lqfufu1PY9pwBvOs+HdYcWTWeuA+iJo+bZVuDO5N8Vqquk5sQ/OhPBmy5MAHeIq/z3+ElzVWyH7kz+3Zdk33mrq5N0EroB+AHumEEALf58hIs9rKraFN0H/07vNgNUV+kBv/1L3EUI3SEKXeXPo9mM3hjdx/5I+rdhLWq02H4Vh5JE235HMoA7RBW+X8P7g0lqXLebE8f5pgSLm8gV7zcMeBN5O2AIIno0rtjLB6eI2H+W6U++ZyumXy7KW+nA5Qh4A7hD0I90+HjlxvPdp/vAd/r5YrJGz6y2Xyjeb6/Iarpoj7m/0Ar4eWiH9lbp3rYleb+CLPsertf/sbUuGtOFB8AdotXfrZEPnUHcLt3btibnUYLmSC7Ap95mMhqDVkiI45n4010+cmR1y3Rv+4I8NhBl36NVm0AC/7AJC286LwXcIYYn4s+TlQ88pXnfbln08bso+861d/X6V9PBwhtjN9ujA8YPQDz6szVyfgvEpr37FL9T+00dimqOXD1PVr7NZdauOyZoc4fY7E70ygGVzdOd4XRTKgnv5mhB6qBPdqbwUzkVqQzEmM780RppfDF0Z+h+V0dRfE+tuKvjxDbCmy7yUhh3iFd/tEZGWg7dGbojRe1tMqElCLOK8APbEcpAK+g3fObWx2In6N62FfUlFjVZbJ3RM9cIf7SA8KNvT3ysUIXWCCp/de7NnEigGjfoTt89I8q+r9wc+fPunjx8B7ZDQvXLW87rflBV64qoZwMHe1H2/WBX218Qp4dwFRNvwHZobf1a2TTraLmqemfw3lIfbopF2ffOvsP2epd4YceK+AHtoZfG6HCHVtUv9syK3guH6E5fXZWVvns2+tUg9qdaq+Gz7eiBhNa/738cXJ01OCRzie70swlk2XdzsvVW1wPiQ1rGT2jfw7ZDluhHa+Sc6D13iu4M1VVR9n3NyZEzXPwu2Q+Ip4hqTNeFx/0pRtoOWaMfjR0zut7jpnUM79RnV4Wl74nlt/yY1ByOI+QXMvJmNO3hIfGBdsguqe+tkfeTU107Zt5h3wXZ98/bWPunxPPCyIxO3jwfxnQmCr3khKwdsj6duX8sJaico3vbUtv3naz0fb+Vez8I4t0uSbzjJa8ZNf797/8fXhz7YNmPhySNFaJ2yFKduoeGhmQO0h32feGzTVvbRKRU7Kfpfu+Ndj4aRztOMmfzW+PPR4Nh9/bpyVdIYyC731LDRw4d5mXroqjtu9+Jsu/eZqmn4ngw9Kdk0OFwHBR+1fDjQ5Kc/F2METLQNl5Qv7ZGhncwpxsn6U5u32UNjrTxbNNTj4ZSKvgqBbcObUxfRpLfnSfmYvDO0jyTRrDvEARx60vb3r2etqx1VT1x44PyzqLs+wnPFQTZ8Ap6nFsTczR4Z5k8k4pK388h7DsE2aDP1sjblVVVu0t38rWrcSgK73bsbYIgpDPRvHliRe8w3sknzyRGln3HMR8IskAfufDt8yi5y3Snn/uuI1n2fY8HC4Is0PvCiZtv1EHjNN3pjzbtZdn3CK3hEGSB3g/d3KysFm6bd4ajTcLs+wEPFgRZkM6E98dFxqXjdCdf66GOZ9h36O5t8ibtZ5Py929FdVGRf/zU+Ou+fvsNuHTQ33obiXKjHOZ018xbOpMRX+XUCLPvmLR1X+NhWB3neb7LilFNXZeDxvuxHL5NaqdvH/ryw/E/GYzJqHr67dkuz+N4+DNxZaEP8ET3nsesdx7v5OmMltUb6cpoAhKo60Gj9y7qummacoL2B7wvbuMxbzJ+v/z2viybpq6KwfgPHwTXGro0ZZvrZ1ZV4z7dyU+uSiuuGpti+BQAACAASURBVA8e8hvTlVKDTR9TlmY06J9WfPlb+e0PL+umqrI8R3Yj+sa7jBW72jgTFALMe9tSpzOytjbBvn+6ozjOiqIajPpHwNK2PI/U5cM1dV0UY2qDz4VETUPfrzfOuF9XvbS+E9/9ypNl38+w7wPZs2Iw6y2ZUX+E82VTFVmO7SPSNJ25uV5ZzUWYd/p0hnPwjA1fScxJPNrrN69uyy0+Qr4eGA8jLy2due61dCMD79TpDGNx1XgWbIgyRyWY7RPa7bzRJyOf5RqMl6HEnM3++ie7FoF38t4ZxqV8xj/ZMKMykfo6nNW95a+8I+OrIotRdHVffnTuro8kCCoZeKceG8m3U9t4wc6K6moi0CAGeVFuJM4cGF9XQLzzd2R4cwVDJiR8p547E3Bt9TCpJX06nTz/nlflph6XsbMGiHc9nbk1cUZKbbUgv8xMiUmobenT6YQdXtVVv8GHZXTxRYYs3tl0prs1cUbL6Iwkb43k2uoxnVCzpA1TFN9VVm7WCU09NTlMvJOmIwxvBM9KSG21Jx+DxVNcjXb/7FkgYjwxw8X01nfN931T5Jhk4J68m2dQKoTvy4hlrthlHIA1I8y6oxC+u7CMeGqoAeGdC9+9W78qpLZKvlGbp/X9Us+0Zz+UCSXwPXDmIQHh3QvfJW/i+7ivG/LokWOu2GXUOlubzhy+uz9+Rjk1mAmEdyw2vHmAXEpttSS/oxmWNhlPMeb8M7/iOD+fwLmxewPhUWmVgfd/Qg42teThu6JPZ94nO9u0P8R0qeO5u5Nvs32dYemWE3jfBwjf6cfOcDS0vK/Bs2wAceKyE8xdfb2FhXcD77ePF2rUVhcS+WCCjzUaFoXvk3/fu4sJlzuHRwuPFH7jCtTa9++XVQcOH2yiT2fMge9FAQ3wjgbvvyw8Mhq3K0ekWC/L+rILeFxqUzbrUZ6+tkoO3Shle1F4tGEz3Dlq3p3vPOj7KsfIApSOHq7ON1WR5yr43AY5raQcKL8K4ukPNpFD97PJXNm2vNs42kAjYVnlmNEghHc2vKkJ0D6OMbp2y6g4q0p+wtPjnRi6XzdYH6zb/te5WGBVQtbdAPAOpzP9wmyv7m8E0/zDVelrq8TpjPlSI9+drVPnuVemE3Lobzr3B8C7qSX3aQ9sn1uMj7Oa8+HpK/orSZvOdD5jGfcpvjt3grUQg3c4eGfTmWqxO+Sx4868Q1YZ3LsibVj8Ntg5Mfbx3UQnxwBRtJIEwDspv1/m9a54eEs755zVmiE7oIzE3ycSvH3OorOFfHesA17KuOwvDj4HDp0rINWLvNo9g8+A7/WXoTPyn0+J9wPfi8Lzf0mnRgSrspWmvkIfPOz771TmWduWswU0DMaSciqw+T7bxcZ0ZhoheQLeN37QCSdZXUvf+xfh/sLBiLzh4XvP8d5JmM78WJkbR2c7+R4lGnjfNuAxi8YtvTAWeIT7ix+ch+99xnAhT3QbtUPNl/O/FsA7M6IgqFuRQkKDeGYhuP/jKrCy4J3QUx9/vCH5ltr30cCnjhxzt6wxsm/7b/8krLEioXFKWfkk3Jd4kDVHBzwL3vWRp7I6JgeesZXv5+7ghv3LLGhmGUd4XKY3Ne9qh+99eZnfRDTFCT00jvH94fPX4/HUpajIwXcOvNNVPLuE7UMtMmPMiSNOcb+eTx+oXZZ1UxXj6KZB/ji/KVCDgmD4l9iffjYvqqpoyvJtJOuCf18YeLfy98cQu2yFXTHwnQXvZK2R0a+lSDq0F++OVFhVtYpdL8dxfFkWaz2vxqm01nmWFVXTlMuN3oaBd4vv85PG5RcBaPrhTRXLRSRLxDXfmwJmFHy80/bcZB+4nsc6eCrzHGx9PPj5cfT2IpDvC7TQOKR8lofu+6ZYfkQ0+U7vvmKp91El4tHvNNtq++6Ggdc1H9rr6j97Z6KdqBKEYWVfBBFc4pCw+f7vODS4xaAC3VVNY1Vy5p65zglE4ePvv5auBbsYnjqOG20ObC5rySngqYRmRuFs3zUZlQOGhg18tkDzHQfvUJLa7HjT/XzafJ+BgEeYGVm2A7Rd8XeV50bbLy7Gl/uI9vqYUbjb4/OrodbtB7gN1jezUO9AUyNzrevDstN06gJe8eW9AVy029gxGw/u0nSczZZne4XyQBnWWSn4TdeirpUYG9CPGrjK+AsF70COyf1eHsrI90bAK75NH6A9wwwZULTffolaxY8V8WTQzC089sDfX3bALvffNdkRrkNnOwNzBsh8z31DRfnOBLyvNh6ATMPG5XTx1jZsj7SRhN9TBc38RLyziaJN/RVFuufgXIaw5ZFIeA9A5hLkYefBJi/fmyljajs0AHyHy2C9dl4Z4cecL1XQUIi4/o7Ke+9AwwKe4H3ixTPzSLEKHmoqie3nO4y5NJO9dyjmHZCFCkiXKAxxn+B94rXvN4dG6SkFG4GrStbrLTVZ6YzZ5piGjFGICLj0avmFpEBAzHc7wXyYAAh4U+UieFFD78S3A440aQZLeEqwUojQFnBt4FskvIMI6iJBtfpBAK/yTqwCtgUuyz1AO+DI59VmsAtPCVYKARceWHdThPQbgFS+P1PvC0/LU1UAv1bYgne3fB2gzJSZ1OPNHerR7COiEwW3TgKyZ0qsqxPEL3mK94WuiHxvLHiVq+Ddw2jAszke0zM33O0wwKPdQRTzDag+QbyLE0JPP8e7oYx8bwGvtII/jiF8WR6iafpS3jDAE98p+K+5L8XxDmGHF893qPbsNFUK8Et1q+y84ZXjE3LcuQFPfKfgDpjqSLxLE6Ly/bl6V6U48h7wibpVNMZmgIQvJ1IqIwzwxHcK7oAZToB2m7kmLt4dTTG+58U6VLjOjvX3v53DWL9+PG4xxw6Ml1MDViTEdwru+wfCntmj3WgQuH1hzoBNqQSug3dV7oT02jmMf3fNOI9pQhnSJBLwxHcKrIContnjLZIB3JJnXatt+HmqHuBtLVR71qzjNVudHveX8Xt7tove4RBtXEe1Ev/+jbnEdwpegxOguekL744LsfHumerxvZXwusrDqlp1briu67XhtisSFZclTu/GrZL6myg4177im5u2eGcPMKc3D14eUbfTVEnA2+tkFt3uBgvF77m+A0GONJ+AgnOxKH5gJKISEp9b7Z73fucHFWmqKOHNlU4bAk0i3H4WfLknvlNMzJ7BtAxXwr2Szs347qWXlqeqRqG6STOfu66fBY82nY9itkpCcHYV1TEEMN81B90QQi2VJA0/EYemlwV/oKcxBVcIHg1cYi4oASoV7XfnH+Sp0lEQ4adhi/ZxaMotvVEUXDpC7M5NR0y9AdHY9HZWi1aozfdWwyfk68qOXjU0VD5DwXeVCZXvqNuJAYz5KoK3z0NTcf3eJFoLWyMjXrpD8/7Wo/QqBVcI7V1FXk2Kd0ry1duD6nY6h2ANT77uUfZOpkPzPsX6RUbaJKnputd28GnfQiJHi5UR6qnr4qlnvr+dwiKdB+BrEW9qwZIAIo8S2z3Z79MPw3McPapjdw3Lsm5/qV/RHWeimBdYHFniogJiSO/7QemOn6dziRrxtumHLvk0ksJ9J+Cpe1Uu2N1NA/Os/s5O2amJ+PzVRJbVr1kN7qPNBCc8CZTvyEtJZ43dt9oeVpsP3y+IXyVkxcsByLsayT2truSsrDw92lk10OM4rqrqp/p5FvWrcc367Mx4z5nYBSYus4p86hCNTT0+HNecFd/PyVbTT1xCiQQB/7pGsjxQfgQd7YzsNdir50zvwnwNecb4WsVPifDCRs+gG4UAjU12n23slnY6v2hVfKg7hBNkmLyukSwjeoswPw2XoT0eBPa7qBHfiPgJ+Z2iepvQfUKAJtIi6HPgpEhnGY2KXwc6mfETEvBkz6CyPRvP9ouKZyJ+N5kNxETJ9xK7ShdiqpjW68hBns41mIq3tVrGe8T4SQj48kBvEB7b+dB+JXzj0kyka0FQ8cwefVkPUMRi9vtMVkU652icmnUQumTV4MSrKQVUPYOxguLyZJ5J+EkAXlDxzBe63AOY0Pt6S4/bikfL03lHnuZFbptakJBVg6EdX1ikNDsSfPW0s6yTMLafCV8DPpsE4MXId/wWDIAcZ4/G1Q/h+7X5ydZWzI4nxgCLrKc18NTcBGtOswrIWDDcpwR4IZNnJFyEHsBUMdMhvv9BPPNqmI6nLJ8UAU/ZVUCGsK4lCLi3gLcsS3qSVUhyVYbGAECs7fZ+tnwK3286vmZ8qN4W1uoI+GcZVpLvgHAXbsv8Abzs5MlBhHyX8Eug76d9H/pn8b1lfJtzTZYueTUQtHlyI1J2VU24N6XwLMcqV8ALSa5KMJl0eeb7Z/L9Vh7f1E6SaSA4jO4SSepdhTDDIov5Mj/QIV/Ai3BnZAynBjHfvQFPl8/k+1XHmys/1F2D2CMuuqeMkXwXL2kxpPsZ8EzAS7Q0RWyqLQPvhvipYqm9XBDf++v4vDDN9YrZNZR4FSMqOzOsJN+FS/cMQ7rfBLzMEhoBtTNStpaBqHwPFsT3wUq+SGstr2m+H4a6rjtN8N1/72O2uvJYknwHl+413asftGAOvLyP0OXH+1GGeIMw37VBJ2AS389tUAzzDekLOzVrSb/WVqvgHOHyRSTBLVbsi8W6CfNp1C+uzj+//hGu6zoLw5iJTdSRYS0PVK8kbtHfjHA/IdK9FfCRtLUKv/l+lPJYAjDfbZf4zt/y2rS93qJ9Zx/i/K+Lx2CeT94+LdLz9++v9o8iv/xs9sM0Fn4Qhkmie3WojMMOg6akfVeFPT1r6V7T/Qc5agEfyboo+c33owzlZEBUvofDnjAa8f29sr/++fj/8+vzIM15Vg7ntUNL/Gb1UIt7v1b2Osv9Kifr/xo0VPsu6q1lWy9lEHR/0x1VZdIqJPnNdyl4h5jdOKA0shUDxPdpOkXNQiCvhT2zcoIgSJKl56oigp1Hg4ZaVwWRjsHdgkiqnqw3Eyerkyy+bxTFuw4wutH0hvK9IKJOeulwVfUs/7tq87/e1JOz0Z729RD/1ISje8V+cL0siF9s8ySL785RTbxDVL4PKY1sT8InviuX/238m6Cp6HQWk/RuHkrgaXCkAMztwOj+E2dNtNbPs638Yjl85698l4N3YwXgzgSDr5qA/BkV87+tomdZ2VrQNxnZaeUAf2VYqTZSEN0zmKzqycquwfbV7t73qcqk8H2rZOUMjPmuDV+1BwUBXuXC/aaek7XhrvxkOZlGXONXSoySq7xvZ0t3GPH+c8oeopvwcvjOnVs9ylE+ABuuDiyNbCOkAslZgJ6lY5lDz+T80pO+lcn9FHhKrorIqoKp96wjGsL/eQ7sJGBSya5VGPM9D0ecyJL4Pis938p5jU3VYWlYaQbNrYKG3BkxdM9A2lWrrDvqgz4C/oSfJedubJKE9wWE+a6NWZu7VEAzuzxsO1XHvozVkZIVuxrwtKk234Py5o1XcJnVznisl8Tnu/PFu52HJLwnEyiNPN+IPun32WZh27E6rC0WXctfd/nY02ACnrTqTVDHGNb7LwX/cMQTOiy3vOa7JLxPxp1hBjxNGPuAHCyzbIIloi1/rZCkwQTjY3dX2HLC82YuHvyDgEfnOy/eZTmDEHMJcn/kyehk0HwE5pkvXyt5HWmyjbOlPbV5l0DWPW5hyyK74zff/yGvxDYK7rXaBETNuTnWZfW0nAT851TZsAob14GvojTarnKa+i7AeAcx3+Psffw6aPUPGe+loniHKI0c686wpw0ZNJ+FeNv0gyX4WruZMUalkSKsmSwTvo9HH7o/8n2J+gZwjyWQhXcDwnzXxp8PVUh+HuNtUwt02OU2q5Ck0siRET1YJ2LxXr13Zjos/wr1WW3w4v1LVl4fwp2xOZ6tnk8trJ9ox5urEDLfamxLMt+FWDMih71XVXzK+tH98bD/MK027srIvSxjcAnhzmg8byW1sH5kNEZNCJdujfZkvo96MO7+8Hcgwqv4V1z+ejo142Wy3vGQXkUtneHtW5VlDDraxOQ77fHx0UYNnE+zoS35RFgzw3KrccPwZkoY+w+T6s23NQjsXfK9wqyOjBStjIRxZ8bMFbsXDJRh/WCfxjZXCcitS3QXYM0MM9/jwRDvL99jQx28f0eyPj8IdyYtQr6TohL4D3fitZC6kKYh3jtkdCymXWlwPBwX0Z7xeAvfpY3EgKid4ah9v7yfJODJpnFJb8uOjfW2iOWleBeK9wdTCNGe8XiHih2lXcogu2nkK96lk04O/MfbNOAFkxRvsLbr5KyIUTJDw/rrCeFVz3DjXV7TBURnU5oWCbdVSiU0pOHtdaBTwYu02Fl9ZDQC3js32q7QEpbc+/HJy606MDLZ5l86uTSkgBBfa3jy4SeUVx2C91gU27O4e/NVtCf/QdWpM4tFCJLG5KyeOZ+aSSlWInxN+IQILyEtt3uC2xgV79bp6fGWquBd4sQjz4S5K30R50YpVgpGeHOl08yYKeRVh+RWK4iCGSnyPfpW1nyH2kkjD0WcnbuiKQUUTT184JINj+na7jJOvP8A0x1PvvPOjJQ58QgmuSoivdo6NBoBnuJsw5OER4vI6luiCFoZ+fJYsaMI3r/lme/GGgiftpiHqxeQBU9xNml8qqRBEu9Wxo33KgPGO1btO/dI4O+jvMs2AaJnbgp698mCp7gsCW0tIQmPEDsReOcvjbReHwupdZV7ZuR3Ke+idbR04nxfLH0CPMVVwlMhDbhja431wwXXzrw2+iscd4a78P27jOR9lmE+eb4vllQFT3FXSEMejTTx3j+3WmUWrDuDJd+3pbqlkQsDrEE0X4sTWkstJcBTtB5NQWlWaeK9P96ZfOedGvn6YDFSnpkb73uJK84QTmmZAn+t5ZqKaCguEn4dEOCliPchGzY1OzJlFgfjXx8NKbnqliq7Mw7cfBehfPcSAjzFzaMhwMsQ7wM3bKoZzPZmGk1461RJd2c87tzq95fEzzOBg2Zuimw+cBKyaCjuAK8TjJHF+7ANm+4QP96oeXG8GOcJz70fn8zaGajBYme+C70FDUqyUtwAb1MZDbp4H4P3C+LHEf55rQ7S3EjumcAyO5sAi2eaRFgi9mSXmv2fvbNtTFTXorC8EyCgUNvp9QoI//8/HoLYWqtVBJKduFY/nDkdR6cDPCzW3tkB4aGB8AC8bPP+LN6HKP4Jwv8xxkxOOuNOL67+U7h5gbvkdPUqSGf+61qxhxAeGtxDgAxeqnl/fD++mx5+Pr5LSmdmWNm0UXhM00UX/td87luXGFUAwEPH0wtF1hm19p/PSpYivH+T77J29Vjr3Pq+aPouLkB79keTKLVrDKOB0EUz83Xll4u69yGlGRvS3PrQZisJkNPtu8oQsVgWlbU9/w8XpkkACw8dT7AMK1ln0cYvl3bvJws/BvA3/Xsr6b6u89jIBQdHfjXQLDGdmSGjgU4O3kaX5Awc2JYS3PuQm4/KaG58bCvpqLsfU/n+rvIB0woWvvwCvoS9ilL00UAD4BM00SyczfhiBWqzn0tNPgbw17dclZTOrNjU5siDSvu+ipeGZJ0sc/uyYOEh1FglFFb9ss2bPN/PqFGAv8b3xpfVcTh5sJjK3sgV8xa/+uyF3JWw8CA8JEbRIIJfKpvp4N7sF9DjgG+vjqWU9cg2vbqqsjdyxRcH5Pwd8F+nZZ/Cg/AAfBDDwE/weL5suI8B/NX4vV1LqzpPte+fKq1H5Enge7zYA0roJAhpoF3lpSE4PXM2syTcxwD+Ct/brbR/nanxjNKlTas0kHDx2Qs+S4UplrNCVW2jxDov3v023y+rRzP45grepd3NJ8czSu27a1dSzNWSP2OUJkhpkNBwGPin+LW9bt2XhvvjW7P+jt9bX97NfGo8c1irPLoskGKuFk5Ho9SGh3/1HhrbAqyfwLs/euK65ITmd/ye+xKZOTWeUdr7LqG6ejTwSy9FOBIeiIeBh0a5U1+RdR+R0DS/8C4vfJ+8q7ba3vcwk8P3IFn8LhalsYduSRh4aBLepVn3U0Ljj41n8nIrMdGeurhJrX13AknXnidhLXFo8SyAiYeBhx7Fu0Lr/hWljxw+0zl+mcicGr9/KD3AvJJ17SUyDorLRKkVJv5VDTzG0IzSxU4ekq37owl8c/l6qf2GE+N3tc2REprfvww8Z1LcVeRwO6iA+Nc08FjE+izeFVj3BwOan3a/LKUS053Id6WjCaTFM/1OmXbiSHmwCgcTD8S/noFHD/xzeFdi3b+I/fjipraUWVsVdvHfQd/qqrR45kj42rO5JeV+FnYm3kMU/3IG3kuB7Wfw3u7VKR8Rz0jH+1S+vyuOZyRff8LEp0zKQ3RkdYivkcWjwgr9iXdVwcxjfPfb85FipdTWmR4jnzrHM9L3uKsE4rkjB/Gdi0/sAEkNAhroFt4VBjNn1H5ocZN4oS+723DzjnhmrImvvA7xkjY+Z0Wf1GCzVgQ00C+8+/leuZoH4/fcV4D31fpd3+4ZKbNnrpv42ku4I+fZxWVWmniw8S/B9xr7fIzAOwG63+X76fGi/x/5acc0vquNZ1ig7kKsqkBUWyVdjVHU2fhj2yQgj4AGeBexe7Pfa8P3Y0iv4N49je9q45lUaWohongvTh1Zt7iQiaYaMaQGRt7ggAZLnB7Bu/rY/eF8pjnR3VdxaCfxXW08s/zGq48hXpqL7xgfOWnc5/FIawztoInRQXMPWT+aUpTrTv9M2Q4LXGXOjDyrr07pn3lX+jAZ2gQQd3LxEh+9osjhSeYFQVUjrzEuoEkQwN8hVkmJ7se66Z+ALxXifRV9Tuh//3yJ2WIPIV5auXUouobM4nFH+V2NwMYoA58hgL+D94YU3vftQ1s4KcL7pPVNB7WzxQoyTYOioUaUWyX1xZ85eVak3La9YIeFUKYE8AUYrhPem5Iy3lfRlPkzL9j9/ifjPTtOmez81HVZ5+UTG8PjjeB7Db7/9czuE8P7Y3xXhvdJ8yMVb+1hk8NZn9TY3GLyxwC6oZPaAQCvfwCPEQW3xai59/vjxRTjfcoCVrXtM6FHkWYd4neBLQqu0i9Tl9ngu/4GPkaB9eYZTg/vDXG8r9jHQc/hYlTKq7fi+ITLhjwH3g3gO1Y43XR05MKZu90zyvG+Ct905TvpmSyidzHwbJsXTsQkZPIstcFGI/IZrHC65d639PC+f8C+K75fr5/uoFHLd05+5lZV9ZTvMJ/EcZo6Dgs7zX1/DvslT6itGtNAA75f1/8I4j2/795Vl1OiZwOag1K+u4keRKt6zlfHzMbzMjvhnBeWxRiLhv6XsT+5oDpjlsVF1wy2ATGM74EFlF/1oQTxft+++8qrKe7m2SVOavmuYTGx6qP5TrsgELZeKI55KlQIRTcUMvG7/evi2BYN74FoecfyVfAdeKecvm8JNEOFb+8H/fjOMt3RVp1Un9R/27tU973g9IrhTxyfCyAj+Y5Ntq9d7hTxfq95RvZmfDO30BzeFJ6JzDOEcNXJ2u+C438uv06/Db1GgRV81wTv93rf1TbOnGnzXIlVKd8jD8SDDPTvNQfOf4WxOUW83ymu+mQaXcP1UxH84UNh8cAKwAII/v0lRBLvDfHGmR+Af8bBH/4pDOAL8B0C31+jM3KvXTpDJHo/B/zhiYAmBN8hCHx/Qbz/1Tvjb4j9G4abj/FdNCoNPPgOge8vUVvdaxe++wRnCLG38Rb+8KGshlDUQAEEvhuvsNEufN+SPILhZjThD+oAD/8OmSj0z1xQqdUN72TaIm8Q/jBqRoEqwIPvkJHC+tUf2ua61VYpz/8MN+uP9zGIP7yvXfAdgmbjO+aLnWldNnrh3ae+PUu0Wb/9+zz0IrzIqcBmRZCJ+QzmR54XBf1cq9oqsbbIWy4+3HSQf/t4f///QPnDbf+uqFTsYP0qZCTfsb/Ht9f0W63Cd7rR+9V/3ajz8uv1x8e/z88+tDn8lEjflTVIWuA7ZCLfbezP9x2+U0xnGg0mEoyR67ohY5uN1Vn6c202Ks9ElqFBEjKQ7zH21/4K30mmM6220btWyRw2k4ZM5DvaI0/akExnWq2jd20UJvDvkHkKClzbp/C91GhHPr2idw1SI44GGgjlVXMN3JZiOtMYFb1TFhpoIBPLqwhxh9oqxXSmQfQuL4BHQAOZV17FlT2E7xTTmRbRu7Tnt7iGgYcMU43VTcer26eYzrSI3uUpRUADmSYP3e9005nc127gjM4BDfgOmWbfE1zXQmuK6cz18H2L6H0hvmfgO2RY/J7iuu7Dd4LpzA2842gtFdGhAx5CPGNk+F6W9NIZRO/SC6wAAmSUfY+xdxPVdKZF17tcuSlWOEFGCXt7HNOZkl5xNddmHz5jhBVOkFn2HYubVv1cAnr2PUfXu/wTASMkIZNUo7q6EkOBy1yD2qq/waFaOIDnWOEEmVRdRZzbh++tDnjHsUJAA0Ej7Dua34mmM2iLVHMuYAQNZFB1FZawT2da8q0zaIuUFNCggwYyprqaoB1DpDMlfbzjRixHmCEJmRPPYLRYv7IpJ453HxMJpAU0MPCQKXi3Yd9X65LcXLEc0bvCCitaJCFD0nfYd7GyiVpxtUU2AwMPQVPTd6xtWrlbcvb9ciQwlqxKNvBI4CGk7+YUVxvKeEffjPwWGg+Ah2DfTXgYJ1dcbX1kM6pbaBIsYoX0T9+BjtWWWm9ki5081Gd2jg3AQ7rbdyxdXTG/pLWrR4tshkSJFVMKINh3/e07sZWrF30z2HlF1X0fPTSQ5sVVjsuY0SquNpgFTKeHBoCHdBa25RP2nVJvZIPCKiXAI4KHNE5nClzDtOx7gxWrlGqsRQbAQ9oWVzMsmhHNM3Tsew7zTqvGCsBD+tp3LG2iZd9zJO/EFBYeAA/pad9jXL9i6WpOsi8S5h0OHoJQXJ10+Y6373mnplkW7zDvhACPLhpIR/uOTbX7wZGj7HvT+p3Kss1nJzySd6JFVssOMIoG0g3vGPsuBkf6oyYTfM2F8cu2Wapxmx6J7AAAIABJREFUBgtWiclJEMITBNj3r36pFl9/q3/ND12+rebFVXhEUV0dM5ngvHmxA3y+EN4xbYbcacIBeLUsPwK4+oZ2B7CT7G/FQjy9ouLK97h49def9Y7vths+o/+4StujjnRGaJR9v1h65M8I+O+39jc4KgRD+DQLQHhJrrw68rxnbI/awBPKsixJ+FGFJcR6neyQK746jXh6H776X/fvJd61/4AkybLuM4PhL9GDXqfjj3SmP6hj7HtzuaGSP1tEk6OuSv1M6S08CL+YN/925R1W7SRJOmstPLbTKXTDXjIPuPg8l3UfnqZxnCQd6nc96zU5B5DOCK1H2PdLvM+YwX9t5oFZYnQVOjEs/DwOvRoykKoKOpzbnp1lPO1MeWFFUXTmyAk9v7HIKniaZCLFEX6euJlHOtMfte0I+96WV5TPiXdEM9RTeBuEf7IQ+uXRhT/POn/OY25ZnT2O3HGZitp7vBs5VsoTWwQ3hK080pnBvrfT8D7LZIMcw2Z0ubxB+LHBi7C6wqPbtih7FoXTOfRI9waCMIqclNt0KY90pj9M28eXNl1udz047hkCmnYI3tE1o0VIwz0Q/l78cgT7zssSzvsyqEYW/fGKjMuElRenAzXEI50Z7Hv+fPg+JPDNTHjHDVeXy9qCh79t1kWvi53Eceo4UfgKjiXsnHw8GHmkM6Qu1GhyOjNDAA+6a5nSeDUQPzQzijppH6pnnBdOxF7wOZSxgmdeUBE5JzB3puf7mHSmXIbvDZar6nlBO4noh69e3qt7SRJzy3GYG762Z3Q7H5/0t331JwWmAgttJ6czk/meg+76mvhURK/1q1n13XG9aJymfakUJ8IF4+M+qlF5oOoER2IlBovl09OZaXwXbwu66474ylQbX50tPdp5Xr94dCiW/sfelXApqqvBblkkuAVFAkcei/7///gS0F7utJJAwBCqvMfpO+30sSUpKvVtuPjPEAqr5p1Hu3KFRA1xwlYw35+7M0NGg1xRrWoDxe8MC67pKCatWqH+yGp0nKmLR+e/KN6m4pEaqUrvL9yZAfx+5OyO460Viq3l+LLpSDXLYtKyurdZacKkm6a/CyEEy3MIxR/e4t5VmKj90cRW/6dDvvu33uIdCe8WLaeAOLvN1vMuhncoKX9r9Gp9WTfGy/ZeTCoaveBy6lkT5LSZvlQCI/kaKKTOvJTvffn9Bu1uoZAPyYnLttXq0WNWKGMD7JbLo61u2bTU9Va/i0nbhQhPfZST3Wpiikdq5IdaZuTL4GrP8OoROTP2ri3XFV1mmwazXiPoq+rX/IhyPF3+c9DFox1j01d32/TV3YtSUoe4LgKk0/nAzm7KxtJrpEaq0vur4Gov+/0Kdrd8fbUdxUVMkjindoxEMz9CDJC4XH5MEGoE/l8zhP6JeP58xXf/xa9RF60wv0vz+4CLU1NCisjom9H2LJrIiUdfAlV6fxlc7dFe7IqMyKXu83Z+xP60uw+QWB0aeC0uzWP9zxi5x3e8x4wLgc32e9KF8zXoAmdzMwlH5NFOwfDIfFem99fujLI9c0UnAuCL8Vu43widfxD++PZ9ygUE+ewQOpsJpsMg8/1DLbTaJd8V7ZnrGewOAItl+HE1PDLfFRMjH+2/9Mj3I0VUCwCg4ZH5PhaIYkLjTZt8v2E2EwAsnOG33mi5NOj5rk7vr90Z+R92jRH6AgAw/H6s2QEobNJN77Ly/QrpDgCAgEt2h1E602Ckh8q4JhnzXcp9vx5RqAoAwAPBKCaNh9gq9RWzXW5D5fv1WOBjBwDgl42wX601E/z6c/EHI+m8yOvxdjter8dimHzntweKfFQAAP4r4T+3ml34xcdWXUnrnbOyz1F04uXP47cIH+QOAMDfEn6n06Opdov/POXo/VhIMPud368vuN1HIRMAAE8R7lfaCL7cLj22KjeL71go4K/7xZVze+GfKcgdAICXhoKjjeAPS3cKqIz1fvRV6L34k9q5cIctAwDAdATvLVy9u+ebZu3+M3eGE/vx1pr2/jkCuQMAIMVLe69E15nBCCW8masiuxe3q+B1QexFS+1cuCPP3bgdhEsCGMxMOw1pkkvvOhN1Z71fC79QRsvq7RdnSlA9ZiAYA8ED5sIZLuDXC8+MlGgXeevB7t8cD243FrROYhhmgLkCfjW0YXC57MzIoNubOQ6g9nMEbjcXpM7rNMIFAoylp816aFOxRS/vqDNv5tqb2mkIaWj25knzPK8ZclUBY3Eaxu/lspuKdefN3FQN90Iwe0RA7eYjrgW/1zEIHrCT38tFj1vtzpu5ShN7IRT7mVIS4Lg/H3dGoE7Qeh8wlt+rQep9yTKTFlrEu89ZPQoJfPY5ujMNwWeoOANs1O9LbgkcnI864qo+dT/EA5idO5M/UKcgeMA+/b5keu9OepeS7jjZzxVh8s3vNUMSDWAkdhXKVnugM7AqI959BOZmC5fl+U+Cp/hIAANdhlUJelcGKbSIdyy/+YLW+W+Ch4IHDDxl9ub3Bc9r6hbvPsS75booyX+DEzw+FcA0OL3Dq4t1jokO572AeJ814jwHwQPGo7f9vlj1rsV5LyiW3qzv8fW//A6LBjDOnjn0s2fWS20Z2Zk2I1XR5EPqzdudYfkf4ASPdCjAAntmqR2BAz3i3Ue29Mzv8nX+J8Gn6NAPGGXPlKB3jeJdynkvzqD3mZ96kzx/RvC4toAxIB7oXX5X+3oKVmOsu5kjrvNnBJ+h2Rgwb/m+UHo/F1rEO7Le7ZXvIsiagOABQ+D2Gd60THonesR74VMsu7nvGpa/gChlRRoNYAL2JRIj5ba0tj7vEHfzv9XX+WuCT5FGAxgh30HvUqC+piFNqFm1AC/lOxrCA6agR23TEpsSEF+XeAe927Ac8ryb4FHqZL86bvDhkgbR/UHEHIf2O29fqB5aikngrG3C6hl73oJtneYSBI9MeDsvfsgRUY6YsTQTSATq+0NA/GXK0li8KuIvf598L9HvvRNRZ1xVesIq6N0G0DqXAfJoLBLqQRRFccxiQeb83t0iF4+/r734j79CEH6asZhGUTB9WYRy6Wq5PHoPu+OqsuId9G4FgjSXQ41uBXO/1IRL9ThO0+zB6D3Q/ksu6GMaTjqB01VuDLxa3HLttmakOgEjL3Jx8r0tZoWEnyWvc7lOGcuSRoTnWiBIPmGMksl0vGpuZLmFNdNfvIPeLTmrp0qbmsGFn9PFDUnE9XrSW6x3cnyesHiaU51qcLVcLcxekLBmJEuaQO8W3fNrtR2dxEikmQWxUyoE+yi8/h+OFxQ/uopXdWfKzeKsmU52lw6soqrJGjDl/czP5PjYzPViSERjlrTh0olQ1+noDH9STH3fL+uyd49oUhDvaAdsz7qo1TdzgjirkcweRpQ1Xkw+Oeo6G5fhiVruTLUseg/OR53i3cf2tka+1302M6qdzHJjguhuxuRvg9Dw46XTKLozC6tqot3Gu3xgFf0ibZLvibEHckDOjqFx+l5mn6JNkVrujLeopRl250QqiXfQuz2I6wFyDae491K7EO1GMPvobYrUKpsOi6J3GWvmf4U8KHaWPRSRDJFryJV8m2SL7iFUwzASwQce0t6fHcBl2P2oQO+Yo22TcVcP282c4eHSgNpHJnh3o+DOVLsl6TMJ411JvKNfpFVIB2/nlIaItE5myDTUnpuMMQh+r5Ia6SxoQURXzeIdeZF2rY9aw35GpHU6ajeb2+8LQvdA9s81Emf+PNbIWDMKgVU0FLMNsQ6+QC7NyNuYNGHUfC6oU70Wbughcaa3eL+qiHckztiFMNG0o5uKJ9z7R5HtWT0jbm+XA9Pq0Mhnvi8psuredIt3dJyxDVQbcQiGn7CT4CKoPTQt+/E9Al5+pseSalajo2bxjsiqfQzCtO5qYdMgX1KXbE+TCfvH6Cb4WN+dXiG2uhyCcgvdgVW0JLAPJNG8revJesXabJpxbp8tsz8EvDaqlW874y1n4cm0I1AU77DeYc/IiXgWwafpz+3G5z9KIdFl5UoXNpUbhfBPEDrO/g6HBDNbru5Zd0kTalatPOSxUbRb49OA4tXhxGly79def+Fr/OkiDZpgJUvvkkVNbnjarbx1xVFy8D8u3mG7/5zRciVS3sxNSb2jZhX2jBLFZzEKW1Uvh0DYIKKUxg1SgSzL6pb4B0xNnTiDRs/F35Y6s94Jp3bO65f2h349V9Xa2zhzWa1n7d4Mippgz/SheEaRFa98puLgz1/6lUP8FXEigZjxR8YSgfyL6mtr+X1Xact6d53tmkv2J+q/XHu7WURnQ/+oW7yjqMlOBGzkPd6GW+HUaN/jDahAzBhX90lyt3TMIfhMB1vudVnv4WlVvb5VlNV6OwOCpxJDmlTFO8WOspMmkvFlHKf4VMh4cPx4cj8gJPqMWjPnS9a/merrRIOj+ymZ9e50KfdDJWHzzIHgpbyZm4+sd0BL7xlpjo9pRFyDOLFxQawj+yAIQodGlDGW3Zn+bQk0w/ldMjOyIy3SWVWSHn7l7c3OsJTyZtTEe3GG8rIV8XSbX3B8xmIavrOHQdCGLVmLmLaIgjC0LxLMNT3/bYWiz94i5zXod7muM+Xq5R1v78k3Fi6rldGtJ88y3swR3gzQUgCbdsff/Xgu5IOJST4IRGSymWH3nYLSIqnzJOHHCxbHURSFrmVE7wYuiYSez5KJe08mQ4/9cvNW16dXB4BNpTSSu1zvzT3VBVLejJp4hzdjsXM7gf3+l47nQj6NhZIPp/gdQ0pZK2G73hZ/yrJUyHoL5bzbpFzyTyKZSMvXaTAJvb8gKOKpsbtwaLbGXvnIl6D3o4+8GeCxYt7kzbYKOkkZi6ORageDgAjFrshmj7KiJGNMnDLsY3n+sdD7QWbsqzwwP9I9DPRmTuvyooxqZaqglfJmbvBmgHfY7880c0PzsbBsCHE/hqkJ/q9D/mNo/OXE1EPeWi7eWUQsbGkSBILkR25MWbNhb1KmZ2T13JvZ92F3/hMPZvJ74Be6nXd4M7b7M8yIbOnWGkmEZm5CnlGoEO9sXhre88CzLGmOBvreWS5iwpGVZbghvxGyEc2aepg43JdD8mZ260s/lJ6RpCflzdyQNwP83OFpbhIe5ogIdzaivkUUfUa/0WZ6C2TpzzLOeqS7j8jttLNEKyBRnI3UzayORqb355M89uXlYhW/nyXSIhWzIuHNWA+SGdy95GeRzs90l1//P90Jw9rxg27Y9JnX/1EOSp+R6PheOk+dmcvFKn4PfYl2YoriHa3e7UeU5IA0xWexrXalG9JYO8PX6YBgyqnq7c041WUISvP8dyrhzaiKd7R6XwBoDd5WYXhmbzxKDIvSzPDxmPT+rBcw8cpB9H6pNqYd02S8GcWsyOINvYDJZnLsmub+p9OJBME7Q2gj/OpSTBSD39UKMm22LJuxImbY7866Z9J7eBjI7pzfd4ZdljG8mTckvX82rfanfKra3v4c64vnHVbb3W7/6YTTdyVpfvX7G9PwLL6QKrI2JH1mRgTPrDYtQ60Svn91U9id9P73Ht0OZnd+5/iENzMGx12+++1P8fTrC/5VQ/Xlev1/9s5FS1EcCMPIRZIICipejrOC+v7vuAS1u1UuSSgkCVU9Z2dOb/cMDeTj569KVeAu4s3sqy1SZn/nDPT8b/V7Hor10CDId1lL2e6CYQIo4S9bfyi8NxS9e2F/upePDp3sGV/Em7kZUPQ+O+kRlaQvIR/F3rcMG/gfXRDvyHf5khDbZ5hRMAmvbM+wUCmxyoIcBAA62TNEwJuRFO/jNCTQBe9PMc8Zv4qX36h5Hg/vyHeFLTu2t+sAk/CqzQm68N4A4DgHWjwavaGJ7GmSTKyOU/SuFd6fQr5kvBsPPpFxRLw75Ih8/5bpYJILDwH4SzIM3uv5S0OoZa9R9Uwi4M1IivdxhqxqiPcn44PFktqKd9TvCgnWCWzpJgmAR3MkQ+C9iAbLq4rNgdLLm1kbsWNVV7zf+/0H7oATXUbFO+p3haKQKXRkAvBoLtsh8D6weO+aFKKbN3MzopuYzni/a/hoKJdmXLyjfscCmsY0a0/Aq/UmaMd7Q1XkIgdcPrpcXoG6GenEqoN4byC8G1ML8Y58/xa3TDThe73bqcn3drzXWyckgFzqmhTPkEzAm5FMrKaI9xaTJvLswzvyHfne5tH0MOGVTlMr3hvq0jc55PoJ9MiuUIFW7yZURRqC97uE93zb8I58R743h5+qezRK8r0d78va73FB8a5JclVgy6rsjtWxtm2YgXd+6UNowI+Pd+Q78n0YE16leKYN7w3inQWwKk4Ld8YXGMNnSitgY/DOPZqIWoZ3h2B/MeT7AIC/JLB4L+rFe89GwB+hRWcC2l0WacwcD4Pwzvv+x8wuvGN/YOR7B3QTpSyrQmcxJt8RJgbGuxa1MwLezNqUOR5G4f3ELXjL8O4kRyQ21ke2veElB3nAK3SeYdLi3V/psICgQ6As8mbKHA+z8M67MkbMLrw77IACXpLvExtJrAL4vQ+H96ZOwL4LnWDTwHxn8N4MRbyLF9EEnl14dygmWAdn1+QAv5NWQc2NfZsqWgC3rD4WdzT+qRbYsipX9D7mED7j8M4dmphYhXcc4CRf+Dc1vksDXr42snEYX2Mvdg8a76fV+O9l3d6MOeLdRLyXasJlduEdB2x/oTJkYoCXdrAa8d6Y8IRfQeNvbPIzYG9m1AnaRuL9lK88u/COBs3wqUMbAC9RRSN9hpYNeC8iZ0J4p93ejGTRO0W8y5dIzuzCu8PQoJHbuMOcKQJevA5e2p1pwnvQyKc4tw/vCbQ3M6Z4NxXvJUqXduHdcVKsoMHymW51KQx42RO0zGW3ki4K8CU09kUV8GbWhmxpMhrv/YuodMM7GjTD91WxAvCCzcZk3Zl6LZ63COq4sE69M2BvZp4RxLsSS4vYtwvv5ZshCni037sVZiqkAySff/6i/p7eOFNS7ymwNzOueDcY7731u4Z4d9j+HwJeuDaEOZMFvIgOkNsd4Nd2f2wdobSxz3vvbicmVfQ+sng3Gu+ncGYb3tGBl5Hve2eyITJ1W25nUy3e2/cQ2lc542dn0E7vI4t3s/Her35GT7zLFEegPeNMGPDdDk3aH+/xd1fQ2NuaKKw3M7Z4NxvvJd+pdXgXWrgYijvvbYquFz05850Gdeur1d8B37Xa1Nzmi9b7FTSxOrJ4NxzvzfulTca7oLWKMd3qGbEXvYMMLOtY3XFDw/ecGbulGKw3M7p4Nx3vp3xhId55l290aITkezppvnfU0kq93NSwuqvDlx8AL6CxO0aSzrLItVHi3Xi8txZumYt3sdwZhpxAtTBaX/SkchOzGmuGKdj1uiwgNeu905uZmyTezce7+oQXvfEuvn0Fs6uTjpZMjZR39Vnl2L0x3LZpTZ3ezNWIAdo24V3Zftcd746TIuCx+F3gNml8z5OpHP1AddHdfB181uq4F9PPIL2ZUVtFWoP3U7GxFe8OSbGIpku+J5PHe7OAlzHfo3f1HnR/M4PNrfZIpMGcx86yyJshfd4twrvIfWgo3u8b0JHwWBzZJeDrOwVLnBv/He+FwM1MYM33fDnyWexqJ3Y1plWkRXhXfOgbgfe7gkfAo3zvTNT029hEViqLCrYlcDDyk7rbm5mbJd6twLtiRsYQvGOSFeW7CJ7r5gVI5FbJa5FjvhI6q6CV72N7MwTSm9HBebcE72oTeM3Bu0yXb5TvkzVoakokxfH+ZqOLtnMCdWfGLouE9Ga0EO924F2tt5hJeC/vveSAEr4+jj6yvVKfnwaN+LaA102rwvuLIGtnxm44kwDWzegh3i3Bu5J8Nwvvpb5CEx5r3zsAdVF+8r3MaiqEi40Bk6vF6B0JIL0Zgngf1303De/8/Rs9mjq87xHszxvkqJqXeEmSSnTqW0LJ93zkoneHzeG8mfHbEViFd5WsjIF4581o0KP5TK5SBPvTw3s14IVfbPxFrnYfg8n3sasinfQM6M0wxDtoTRWdBt7LhUi3SPgem+9t5/uLAS+O9z+UlnNJNgWQeB85g+InHd7M9WaceLcG7wrPfkPxXrnw2x0SHhuL1WPqhe+ieGfBn2YEckP8FiDyvd/kNYjzlsF5MxlBvMPiXX6Ml7l45yIt2aMN/ytS0Z35w6k/FfDC7zW/Bey57OYiEgDwffS8qsPOYHua5trk+m3Bu8LT32i8l6uYccIj4tGd+eDtL9+FT8xvXaT8QgKwZ/qM5QGKzrJIiaJIH/EOHfHE8I4aHt2ZRhtZGu+//SIVGvT1bk3Qa6gmUMB5M/qId4vwLt2wwgK883dK1PBYO/MR6UVy2+qzoZiaSbLoqd+D2ehnrNObuRm2o8kyvEu/VNqBd15Kg5nWfwki/SUe/ozoloBnQzFFk4T1q44slho8EOG8GYZ4HyC5Gk8U79XyTLeHSSMedzbV+++C6v0xNVXZAmeuun7Px0+rOt1bVq8mineL8H6SvTVtwjtf0CzdHy5TRfyRINJfb4e9TFeCe2a1hwWuzvdcfVoypDfTtWX1Zlg7AuvwLtuYwDK8Oz4X8VN14rE08uN2qOrfBWcVenlfC5wp+u+5Br47PwE3KPGulU1oEd5ldzbZhvcfnybZHyen4i9ovr8HPYo3nalqX/pZ4CQuchW66/FcBvNmMoJ4HySKCPH+B/HcqJkO47HyvSZbeBFW7zw1WsQ9q0s38vub8oUedCdg3oxeb5EW4V22X7TFeH948Vvu1BiA+EsVz9+w8h0qthdB9c5bEgAkOGkkJ+CLYDnsCmBp8hke4/H6pQmQN6PRjibr8B4yxPurF+8wmmwPR311PD+y42G/3ZbLrlqL2+1e7Xgxt1rDt6Mg3mkoX3hWe8stA3HA50U0oNSlSZbNz/O6OPNPZ1mWpCklFY5JlzezNmpGk6V49xDvdYucpA8df9EL7P92JdhT6pOXJ9Lv8cr9fTjTo86eOQg99TZFATTnlMVigM/zwh1ytll2x3j18cLf+f1zP6zPtgklyRnGm9Err2oZ3iVzq1PB+2PdsYQLeQ0oz49gd9wnCWUt7OHW0lHiUBHvdWr6cBTLrBYrsL04IoDPi9D1BnzdonPR9l8V6LM5lDfDEO/D4X3hI97blzuhKbc/dv187h4G++5w2G7TlPkCl8pnqYSIT5DmNfJdaLuXv1pBcokt3bDI82a250FMh/So6Vxm5jWX9GuYZpHaSQyb8H5yEe+Cdg3z0mS/P5Zi/t/glK+yprtSr2/TxCNEbl2TRHDALJbO1J8+IRwugFWnTzeLICzeGZ/nJdpDN54NmychmQzeq4DxZjIf8T5gyNXQThfvvzqLUlZlM+/pTDBF/1MJc7znTVNG2dNal0eF0IBZxHs96oS+aAhPgc3iaMUZX0Kec70owiBwY48OngOXp3sH3q/GdYq0Eu8h4l1Vzvs05QnNUtEfdrvd00p5wP7Cf/GPV6DeP3X5Y73wry+//XAs/6Jt+RemxCcAioYPmO3kO+Jdw/vKp57nzarwSrB/pboplad7B97X5jWbsRHvpxnivT9Lq3jUCG8PpbI/HB+xe4nnZw/l1+y3j2+ovhl+FZO0E/BYGaltxqeKr/1rmTzdzzeAZpFzingfdt/qBvE+yNLkq9PnnYf/fNDqUz//e3Ah2AH4y44hSDEcJ1EQ7+3yfW1mUaR9eI8R7xaLwPTYBnjEOwZ/+VSi+3ndN7E6n+v49mgV3nPEu91WbtKSZEW8YyiL9zZ35mpqXtU6vEfj/uiI98G1WXMVDeIdQ1m8n1taiol5M5mWp8Ou1KpUUzHEu4mR7i+Idwxg8X5u2bd6MzWvinhHvFvj0CDeMZTFe0ty9WpqUaR9eA8Q7xMIWivgEe8YyuK9Rb7fjGw2g3hHvJvr0NQIeMQ7hq8u3pvc96uxRZGId8S7PQL+gHjHx34PvDcUzwglVjNdt9Qh3hHvJgbZvrdI2OO4psmL96wH3c+1bSOv5hZF2of3E+J9sgYN9pzBd7o+4r0+u2q2eEf1jni3w6DBjpEYH60i76P3Hn+Yd834qMuuGlwUiep9BLwT3mzd25QfrPwjQUcByKD5At59fsFIeeX4r+rPI/zMZdA/9w/2Uftzbt7n7p1v6/X1Huv1+na7/QG+mD0jNMcjcxDvqN59OovjKAiCU1FFeAqClRvFmxnFRdrfoBnQ//RZdencVXntTuHPxQtWURQvZ/Qrj+j7MVSHcD+C4lQdQnkDxTPKUCa8V0XOb+tPs6Xk/APyQny/Gi7eUb1/B++MLhdumBdFfuIfjx4Kp8eYg9BdLGdY+KHC958uYwPNWvWZV165gF86fu1eLh6fB13kYVBePW9QvhK2jO/HkFf/8tshFKfHMUxbJbwlVpubhN0ZX4v4N77f5kY771/Hez5F9c68KGgbPlnNjQ+DaENRg8kGe7YJ3g2goYhXUrWaNtR6T3PE8jlEwyxzfhCfc+3el1V1DKtoOeEXwdfEasf01IrxlYHTUh5pcreZofEe1sTpVBT5tPBOvEUg9EOX6zN0Y9Twsnx/JFgP0I9GtuTjQoXvVv6AXiyhL99DGQgfA7+Fpvoe+OLN3P4TiArx7yr+dpWju4YTVr+A93BDP2I2q9zncDDEa4d3FrsyD7S8CBYzNOLlCHhPsMKWvVcP5VzyNs355QPU8L4XB9JyqHrMeN+5h5auG4H+chc9Dvylbub6n2Bcr5VR88efOd+qfOxacH62tjtWh8W7x0cnv348lg7duAMRXrOWYrOF9M/5P3vntq4oDkRh5QwKKvS+8tMw8P7vOLpP4jZBklTlQCpzMxfdrUj4WVm1Urmt9A8dSXipcef7f5APWVnLs/1B+BrGJro9JYpf4rZEhvoS82P/dUo24Dho4P0oK94fiG+fCP/1v9nSEP0pVLyLdcntAWJrx/s2ytUQ0acNAV6S73CV1Ztw1xIfN/m811bPyecbRudLmJDwe+hnWAvvJxXx/vDZb4RX2wx1JLyI2kt0AAAgAElEQVRz1tR1Dg54tk+cwbsq3L8ezkOH8Gxu9+BjXiNWpj7wH9hJq0kT6S8se937p/mG+V5HoC8DwfF+1sH7pLQ6XlRGq9bLIEjvnb3d4hODC3h3DuO7PZ9aF8f6CH4HbNODj/kvuYX/QMFh6f9gNjUVEHD/vn+NKqkS3ckzVQlVOHg/6eL9MhLeAXdwgvPdlaO0IVYmfQ+eojG+TXebQ39g34gWChA/UBzBlYRugO+UnvtqlwN+iUOXeIR3BqPes/ZiUL4HGYxcskE/ToFnR+cC7YoG5rXVpzHhfSneIWqZe9h6/w3wW3m4AxelGItif/Cupd43Otb78g4z3hzlYR3vmxp2fuRbB2hXRgzoqlhegzrwjf94z9HwXtRpD25Q5ju5R7/oUvBIGev3ZRB4n5zloYp3NXemJLwL7kgEOkHy0jreC9CKcR+VTt/r9aj3+NBjPAUslTFHygglL9ynXREC3h9NCRTprujOEN6FghJ0gqSVbdrdHlDgJ3MLdquTFeAdSb1jxLh+HZrSpy/hsfdefGhWVhXdGZf3NVlMznxOaUj3nUW2xewOPgyUwgFtBeYMjnpHku4/Ds0y7RynmF8i7XzA+xkE75ki3oehJbyDqndQd0YuF4lx6ShL69rde70K9Z50OW6nuyXaGU+6/zrwVSh4l1fvv32C1aIzCeHdQHG1j924dFf5Tt67IDCDfgffZqDiCP9LHGLCO4fr7dtTPt6p94zwbsJ8l6us+tPqHorvlJzh0f3Q499B1s9moApk6f7jEjWu413Le3+0jBwlwH7VAHvAh/EtlNJNb+3V789JJkB8J/X+OrqUmbmFkdgbqSIz3wE6aOta7n0Z3ofHiU3aYP/G+yk8vC9U7x0c3iWtd58OqgLhOyVnOOoiZ4ZuIRMaNHFq7Dv0+yRcvA8TJ+YKOo6Ed3y8991q8Q6jWik582KKnJmxW8jyhsfWwtwb5gy9kcIXvA+Tc7SByf7VdYbwju+9p9V68X6GyL+Tev9D1l1v8hayfPfK98Tsdzj3h9JhvCN57y0S190/bdVy7h0wOSOZevcM7ywtCe+w6t0w3e/f/sUbKSPm4UTyTr1fcYe7XWfWk3tnzZrxfltWa0sESs7Ypfud789s3abmvwMg311tSmAc7yfCOz80ALdrVdab8QzvZ7YrnLvXHqv3Iuot3MRnb6TLmY2JBMZ3X3Lv6Hg/Et6RASDtzfiGd+nSMSVnHNPuX+7yg611z+x8Byi+e9NzBhnv7u5btYx3uAki/+D7hvez7lNJyRnrdJ+wtaqZrYmkV8F0Xr2/9pwZkdW7s7VVu3gv4Z5/aW/GP7yzKHHsXvuq3u3R/Zfv1aG3OJP2xfrw/uj3bhrv7u5btZqcKQALq/Vm9XiXrx6T984HQd3bvIt3vlcRszmT+l2xPvWeCdV7G2pt1ap6B3zK8jIAvGvaM5Sc+Slp9lbv4o3vlukOtA/a1bNWX/COXVt1dt+qTbw3cE8/2yUh4J1ppSNJvX+NOLd9G1PbdId5Ubql3k9XoXof0M13wvvftRTkCjnfbkLAu2zPY0rOcMO41tl6duAb5OXK8H4U4/3SZsjRmSIwvL8DEWiHa/lUpKd4V6ggU3LmD90P7Ezj/sxU68L7h9h7x0++F6TeJ0Iy3oNmfvM4FLzreKak3u+Lxj3R/XsqabePdMp7Lx4CndMxcvg6sSMLLDpjAe9FWQOfCK8k3v3Eu458J+8dtpzvPd+bNan34yzeJ10jQ9q3ahTvVVnF9S7NoXfrqdmIfuKdqct3Ss44UFZ1SiqU68H7Y8/q3FHa96M8MBAfHN6fc+/Vbn8b6Y3sPQOfE2y3CQfvGvKd1DsZ788Pzn49eJ+I92v75hy+G+IlCf/VUXjmLznalsCQei9z9gl2lIdLUYR4indl+U7Jmc1mR3TXrlk56b1XU/K2C45avYv4xXC/Xsf2ftZTK/xLgeM9xZujqtVGT/GuLt8pOUPWzB+cptU61PvEmrmN4bJkDAs1fHYdH/9gO2Y+tXz3H+/KW318xbtyeCZ49V6lRHSgueQY3qfWzPxJ2i8uzVu8j8OC/jWORmf8x7vy9gxf8X52533mmXqn1AyUsekY3k9TSGftZfkY3gE+G4dFW6QI747pD2/xrrp1NfTkTEnWzOtc2ruEd0Xv/cl4z8aL1HgH+NeXxehPdMZQcgYN7xpdWLzFO1PcjxK4ei8iqqtK30Iv1PtHJu+8Lwb8sGgLbGh4N6TendrlY+yRVFoJhp6c6cia4WmFXeI73o+zXsoywIv5zvnjHHuG8I6ytuw2AeJdse972MmZguqqsLUrV/A+Lauq0f2zI7wA8NwdsN4kI/3Gu9bx0v7iXXENG7Z6b8ia4T9DtTt4V/Hey0zdd18g4Ln/4uhLUzFDHSNx8K53Op3HeHelC4NH6r0k8Q7ub7qg3p/o3l40Rrsc7y1nW2tB6h2Y7no9MzzGu5riCjo5U5N4B5fvDuC9lNytKs13Lt557gx5707R3We8q7kzIat3Eu8z8r3wFu/FRwZGd0FXeO6f9GVfk794Z5oNM7zGu4o7E3RyhnY0Ifyo1r13WLrz9Xu7zHzP4qDwjp57z7tNuHhXys4EnJyh2MxsCctT9f5E9+ECMDj1VW4Wh4P3E6l3J4psq8C7G6cPeqPeKTYDvRZ0Ae/gdOe6LuOi5Dvh3S26e413pbhDuN57QW3eZ3/V2ku8H+HpzrNneFl6wjsq3gHo7jfeVQoP4SZnqBHwm7Vg4Qbepbx3DLrz5Ps1e/XfOW8BwrtTdPcb7ypptnDVO53iAS8WbKv3I1RVdfgas/1+/wp4wjsi3kHo7jne5Xd0hZucoT7vCGLBMt5jELp/Hr36TfD7gUzDIDrSYyC8P80YNLyzvtsEj3cV8z3Y5AwVViFNESfwPukBrL5X9enM1ezN0U3DG7wfSb2DTMU03hDeVdIOoap36gT8/netnMD74tcMBN2HUeY87Wf9zulK8EF4B6F7uSG8K+nYUL13Osbj/VPVeKXey0kkcgTuISY+lI/wjo53FpUbwruaXRpqcqahHatvZ9POJ7xXNuj+ZM9wOr6HZc7gdIzs98WG8P455Guroar3PXkzGKUce3iH2M4kT/epC8TBOyVn9Cdhk2wI74oPZKjJGcrNLPlht95478m/qz7dh6vCmH05EN61tdvOi0s39EBKu1SBJmfIm8Hx+myp9w+I0Iy8eH8KYI6Ue8dQ71FM5szP2Nq/YC/UO3V6X1TTSjzB+2Q7k8bhTCrifeLzB99SDCf3ztghTgjvn6MJEO8K6j0hb2aRcir8wPspe9eLHc2bmVhBV+oYiRSMzKNtQnhX6QMVZnKGYpEQt9IV7/3pdKbBFt45fz2wfu854q7VCETBe453tif1vuilRt7MounU+KDeK6jzO65a7gzhHbPnDMt3ZfB4lz64LNDkDLUTQ1ILFvA+Pb9Dw3hXLa3O4f2aEN4BAV8XoeNd2i0NMjmTUEeCZU+UQm3VON6f6K7VBFjPneF1hSe8gz7oUUd4p+QMpd7BplNpH+9vvPdpD2Ddo1XV5PsM3oug8I5+1irrd1XQeD+X4eFdXr1vqbK68F5Wrqv3aVk10z04e9BJvnNykR+k3qEBr7eJ1Xe8S58lHmRypqNNTQtH7Djei48rRCZSy55phZXV44bwDs13LQfed7xLK9kg1XtNeF/409Zu4z05wmQiJ3zPFGurhHcjeL9nJMtg8S4bZQsyOZNQcGbpdNrbx/uc936CtGZU/ZlR1FDMzV1NvnWM5Bg0HeGdkjPiFf2BwA3he1tX7xWsNaPIdzHeS1Lvbhk03uO9tn7BHnjvFJxZOtLEZbxDWzPCCMwCvHMairlZWfUf7/c+kkWYeN8lweFdWr1TS4LleK8cxnuRCc5NMmvAj6KirJNnNa0C72cWFYR3Ss5wR0x4B7qZdr33YwZuzagE4Ee/Kqse596f+F6GiPeI1Pv6NzcYxPvWXfX+FIpsQfEuJeBHkaMTk3pH9GfSmNQ7JWeMXPN6h8N4n+5oGi/AQ6LC2grakWUV4R0TdQp89/7Jj8IzZ6TVO+ZZHqz/HMxI9JKhf5r8gU3m8H7MEOqq0wprtly9c633hPCOq9/L4NR7gOaMtPeOF3vv86hu4i5u6ijtsQnP+vT2YfdP20dYH8Z21vEu9N4/gBpFagr4zw9v/bHeV4P328wo3cI7+/yP8G5Xve+xWJjvyx8UJWWT4vK9P3S/q/8iRuqBKb+vyZh6rzKkuqpsRHLkxyId3dS0IrzL52cQ8X5bSefpbeSoS/eIkjO28P7XDCwj1N4Hz1s7EpxGCw7j/QS8X1W5wjryvRk320WuJTnzs7gsHMF7n+66srqPuNmlPdr7jNS7JbyzFyuwQGwr/3rROBUF6XyxKbw/cjM41sxig+b+8Tzx7mjqfU3qXbopEtals7ye1tErrJW7LN6D7DmDg3dOs07EfdmchBRGSYEdKts/rsB7n+Rm2gviWGDAD1zxfiK8GxhyLXKRLv01hF/i1PcYJWcs4Z1bhGywVmm8Y1tQDilJK0fV+29uBlO8C5rJLKq4VoR3I3wvrV86rwSQ4GhISs5YwjuXgwXSFO87U4kgZ/H+YUa8K5/h9FEEh/feBt6ZTNc7nEvnBjRRnFny3i3hXRAQr5HWaHy/AqHZQu4o3ie5mcvFQb47G4tcm3qX2pqBcul8rYXS+oRRcsYO3gVrRJz2NoIXGoZgSB313h97mlp0vF9UvJmS8G4G7zJ9kTAuXYTcBOFpJPVuB+9sz//dcdwZ0XY9jPeWm+o9eeRmBny8K5zR5+qW1RXiXSL9jnLpIt5hrNwpOWMF76JXDMrBUMLGQg3Ch7kZjCwMejP8XUveejNryr1/P3y1zUsXrm9LMmfWot6F9XuM3UbCI7kwrKCtk3h/nMI3msB7uyJvZnXqXcKeQbh0cdsOhJU79Zyxg3dh+T7GmM2luQnVd7Z/XK73btR6V3Df3c3NrBHvLLJ36WLcIZjv5L1bwbt47z5GmiUVHl8Ef4hs3rmo3h/W+3W4OOjOuOzNrBDvf2who5c+kz1AWLlTcsYK3oXuH8YkF95jBL3QO4n3yUkeRuguW1x12ZtZJd4Xht/hL31OT3e9yU8j9Y5nzggdaoSw4kzQtw4E76VZ610W7+72m1kp3pdOUwS871x5mVByBo1AM9eMIKhrg8vB3Env/XQ11JFAzXx32ptZX3Jm1rDEBu5MagfemKXkjB28lybrK51BvDup3pNHw5nWEN7HdfSbWat6XyhDEC69+Z+9c9tOHAeiqDC+gyFxhqdeQV72///jcEmAJIBlIclVpaN+mYfuNRjjzeZUqRQS75g5MwuBsofvuo/G90XAtI9mOBO6cWYa3mlnMzLxbpa+e7D3J7RzP+MP2bt8vBeL6O093DwxK7y/A++h8W62QSMw7Zz/csfMGTI7b75I1ARMgjzsayKZvV/3rOY9QbxTbnpX0iZGTiJfWLyn8+Md9u4X7x4GBTzBu/u7SdLeaeOddmFVrL2bDH7njnfMnJGP9wx4zwPvapqG9xp4nwHvJoOBo7N3dM4A7/yy931wexdTWBWLd5PeSIQzsHcn8bA/vOugeKeZve9D23svprAqtO/9n9FgMeAd9g57h72/gvcU9j4L3g3Smdiyd3TOsMO7Bt6v9h5qW1MrprAqF+8G6QzsHfYOe6dv76G3NbW5lMKqYLyPpzOx4R2dM8jeWWfvLbXGGeqFVcF4Hz+1CZ0zsHfYO6PsnRreyRdWBeN9HH7RZe+wd2Tv/LL3a1QyEKusEt+xKrlzxmBnE7J32Dvsnby908U7+cKqYHsfFz2EM7B3ZO/ks3eyeM9L4H0+vI+2RsLeYe+wd0bhTJh9Ta2UHash8d7dWfq45gvfMXMG9o7snTre1S4nivc6Zrz/nBhZbtbNZv3zT7PdJllW6M4T4rMa9o7OGdg7c7xfj/MI0xnZCpL3UPZ+n3iHVS83TVL4IfwCeEfnDLJ33tn7jb2H6Yw03NXEoCtyZrxf1L46EN494MdMD3iHvcPe6dv7Pmxt1dDedynwbp4LLxPnZ4uN1VYxcwb2juydPN6rG5umg3ce8h6q791A4RvnAr9NYe+wd9g7b7zXu7CtM0aNkTmLwioZez+uj8w1/krgHZ0zyN55Z++3+k4H728KeJ+4XB8OPLJvFZ0zsHfYO3l7v+2dCdIZaRTOlMD75OX4pPligewdnTPI3rnjXe2CdkYOuRh5p4X3cuv2NSxg78jeYe/s8X7ZuRqkdcYgnckr4N3i1Wycts+MzARGOAN7R/ZOP3u/iWdyGvrOY0sTqc6Zc5U8A95h77B32Puvh+drb1MeZqpYu89lyDsxe1dOGajXyN5/lK5h78jeWeJdvQfV989+GI7Nj4fF9JQmonhvgHfYO+wd9v6wuvoZaPV927YnyjOWd2p4d/uAbEvgHfaO7J199n7T/N5+hl3936RmVwLvHfBODu8Fe7zD3iO1dxU2ff+Z1LCcR0DR3pdOw5lMNN7/RYh3ZO+x4r0Km74/6ZTkMUyMJN4XTj8wGex9VrxXsHfYu6s39zIYODjePweu8i66tAq8z23vUcXDyN69vrn1XOn7ryGSnOSdWN+7WgHv/vBeOz/wdmTsg/taLm3BhL37rJZ96/swazrDSt6J2btjBiJ7//kS3J9n/hzvjfMZ/kVceEf2fq/3vZ8T76zknRjeHYe1sPcfq3SO95ETUxr3R3DVsPdY8Z5+9b6Hb55pucq76JkzwPuvl7B1DoR1wN9i43cU2bvg7P1mMHA/n73zkndiEyMd8wB4//n2Osf783fYfdZPAO+w97ns/VJcDd4b2XKVd9Hz3pG9e38cn56Y4r5T518WVziD7P1ncXU/j77f4L0E3s+fzPlPa4K9e8/Cn4bvHqL3LbL3iPE+12SCgd0xHgTtfZlp4N0v3p13suikDpnN6PXsP1iQvc+Wvas06LEed47nY3KANkG8l00RuBAXH94/nOP9mfF9aA94V7D3eO19puJqz1beqeC93iTu0aO3yN693+yHX6Ee5H3sgBZk78LxPs/gmZ6tvFOYGFlWm3XWaQ+vARMjvW4rOL+K1f1Xka493FHdwN5jxnv58tj3/rC+/8u4sppzlfcZ7b06rsVHs94WnRe44ziPP2+5B6F+MOWrdJ/zH9didrwje58ve7+ZK2aVznyN9h2Gtj2OcW8nVlb5yXsovNfr5PefLMuK4t+B7NrXSwDePe8r+FrN32cy9UP36fV62Lske7/2zgxWIcvXzPj91zF7/aTKKkN5D4X3qtB31gFR/zwu4UdpT8/elR+8d8nv664SL3Sf3vaO7F0W3tNX0pnfxy4ZTjfo+cp7qL53L7FA5Hifbu+OB3JeX0mx+qi/H8y0Xq4LT1/b068Y9i4L72/2O5vaP6emDv2EbIbbhtWg9j4H3keO9okQ7xtfv5Z0lyXr1WaxadaJnzL56f+ymh/vyN7nzN6vYyMH+81JV32fgndm02YiwPsCeP+5lp23N1vrYxlFd53HvE1vFOw9anu/Huqxt25vvNV383/HUt5l430pGu8WUUVd/OO8JvMH2bs0vNvPnWkt8d4ylnfReB8pxEVo72XGGu9PB5jB3qPA+5vtzqZ7eDf5jhgYy7tkvI/hL0K8e9lrROb7Gtm7/OzdvjVysMP7VzazK4H3H3dqfryvgPffq+GMd71SsPfY7T21TWfu4d3gJ8C534apvEu2926jROPdInv3d7uD4L2JDe/I3h+H7xPTmXuVVZOfAJyTd9F4H9viGKO9V5xrqzYnxMDepeH93S6duYv38fbKnnPyLhvvNfD+p7aacI7eSwJ4R/Y+b/Z+bY10gPfxhGfgnLwHmxg5B96TEngPIFzhshka1wt7n9feLcP31g7vZ3mvFPBOzN67tZKNd5vsXW06vnjfqNjwjuz9XvhudSTf35EEJng//at8p4B3angfLcRFae+Mw/eiUrB34F29W9VWH+C9Nchm+Mq7YLyPFuKixDvf8F0nJQW8I3ufOXu37Hy/j/eRr4hzYM9X3gX3vY8W4qLEO9/w3aYtEvYu0N5Lq/B92Ft0RnKXd7n2Pj5dMMrs3d/QSO+rig/vyN6fdb57xzt7eZeL926jYO/3+sq4jp3JUtg78H5cbza1VRu8n7pt8hJ4p4f38fkkceI9TXjqu102g+xdXvZut7HpAd73Y/LO8Qg++Xg3YF+ceFcNz9bIolKwd9j7KXy3wft+Ot7PXZEl8E4Q742Sjne77J1pa6Rd3wyyd4l4tzpw1cLe+cu72M6Zolaw9wetkRzTGctsBvYuEO/XjU396/beP0/euc4Sk23vOlHA+6N0hiPes5oI3pG9z569XzY2+cU761lisvFebIB3SemMxSHasHex4Uxl0TozGe/H5D1nLu9S8W4ie5Fm70pxTGdst5YgexcYzpTTD+TrJ+Od+44mv3ifdWKkUVIbq70zHCtmfamwd4l4v9RWB3/23vKvq4q1d6ODH6LFO7+dTZPBg+xdcvZ+2dg0+LP3k7zXwDtBvJuBL1q88yuuJqWCvcPeL8/SZd+qN3s/Je/vCngniHezU9uizd7VkllxtduoOPGO7P1B68zkzsiJ9t6zPqNJdt+7odbGa+/pipW+6yxVsHfg/SZenN74Pg3vrYS6qlB7N/yYxot3tWCl74W9vCN7F5m9X2YCe7L3nvcZTaLxbrp/PWK885orlpQK9g57v13f+1ZbP/Y+iKirysR7sVBR4N0+e1fqg1Fv5AvJO7J3oXh/m7qvaZK99yKaImXi3VhqI7Z3VW/5JO+vyDvsXSTe03dn9v7o7wqoq4rEu1nbTOR4Z6Tvpj/GkL3Hk71fzlt92d6HR3XVdwW8P7tTM+Fdr1Pg3aA4xUXf9Uop2Dvs/dfTNHlf0/2BwPnwqK6aAu8E7V2bjxaMOXtXasmE7kUVMd6RvT96mnYT8d6bR+9i6qoC8d41SsHeTRaP5hn9oWDvwPuf9V/uxN4HqcNmZOJ9Sh0ucryzmAtsMrcf2Xt82fv31Jnh1dLq0N89YDUF3kdUYBa8Z5UC3g0Xh0NXjevksPe47P3dTfZ+rM7+AHw/SJJ3YfY+qUU67uz9ODiSfDzTNSpqvCN7H2mdcYD3fD9cCd8PuZimSHF4n/ZTPnZ7pz9ZzPy3Ouw9MryfT/TIHeD9/DXRtv1htftcyLAZgXjX0w7kjB7vHh7P+aI2ZO9RZe9q58rezwqfn7h+/s7YKeB99E6Fx/vEoBZ4r2if6/HSNALYu2h7P+N9gr23+d5wSWmKFGbvU4Pa2LN3RXzvqvXx2cjeI8D7uXXGA97l1FVF4V2vy7jw/rq9q3RNl++vzZqBvQvH+zKfaO8xyrscvHeTYQe8K1XT3dyUOSlwIXsXmr3XuaPDVn/T/V0B7+TwrreVAt4t4neq3TPdUpHEO+ydhr2XnvC+S4F3cnjXFq6H7P2EJJp8100KvCN7f/I87bzgXZa8C+mcsaE77P28SG5e7daOPt+wd6F4Px/YZI73kc7Ib7rLkncZ9q6zhQLeLVdJ8Fxtva2p4h3ZO43s/dw64xzvtQLeieHdju7A+zffyZVXdeLsKYO9S7X344FNuflpTUatM5J2NEnBuyXdkb1fb46WSndk72Lxfpo6MwHvJuG7oHEEnvEebGKktu2gg70T5Xvh8CGDvUvFu5po759DHtWOJhn23m0rBbwL4rvOloow3pG9E8neT60zU/D+eR4Y9gzvJfBOC+86qRTw/vrHgA7fndId9i7X3o+11X4K3o/D3PM8JnlnjnfdvdAejeydIN/dujuyd+D9J+DbYf8Q8bsSeDf+ZAbAuy4+UhUt3l3aOxW+u6Y77F0s3lMbvB8Jf0T8PcILlHfW9t4lS1qXzhnvJPjusmcG2bvs7P3UGflpt+4SXqC8c8Z7t6oV8O5uzV9fdU932LvccKbeW+P9m/CCxxEwx7suGnKXzjh7P92k7bx877bu9wwie5eL93zKptUHldYbeVfAOxm8d0mlIse7a3s/3KVkzvkzeuVhRzjsXTDe89fw/vnZXnvhRco7U7x3RVMq4N35+KNyNRvfX2qCQvYeYfZ+wHv7It4PAp/LnCXGuHNGd6uK5KWzx7sqm2KegEZnH14+37B3yeHMy3i/jKKRKe8c7b1LPlIFvLvP3k9rOUuBVW89TftA9i4Z7/3reP+aVSBT3vnhvcs2JdVL52/vMwXwbn6Owd7jwvveCd4/Bcs7M7zrLmsqupcuAu8qDR3Q6GLj7fON7F1u9v5KX+TPeEZo8s5rYqRTuAPvT96ZbUCB1w6aoGDvEdp79XLjzGVSsFR5Z2TvXZdsKtqXLiF7P4tROIHXRePTnJC9i8X7myO8fw75TgHvc+Jdd8V6WVK/dCn2fqywBkrgvao77F023ls3eG/FyjsLvB/Y7ljcgffRVTaFf8B3WeN50Aeyd7HZ+1veu8F7n5fA+9Q75Qbv+sj2pkpZXLokvB/u2cpzQqOLtffDz2Dvcu197wjvn28KeA9u7weyd0W2+qhSLpcuJnv/foeSTnuEe7L0//lG9i4V7+lu74junwvgPSTe9Zns62a5LDlduix7P77oj60nwOsuWYZoRoO9S8V7uRuAdy541wemH575w/pXFEmy2nzU9f/t3dFO20oUBdCSOMY2ARyDX1LFRM7//+NNSLkFLgVqD+jYd622D5UqpYzI1mHPeDK5L3128X58E93dfkFF813hbnqfb/detE2qeN/ON94fvsirc++Xf/x3Z8dBZbVarNfXNxcXZZFN80vfvxvv+9SvtviWZSqWi8ukI/zD94X7MYFSr/q7W6vJX2z/Xrwnf7G7yIv7n62hvDG9f7x/9lWWL89hvPlvbs7ulndlcTL1L/2dncLsOvmrXWfftlKrZAH/sF+tl9/3jGD6Vb/6839+mf7F/vwjbPWt375vukv/X/h8BGyS7az25bcdbzoAAASeSURBVA/G1rhWYMIrWt0lGeEfj7hW3gyM/5beJNtZbWQT//d3XnkzMuEf9vvbqwtvJZJIt7NaW0w4Jfxqv//5MKhvv1xcLQ3uJIv3VNX71sQBvxJ+fXt52lH7u2hfLa7LwvKRTJHomdVeusOzN1Z1c71YXe4/DvnTuaiHy8XiZinaSfxdmGJntW8OuZ8o4ZWqvLte3z6G/P4p6B8ef/88H3d9fDDtdn29NLXzBcpDgmzv8tne9A5jJ6iiXN7cXF2t1+vF6uzy+Of419OZ12OwS3a+SD0y3vtTtnddXltK+Cjpy7KsHn+Vftrl643bWW0OeX7+CG1n3gEiydp+RCvT/Qr32X6ENsBUld2YcO+e6GYAgsX70Or9ebjrZgCiqZuBG6rPw73rWpv/AKHcD6veX6W7bgYglmxg9X7oXsa7bgYglKpJE++6GYBQNsO6mf5VurdWEiCUgafe+5fTe76xkgCRFEOPRb6a3j1gDRDK0Op9p5sBiKweeCNB71gkQGT3Q28kODgWCRBXNrR6fzm9u04MIJaqTzG962YAgtnsUkzvuhmAWLLtLsn07pFVgFCK4R/U5FgkQFxln2J6V70DBDO8m3kR7x5ZBYilSRLvjkUCxDL8WOTzeNfNAAQzopt5Hu9uiwQIJUsU76p3gFCKPkm8q94BYtmMSPddo3oHCGqbJt5V7wChjOpmnsW76h0glHqXJN5V7wCxNEniXfUOEEvVi3eAGRq1sfr7wnfVO0AsTZp4b931DhDJyG7mKd7d9Q4Qy8hu5t/pvbaUAJE0aeLdQ00AoYztZp4+jc/OKkAoY7uZp3j3UBNAKE2qeLeUAIGUo9P9fCOwh5oAQtmKd4AZKppE8d7ZWQUI5GKXanovLSZAHAm6mV2Tu5IAIJaiTxbvFhMgjs0uRbw79g4QS7ZNFe8OzgAEUqXoZh4vnRHvAIEk6WbEO0A023TxvrSaAFGk6WbONwI7Fwkws+H9PL2Ld4AwmjTxfnpsVbwDhLHpE8W76R0gkCxRN2N6BwilbMQ7wAzVfcJ4d6MYQBDFIVW675ouv7egAEGGd/EOMEdtkzDe3QcMEETZ9Snj3dYqQAhZ2yVL99Njq+IdIMbwnh9Sxnsu3gFCqPPG9A4wPxvxDjBHRcKDM4+Xzoh3gCD5njLe866ypAAx8v04vvfJbiXwaU0AYfJ9s6nbrjs0Td+Pj/faggIEiviqbts8P2b8qIgX7wABI748TvF5nh8jXrwDzC7j62PGdwMjvhHvAHFlVVm37ZCEF+8A4cf4Yllv/zbhm67bWDqA+Blf1tv+7y6dcSMwwDRUm88nfN91bWbJACYh+1F8tqU5Te/iHWBCyk8lvOkdYHo+U9KY3gEmqKg/GuEP4h1gkqr3SxrxDjBV2XsljXgHmLBi24h3gFm6eHuEb8Q7wPRH+F68A8zQGy28eAeYhepVwDfunAGYS8A/72j6rrYkADMJ+PrQ/453FwIDzEbZPgW86R1gZgHfnTsan9YEMC/Lc8B3paUAmJOsqPP80HSFpQCYmarN81a8A8zPpnXsHWCOCtU7AAAAAAAAAAAAAAAAAAAATNs//pCms4wfrsoAAAAASUVORK5CYII=');clip-path: circle(); background-size: 56%; background-position: center; background-repeat: no-repeat;">
    </div>
    <div class="text_top" style="margin-right: 40px; color: white;   font-family: inter, sans-serif;">
      <h1 class="title">80G Reciept</h1>
      <p class="date">${currentDate()}</p>
    </div>
  </div>
  <div class="reciept" style=" margin-left: 10%;">
    <p class="text_basic" style="font-size: 18px; line-height: 0.8; color: black; font-weight: 500;">Reciept To :</p>
    <p style="font-weight: bold; line-height: 0.8;">${customerDetails.name}</p>
    <p style="font-weight: bold; line-height: 0.8;">${customerDetails.address}</p>
    <table class="table" style="width: 80%;
    border-collapse: collapse; margin-top: 30px; margin-bottom: 30px;">
      <thead>
        <tr>
          <th style="padding: 15px; font-size: 13px; text-align: left; border: 1px solid rgb(216, 216, 216); background-color: #eb8e24; color: white;" >SL.</th>
          <th style="padding: 15px; font-size: 13px; text-align: left; border: 1px solid rgb(216, 216, 216); background-color: #eb8e24; color: white;">DONATION CAUSE</th>
          <th style="padding: 15px; font-size: 13px; text-align: left; border: 1px solid rgb(216, 216, 216); background-color: #eb8e24; color: white;">AMOUNT</th>
          <th style="padding: 15px; font-size: 13px; text-align: left; border: 1px solid rgb(216, 216, 216); background-color: #eb8e24; color: white;">QTY.</th>
          <th style="padding: 15px; font-size: 13px; text-align: left; border: 1px solid rgb(216, 216, 216); background-color: #eb8e24; color: white;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td  style="border: 1px solid rgb(216, 216, 216); padding: 20px;">1</td>
          <td  style="border: 1px solid rgb(216, 216, 216); padding: 20px;">${program}</td>
          <td  style="border: 1px solid rgb(216, 216, 216); padding: 20px;">₹${orderDetails.amount/100}</td>
          <td  style="border: 1px solid rgb(216, 216, 216); padding: 20px;">${quanity}</td>
          <td  style="border: 1px solid rgb(216, 216, 216); padding: 20px;">₹${orderDetails.amount/100 * quanity}</td>
        </tr>
      </tbody>
    </table>
    <div class="donation_total"  style="display: flex; width: 80%; justify-content: space-between;">
    <p style="font-size: 18px; font-weight: 600;">Thank you for your donation!</p>
    <div class="contain_total">
    <p style="font-size: 18px; font-weight: 600;">Sub Total: <span style="margin-left: 20px;">₹${orderDetails.amount/100 * quanity}</span></p>
    <p style="font-size: 18px; font-weight: 600;">Tax: <span style="margin-left: 90px;">₹${tax}</span></p>
    <p style="background-color: #eb8e24; padding: 20px; font-size: 20px; color: white; font-weight: bold;">Total <span style="margin-left: 50px;">₹${(orderDetails.amount/100 * quanity) + tax} 
    </span></p>
  </div>
  </div>
    <div class="info-container" style="font-size: 15px; margin-top: 50px;">
    <p style="font-size: 18px; font-weight: 600">Payment Info:</p>
    <p>Website: www.bhumi.ngo</p>
    <p>Email Address: contact@bhumi.ngo</p>
    <p>Address: 3/2, Karpaga Vinayagar Koil Street,</p>
    <p>Alandur, Chennai - 600016, India</p>
    </div>
    <div class="info-container" style="font-size: 15px; display: flex; justify-content: space-evenly;">
      <div class="contain">
    <p style="font-size: 18px; margin-top: 40px; font-weight: 600;">Information regarding 80G:</p>
    <p style="width: 50%; font-size: 14px;">All contributions to Bhumi are exempt u/s 80G(5) of the Income Tax Act, 1961. Approval Number: AABTB3718PF20214 dt. 31/5/2021 | Bhumi PAN: AABTB3718P You can access the document at <a href = "https://go.bhumi.ngo/PAN">go.bhumi.ngo/PAN</a></p>
  </div>
    <p style="width: 70%; margin-top: auto; font-size: 12px; margin-right: 30px;">***This is a computer-generated receipt and does not require a signature***</p>
    </div>
  </div>`
    
  
    // The next step will render the element
    receiptDiv.innerHTML = html_reciept; // Target your receipt container
    document.body.appendChild(receiptDiv); 
    customerDetails['id'] = orderDetails['id'];
    customerDetails['type'] = orderDetails['type'];
    console.log(customerDetails)
    generate_thumbnail(receiptDiv,customerDetails);
  }

function showErrorModal(errorMessage) {
    const errorModal = document.getElementById("errorModal");
    errorModal.querySelector(".error-message").textContent = errorMessage;
    errorModal.classList.add("active"); 
}

function currentDate(date = new Date()) {
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()]; 
  const year = date.getFullYear();

  return `${day} ${month} ${year}`; 
}
