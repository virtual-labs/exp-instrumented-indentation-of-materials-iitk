const charts = {};
const DATA_UPDATE_ANIMATION_DELAY = 200;

const indentationDepth = [
    0.00801, 0.00896, 0.01141, 0.01149, 0.0135, 0.01438, 0.01921, 0.02576, 0.03424, 0.04563,
    0.05816, 0.07108, 0.08418, 0.09816, 0.11269, 0.12651, 0.13966, 0.15442, 0.16727, 0.18142,
    0.19578, 0.21214, 0.23416, 0.24801, 0.26316, 0.27956, 0.2972, 0.31456, 0.33102, 0.34759,
    0.36343, 0.38063, 0.39716, 0.41389, 0.43082, 0.4479, 0.46569, 0.48234, 0.50019, 0.51768,
    0.53548, 0.55232, 0.56935, 0.58801, 0.60437, 0.62173, 0.63985, 0.65629, 0.67601, 0.69432,
    0.71179, 0.72972, 0.74732, 0.76728, 0.78531, 0.80298, 0.80298, 0.80677, 0.80962, 0.81031,
    0.81142, 0.81277, 0.81341, 0.81334, 0.81278, 0.81274, 0.81123, 0.81015, 0.80821, 0.80686,
    0.80551, 0.80426, 0.80367, 0.80142, 0.80098, 0.79973, 0.7979, 0.79767, 0.79527, 0.79441,
    0.79203, 0.79102, 0.78955, 0.78882, 0.78738, 0.7859, 0.78418, 0.78268, 0.78045, 0.77856,
    0.77733, 0.77622, 0.77432, 0.77178, 0.77086, 0.76881, 0.76681, 0.7652, 0.76287, 0.76073,
    0.75788, 0.75538, 0.75299, 0.751, 0.74744, 0.74589, 0.74199, 0.73947, 0.73615, 0.7343,
    0.73331, 0.73091, 0.72893, 0.72449, 0.72099, 0.70118
  ]
  const load=  [
    0.04149, 0.05166, 0.06297, 0.07145, 0.083, 0.0925, 0.12345, 0.18484, 0.28471, 0.4232,
    0.60267, 0.82228, 1.08217, 1.38099, 1.71978, 2.09926, 2.51904, 2.97793, 3.47801, 4.01619,
    4.59526, 5.21574, 5.87131, 6.57314, 7.31158, 8.08928, 8.90952, 9.76723, 10.66686, 11.60586,
    12.58446, 13.60214, 14.66141, 15.75884, 16.8965, 18.07541, 19.29319, 20.55081, 21.84888,
    23.1877, 24.56382, 25.98191, 27.43976, 28.9376, 30.47478, 32.05147, 33.66868, 35.32651,
    37.02333, 38.75987, 40.53715, 42.35417, 44.20953, 46.10684, 48.04235, 50.01859, 50.01859,
    50.01551, 50.01119, 50.00839, 50.00696, 50.00619, 50.00481, 50.00496, 49.00432, 48.00422,
    47.00251, 46.00272, 45.0028, 44.00088, 43.00109, 42.00101, 41.00019, 40.0008, 39.00104,
    38.00087, 37.00027, 36.00115, 35.00011, 33.99929, 32.99975, 31.99975, 30.99936, 29.99901,
    28.99949, 27.99924, 26.99946, 25.99962, 24.99987, 23.99931, 22.99931, 21.99894, 20.9994,
    19.9991, 18.999, 17.99873, 16.99862, 15.99853, 14.99894, 13.99882, 12.99796, 11.99865,
    10.99967, 9.99838, 8.99858, 7.99823, 6.99897, 5.99845, 4.99839, 4.53742, 4.03853,
    3.05465, 2.55683, 1.56459, 1.07648, 0.09478
  ]


var currPos = 0;
var currentStepProgress = 1;
var sampleLength = 0;
var sampleDiameter = 0;
var sampleFinalLength = 0;
var sampleFinalDiameter = 0;

document.getElementById("step1").classList.remove("disabled");
window.refresh();

function handle() {
  eval(`handleStep${currentStepProgress}()`);
  window.refresh();
}

function handleStep1() {
  let pane = document.getElementById("step1");
  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step2");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 2;
}

