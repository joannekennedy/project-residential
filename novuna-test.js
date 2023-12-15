//============== Validating desposit input allow only numbers ==============
const inputField = document.getElementById('depositFinAmount');
inputField.addEventListener('input', function(event) {
  const inputValue = event.target.value;
  const sanitizedValue = inputValue.replace(/[^0-9.]/g, '');
  event.target.value = sanitizedValue;
});

//============== Function to calculate percentage for deposit slider ==============
function calculatePercentage(xValue) {
    var minPercentage = 0;
    var maxPercentage = 50;
    var totalRange = 100;

    var percentage = ((xValue - 0) / (totalRange - 0)) * (maxPercentage - minPercentage) + minPercentage;
    return parseFloat(percentage.toFixed(1));
}

//============== Reading the APR Range Selection and Updating ==============
var monthAprInput = document.querySelector('.range.monthSelect');
var monthRange = document.querySelectorAll('.range__point.monthSel');
var monthText = document.querySelector('.monthSelected');
var apr = 0;

if (monthAprInput) {
    monthAprInput.addEventListener('input', function(event) {
        var selectedMonthIndex = parseInt(event.target.value);
        var selectedMonthRange = monthRange[selectedMonthIndex];
        apr = selectedMonthRange.dataset.monthapr;
        //Displaying the retrived values
        monthText.textContent = selectedMonthRange.textContent;

        //Call the function to calculate the representative example
        finalCalculation();

    });
}

//============== Reading the Deposit Range Selection and Updating ==============
var rangeInput = document.getElementById('depositRange');
var rangePoints = document.querySelectorAll('.range__point.depSelect');
var depositFinAmountInput = document.getElementById('depositFinAmount');
var submitBtn = document.getElementById('submitBtn');
var loader = document.getElementById('loader');

if (rangeInput) {

  rangeInput.addEventListener('input', function(event) {
    var selectedValueIndex = parseInt(event.target.value);
    var selectedRangePoint = rangePoints[selectedValueIndex];
    var xValue = parseFloat(selectedRangePoint.getAttribute('x'));
    var percentage = calculatePercentage(xValue);
    var depError = document.getElementById('depositError');
    var price = parseFloat(depositFinAmountInput.dataset.price);
    var minRange = parseFloat(depositFinAmountInput.dataset.min);
    var maxRange = parseFloat(depositFinAmountInput.dataset.max);
    var minPercentage = parseFloat(depositFinAmountInput.dataset.minPercent)*100;
    var calculatedValue = (price * percentage) / 100;


    depositFinAmountInput.value = calculatedValue.toFixed(2);
    if(selectedValueIndex < minPercentage) {
      submitBtn.disabled = true;
      depError.textContent = "Please enter a deposit value between " + formatDisplayPrice(minRange, apr) + " (" + minPercentage + "%) and " + formatDisplayPrice(maxRange, apr) + " (50%)";
    } else {
      submitBtn.disabled = false;
      depError.textContent = "";
    }
    // Call the function to calculate the representative example
    finalCalculation();
  });

  //============== Reading the Deposit Input and Updating the Range Selection ==============
  depositFinAmountInput.addEventListener("blur", function(event) {

    //console.log(event.target.value);

    var inputValue = parseFloat(event.target.value);
    var price = parseFloat(depositFinAmountInput.dataset.price);
    var minPercentage = parseFloat(event.target.getAttribute("data-min-percent"))*100;
    var minRange = parseFloat(event.target.getAttribute("data-min"));
    var maxRange = parseFloat(event.target.getAttribute("data-max"));
    var proPrice = parseFloat(event.target.getAttribute("data-price"));
    var depError = document.getElementById('depositError');

    var depPercentage = (inputValue / proPrice) * 100;

    if(depPercentage>50 || depPercentage<minPercentage){
      depError.textContent = "Please enter a deposit value between " + formatDisplayPrice(minRange) + " (" + minPercentage + "%) and " + formatDisplayPrice(maxRange) + " (50%)";
      submitBtn.disabled = true;
    } else{
      var depPercentage = calculateScore(depPercentage);
      setSliderValue(depPercentage);
      finalCalculation();
      depError.textContent = '';
      submitBtn.disabled = false;
    }

  });
}

