const inputSlider = document.querySelector("[dataSlider]");
const lengthDisplay = document.querySelector("[dataLengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`@#$%^&*(<{[}],).>/?:;"|-_=+';

let password = "";
let passwordlength = 10;
let checkCount = 0;

handleSlider();

// logic start here

// set length of password

function handleSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength - min) * 100 / (max - min)) + "% 100%";
};

function setIndicator(color) {
    indicator.style.cssText = `width: 20px; height: 20px; color: red; background-color: ${color}; border-radius: 50%; box-shadow: 0px 0px 3px 3px ${color}; opacity: 80%`;
};

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function getRandomUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
};

function getRandomLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
};

function getRandomNumbers() {
    return getRandomInteger(0, 9);
};

function getRandomSymbols() {
    const randomNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNum);
};

function calculateStrength() {

    // let hasUpper = false;
    // let hasLower = false;
    // let hasNum = false;
    // let hasSym = false;
    // if (uppercaseCheck.checked) hasUpper = true;
    // if (lowercaseCheck.checked) hasUpper = true;
    // if (numberCheck.checked) hasUpper = true;
    // if (symbolsCheck.checked) hasUpper = true;

    if (uppercaseCheck.checked && lowercaseCheck.checked && (numberCheck.checked || symbolsCheck.checked) && passwordlength >= 8)
        setIndicator("#0f0");
    else if ((uppercaseCheck.checked || lowercaseCheck.checked) && (numberCheck.checked || symbolsCheck.checked) && passwordlength >= 6)
        setIndicator("#ff0");
    else setIndicator("#f00");
};

async function copyContent() {

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    // to make copy wala text visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
};

function sufflePassword(array) {
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {
        str += el;
    });
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkBox) => {
        if (checkBox.checked) {
            checkCount++;
        }
    });
    // special condition

    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }

    // let's start the journy to find new password

    // remove password

    password = "";

    // let's put the stuff mentioned by checkboxes

    // if (uppercaseCheck.checked) {
    //     password += getRandomUppercase();
    // }

    // if (lowercaseCheck.checked) {
    //     password += getRandomLowercase();
    // }

    // if (numberCheck.checked) {
    //     password += getRandomNumbers();
    // }

    // if (symbolsCheck.checked) {
    //     password += getRandomSymbols();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(getRandomUppercase);
    }

    if (lowercaseCheck.checked) {
        funcArr.push(getRandomLowercase);
    }

    if (numberCheck.checked) {
        funcArr.push(getRandomNumbers);
    }

    if (symbolsCheck.checked) {
        funcArr.push(getRandomSymbols);
    }

    // compulsory addition

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition

    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    // suffle the password

    password = sufflePassword(Array.from(password));

    // show in UI

    passwordDisplay.value = password;

    calculateStrength();

});

// set circle color to gray