function handleStep2() {
  let pane = document.getElementById("step2");

  if (!mit.isSampleLoaded()) {
    alert("Please load the sample on the MIT machine first!");
    return;
  }

  pane.classList.add("done");
  pane.classList.remove("active");

  //plot blank graph init graphs
  // let progress2 = (readingData.stress.length / readingData.strain.length) * currPos;


  plotGraph(
    document.getElementById("outputGraphA").getContext("2d"),
    {
      labels: indentationDepth,
      datasets: [
        {
          label: 'Load',
          data: [],
          borderColor: "#3e95cd",
          fill: false,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    },
    "Indentation Depth (µm)",
    "Load (mN)"
  );

  document.getElementById("btnNext").disabled = true;

  document.getElementById("startTest").addEventListener("click", (e) => {
    let tableBody = document.getElementById("testData");
    e.currentTarget.disabled = true;
    document.getElementById("btnNext").disabled = true;
    e.currentTarget.innerHTML = "Running...";

    mit.setConfig({
      yield_point: 0.3,
      breaking_point: 0.25,
      finish_point: 0.2,
    });

    setTimeout(() => {
      mit.start(0.02, -1);
    }, 4000);

    let totalSteps = load.length;
    let intr = setInterval(() => {
      if (currPos >= totalSteps) {
        clearInterval(intr);
        document.getElementById("startTest").disabled = false;
        document.getElementById("startTest").innerHTML = "Done";
        mit.stop();
        document.getElementById("btnNext").disabled = false;
        return;
      }

      tableBody.innerHTML += `
            <tr>
               <td>${parseFloat(indentationDepth[currPos]).toFixed(5)}</td>
            <td>${parseFloat(load[currPos]).toFixed(5)}</td>
            </tr>
          `;
      currPos++;

       let progress1 = (load.length / indentationDepth.length) * currPos;
     
      plotGraph(
        document.getElementById("outputGraphA").getContext("2d"),
        {
          labels:indentationDepth,
          datasets: [
            {
              data: load.slice(0, progress1),
              label: 'Load',
              borderColor: "#3e95cd",
              fill: false,
              pointRadius: 2,
              pointHoverRadius: 4,
            },
          ],
        },
        "Indentation Depth (µm)",
        "Load (mN)"
      );
    }, DATA_UPDATE_ANIMATION_DELAY);
   
  });

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step3");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 3;
}

function handleStep3() {
  let pane = document.getElementById("step3");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step4");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 4;
}

function handleStep4() {
  let pane = document.getElementById("step4");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step5");
  next.classList.add("active");
  next.classList.remove("disabled");

  modal = new Modal({
    title: "Can you answer the questions?",
    body: [
      {
        page: 1,
        title: "What is instrumented indentation technique?",
        options: [
          "That measures hardness and Young’s modulus during indentation of material",
          "That provides only hardness of material during indentation of material",
          "That provides only elastic modulus during indentation of material ",
          "That records instantaneous load vs displacement during indentation of material",
        ],
        correct: 3,
      },
      {
        page: 2,
        title: "How is hardness defined?",
        options: [
          "Hardness is defined as resistance of material against wear and erosion",
          "Hardness is defined as resistance of material against indentation, scratch and plastic deformation",
          "Hardness is defined as resistance of material against corrosion",
          "Hardness is defined as resistance of material against passage of electrical current",
        ],
        correct: 1,
      },
      {
        page: 3,
        title: "How is hardness calculated?",
        options: [
          "Hardness = Load / Area",
          "Hardness = Load × Area",
          "Hardness = Stress / Strain",
          "Hardness = Stress ×Strain",
        ],
        correct: 0,
      },
      {
        page: 4,
        title: "How is Young’s modulus defined?",
        options: [
          "Young’s modulus is defined as the maximum strength of material before fracture",
          "Young’s modulus is defined as the strength of material at yield point",
          "Young’s modulus is defined as the ratio of stress to strain in the linearly elastic region of stress-strain curve",
          "Young’s modulus is defined as the slope of stress to that of strain in the stress-strain curve before failure",
        ],
        correct: 2,
      },
      {
        page: 5,
        title: "What is nanoindentation?",
        options: [
          "Nanoindentation is the indentation when load is in the order of ~100s nN (nano-Newtons)",
          "Nanoindentation is the indentation when displacement depth load is in the order of ~100s nm (nano-meters)",
          "Nanoindentation is the indentation when duration of dwell time of the indenter at maximum load is in the order of ~100s ns (nano-seconds)",
          "Nanoindentation is the indentation when the measurement time is in the order of ~100s ns (nano-seconds)",
        ],
        correct: 1,
      },
      {
        page: 6,
        title:
          "The loading curve during instrumented indentation is given by <img src='images/ques/ques6.jpg' height='18px'/> for which type of indenter tip:",
        options: ["Berkovich", "Vickers", "Spherical", "Cylindrical"],
        correct: 2,
      },

      {
        page: 7,
        title:
          "The unloading curve during instrumented indentation using a Berkovich indenter tip is given as (where P is applied load, h is instantaneous depth, hf is final contact depth after unloading, hc is the and hmax is maximum depth, and α2 is constant):",
        options: [
          "<img src='images/ques/ques7op1.jpg' height='24px'/>",
          "<img src='images/ques/ques7op2.jpg' height='24px'/>",
          "<img src='images/ques/ques7op3.jpg' height='24px'/>",
          "<img src='images/ques/ques7op4.jpg' height='24px'/>",
        ],
        correct: 1,
      },
      {
        page: 8,
        title: "The relationship of contact area (A) with the contact depth (hcontact) for a Berkovich tip is:",
        options: [
          "<img src='images/ques/ques8op1.jpg' height='24px'/>",
          "<img src='images/ques/ques8op2.jpg' height='24px'/>",
          "<img src='images/ques/ques8op3.jpg' height='24px'/>",
          "<img src='images/ques/ques8op4.jpg' height='24px'/>",
        ],
        correct: 0,
      },
      {
        page: 9,
        title:
          "The following portion of the load-displacement curve is used to extract the Young’s modulus of material during instrumented indentation:",
        options: [
          "First 5-20 % of loading curve",
          "Last 5-20 % of loading curve",
          "First 5-20 % of unloading curve",
          "Last 5-20 % of unloading curve",
        ],
        correct: 2,
      },
      {
        page: 10,
        title:
          "Which of the following equations govern the evaluation of reduced Young’s modulus from instrumented indentation:",
        options: [
          "<img src='images/ques/ques10op1.jpg' height='45px'/>",
          "<img src='images/ques/ques10op2.jpg' height='45px'/>",
          "<img src='images/ques/ques10op3.jpg' height='45px'/>",
          "<img src='images/ques/ques10op4.jpg' height='45px'/>",
        ],
        correct: 0,
      },
      {
        page: 11,
        title:
          "Young’s modulus of the material can be obtained from reduced Young’s modulus (E*) via following equation:",
        options: [
          "<img src='images/ques/ques11op1.png' height='45px'/>",
          "<img src='images/ques/ques11op2.png' height='45px'/>",
          "<img src='images/ques/ques11op3.png' height='45px'/>",
          "<img src='images/ques/ques11op4.png' height='45px'/>",
        ],
        correct: 0,
      },
    ],
    onClose: handleStep5,
  });
  modal.show();

  currentStepProgress = 5;
}

function handleStep5() {
  let pane = document.getElementById("step5");

  pane.classList.add("done");
  pane.classList.remove("active");

  document.getElementById("btnNext").disabled = true;
  document.getElementById("btnNext").innerText = "Done";

  currentStepProgress = 5;
}



function plotGraph(graphCtx, data, labelX, labelY) {
  // Check if a chart already exists for this canvas
  let chartObj = charts[graphCtx.canvas.id];
  if (chartObj) {
    // Update existing chart
    chartObj.config.data.labels = data.labels;
    chartObj.config.data.datasets = data.datasets;
    chartObj.update();
  } else {
    // Create a new chart
    charts[graphCtx.canvas.id] = new Chart(graphCtx, {
      type: 'line',
      data: {
        labels: data.labels, // Labels for the x-axis (can be indices or actual values)
        datasets: [
          {
            label: 'Load', // Label for the dataset
            data: data.datasets[0].data, // Data for the y-axis
            borderColor: '#3e95cd',
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 5,
            yAxisID: 'yScale'
          }
        ]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          yScale: {
            id: 'yScale',
            type: 'linear',
            min: 0,
            max: 60,
          },
          xScale: {
            id: 'xScale',
            type: 'linear',
            min: 0,
            max: 1,
          }
        },
        plugins: {
          legend: {
            display: true // Show legend if needed
          }
        }
      }
    });
  }
}