//============== Functionality to Find the range based on the input ==============
function calculateScore(inputValue) {

    return Math.min(Math.max(inputValue, 5), 50);

  /*const score = ((clampedValue) / 50) * 100;
  * return score;
  * */
}



//============== Functionality to Read the Closet Range Input ==============
function setSliderValue(percentage) {
    /*
  const minValue = 0;
  const maxValue = 50;
  const value = minValue + (percentage / 100) * (maxValue - minValue);
  console.log('Calculated value' + value);
  */

  var rangeInput = document.getElementById('depositRange');
  rangeInput.value = percentage;
}

var fc_activeMonth = 0;
var fc_months = document.getElementsByName('financeId');

function optionSelected(value){
  fc_activeMonth = parseInt(value);
  finalCalculation();
}
//============== Function - finalCalcution for Representative Example ==============
function finalCalculation(){

    //Reading from APR Selection

    var fc_monthNode = document.querySelectorAll('#adjust_months .range__point.monthSel');

    //Looping all loan options and removing selected class
    for (let i = 0; i < fc_monthNode.length; i++) {
      var loanElement = document.getElementById("loan-"+i);
      loanElement.classList.remove("selected");
    }
    //Adding selected class to the active loan option
    var loanElement = document.getElementById("loan-"+fc_activeMonth);
    loanElement.classList.add("selected");

    var fc_selectedMonth = fc_monthNode[fc_activeMonth];
    var fc_month = fc_selectedMonth.value;
    var fc_apr = fc_selectedMonth.getAttribute('data-monthapr');

    //Reading from Deposit Selection
    var depositInput = document.getElementById("depositFinAmount");
    var fc_deposit = depositInput.value;

    //Getting Representative Example Text Containers
    var finaceProPrice = parseFloat(depositFinAmountInput.dataset.price);
    var financeEmi = document.getElementById('info-monthlyRate');
    var financeDeposit = document.getElementById('info-deposit');
    var financeDepositTop = document.getElementById('info-deposit-top');
    var financeLoan = document.getElementById('info-loan');
    var financeLoanTop = document.getElementById('info-loan-top');
    //var financeInt = document.querySelector('.finCalcRow.fc-fixapr span');
    var financeApr = document.getElementById('info-apr');
    var financeTerm = document.getElementById('info-term');
    var financeTotalPay = document.getElementById('info-totalInclCredit');
    //Net Calculations
    var netDeposit = fc_deposit;
    var netLoan = finaceProPrice-netDeposit;
    var netEmi = (finaceProPrice - netDeposit) / fc_month;
    if(fc_apr>0){
      var fc_multiplier = fc_selectedMonth.getAttribute('data-monthmultiplier');
      if (fc_multiplier !== '0' || fc_multiplier !== '') {
        netEmi = (finaceProPrice - netDeposit) * fc_multiplier;
        netEmi = Math.ceil(parseFloat(netEmi)*100)/100; // Math.ceil(0.60000001*100)/100; - JS
      }
    }

    var netTotal = parseFloat(netEmi*fc_month) + parseFloat(fc_deposit);

    //Printing the values
    financeDeposit.textContent = formatDisplayPrice(netDeposit, fc_apr);
    financeDepositTop.textContent = formatDisplayPrice(netDeposit, fc_apr);
    financeLoan.textContent = formatDisplayPrice(netLoan, fc_apr);
    financeLoanTop.textContent = formatDisplayPrice(netLoan, fc_apr);
    //financeInt.textContent = fc_apr;
    financeApr.textContent = formatAprDisplay(fc_apr) + '%';
    financeTerm.textContent = fc_month;
    financeEmi.textContent = formatDisplayPrice(netEmi, fc_apr);
    financeTotalPay.textContent = formatDisplayPrice(netTotal, fc_apr);

    //Updating the form hidden fields
    var financeType = document.getElementById('financeType');
    var financeTypeName = document.getElementById('financeTypeName');
    var deposit = document.getElementById('deposit');
    var months = document.getElementById('months');
    var apr = document.getElementById('apr');
    var monthlyRate = document.getElementById('monthlyRate');
    var loan = document.getElementById('loan');

    if(fc_apr!=0){
        financeType.value = "IB";
        financeTypeName.value = "Interest Bearing Credit";
    } else{
        financeType.value = "IF";
        financeTypeName.value = "Interest Free";
    }

    deposit.value = netDeposit;
    months.value = fc_month;
    apr.value = fc_apr;
    monthlyRate.value = netEmi;
    loan.value = netLoan;
}

