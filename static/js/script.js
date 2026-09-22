const predictionForm = document.getElementById("predictionForm");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");

const bmiPreview = document.getElementById("bmiPreview");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const bmiResult = document.getElementById("bmiResult");


function updateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (height > 0 && weight > 0) {
        const bmi = weight / ((height / 100) ** 2);

        bmiPreview.textContent = `Calculated BMI: ${bmi.toFixed(2)}`;
    } else {
        bmiPreview.textContent = "BMI will be calculated automatically.";
    }
}


// Update BMI when height or weight changes
heightInput.addEventListener("input", updateBMI);
weightInput.addEventListener("input", updateBMI);


// Handle prediction form submission
predictionForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Hide previous result
    resultBox.classList.add("d-none");

    // Show loading
    loading.classList.remove("d-none");

    const data = {
        age_years: document.getElementById("age_years").value,
        gender: document.getElementById("gender").value,
        height: document.getElementById("height").value,
        weight: document.getElementById("weight").value,
        ap_hi: document.getElementById("ap_hi").value,
        ap_lo: document.getElementById("ap_lo").value,
        cholesterol: document.getElementById("cholesterol").value,
        gluc: document.getElementById("gluc").value,
        smoke: document.getElementById("smoke").value,
        alco: document.getElementById("alco").value,
        active: document.getElementById("active").value
    };


    try {

        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });


        const result = await response.json();


        loading.classList.add("d-none");


        if (!response.ok) {
            throw new Error(result.error || "Something went wrong.");
        }


        
        resultTitle.textContent = result.result;

        resultMessage.textContent =
            "The prediction has been generated based on the information provided.";

        bmiResult.textContent = result.bmi;


        
        resultBox.classList.remove("d-none");

    } catch (error) {

        loading.classList.add("d-none");

        resultTitle.textContent = "Error";
        resultMessage.textContent = error.message;
        bmiResult.textContent = "—";

        resultBox.classList.remove("d-none");
    }

});