//Initiating the calculation on page load
finalCalculation();

//==================== Form Validation =====================================
function isEmpty(value) {
    return value.trim() === '';
}

function validateForm() {
    var firstNameInput = document.getElementById('firstName');
    var lastNameInput = document.getElementById('lastName');
    var emailAddressInput = document.getElementById('emailAddress');
    var phoneNumberInput = document.getElementById('phoneNumber');
    var countrySelect = document.getElementById('country');

    // Get the values of the form fields
    var firstName = firstNameInput.value;
    var lastName = lastNameInput.value;
    var emailAddress = emailAddressInput.value;
    var phoneNumber = phoneNumberInput.value;
    var country = countrySelect.value;

    // Get error message elements
    var firstNameError = document.getElementById('firstNameError');
    var lastNameError = document.getElementById('lastNameError');
    var emailAddressError = document.getElementById('emailAddressError');
    var phoneNumberError = document.getElementById('phoneNumberError');
    var countryError = document.getElementById('countryError');

    // Reset error messages and styles
    firstNameError.textContent = '';
    firstNameInput.classList.remove('error');
    lastNameError.textContent = '';
    lastNameInput.classList.remove('error');
    emailAddressError.textContent = '';
    emailAddressInput.classList.remove('error');
    phoneNumberError.textContent = '';
    phoneNumberInput.classList.remove('error');
    countryError.textContent = '';
    countrySelect.classList.remove('error');

    // Check if any field is empty
    if (isEmpty(firstName)) {
        firstNameError.textContent = 'First name is required.';
        //firstNameInput.classList.add('error');
        return false;
    }

    if (isEmpty(lastName)) {
        lastNameError.textContent = 'Last name is required.';
        //lastNameInput.classList.add('error');
        return false;
    }

    if (isEmpty(emailAddress)) {
        emailAddressError.textContent = 'Email address is required.';
        //emailAddressInput.classList.add('error');
        return false;
    }

    if (isEmpty(phoneNumber)) {
        phoneNumberError.textContent = 'Phone number is required.';
        //phoneNumberInput.classList.add('error');
        return false;
    }

    if (isEmpty(country)) {
        countryError.textContent = 'Please select a country.';
        //countrySelect.classList.add('error');
        return false;
    }

    // Phone number validation
    var phoneNumberRegex = /^[7|07]\d{9,10}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
        phoneNumberError.textContent = 'Phone number should starts with 7 or 07 and 10 digit';
        //phoneNumberInput.classList.add('error');
        return false;
    }

    // Validation passed
    return true;
}

//Apply the validation to the form
var form = document.querySelector('.calculator');
submitBtn.addEventListener('click', function (event) {
  if (this.classList.contains('checkOut')) {
    loader.style.display = 'block';
  } else {
    if (!validateForm()) {
      event.preventDefault();
      loader.style.display = 'none';
    } else {
      loader.style.display = 'block';
    }
  }
});

function formatDisplayPrice(price, fc_apr){
  if (fc_apr>0) {
    price = Math.round((parseFloat(price) + Number.EPSILON) * 100) / 100;
  } else {
    price = Math.floor(parseFloat(price) * 100) / 100;
  }
  return price.toLocaleString("en-GB", {
      style: "currency",
      currency: "GBP"
  });
}

function formatAprDisplay(fc_apr) {
    if (fc_apr > 0) {
        return fc_apr;
    }
    return 0;
}
