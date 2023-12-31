import Student from './Student.js';
// eslint-disable-next-line import/no-unresolved
import { jwtDecode } from 'jwt-decode';

const apiUrl = 'https://classrouletteapi.onrender.com';
// const apiUrl = 'http://localhost:3000';


document.addEventListener('DOMContentLoaded', async function() {
    // fetch('/json/classes.json') // Fetch JSON data (testing only)
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        await fetch(`${apiUrl}/users/${userId}/classesInfo`)
            .then(function (response) {
                // console.log(response.json());
                return response.json();
            })
            .then(function (data) {
                populateDropdown(data.classes);
            })
            .catch(function (err) {
                console.log('error: ' + err);
            });
    
        // Assuming you have a dropdown element with id 'classDropdown'
        var dropdown = document.getElementById('classDropdown');
        
        // Add an event listener to the 'change' event
        dropdown.addEventListener('change', fetchClassData);
    }
});

function populateDropdown(classes) {
    var dropdown = document.getElementById('classDropdown');

    classes.forEach(function(cls) {
        var option = document.createElement('option');
        option.value = cls._id;
        option.text = cls.department + ' ' + cls.code;
        dropdown.appendChild(option);
    });
}

async function fetchClassData() {
    const element = document.getElementById('student-list-container');
    element.innerHTML = '<div id="student-list"></div>';
    showLoadingIndicator();

    var dropdown = document.getElementById('classDropdown');
    var selectedValue = dropdown.value;

    if (selectedValue) {
        // fetch('/json/classes.json') // Fetch JSON data (testing only)
        await fetch(`${apiUrl}/classes`) // Fetch DB data (localhost only)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var selectedClass = data.find(function (cls) {
                    return cls._id === selectedValue;
                });

                if (selectedClass) {
                    renderStudentCards(selectedClass);

                    // Assuming you have multiple student cards on the page
                    const removeButtons = document.querySelectorAll('.remove-btn');

                    // Add click event listener to each remove button
                    removeButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            // Get the parent element (student-name) of the clicked remove button
                            const studentCard = button.closest('.student-name');

                            // Remove the student card from the DOM
                            if (studentCard) {
                                studentCard.remove();
                            }
                        });
                    });

                    const detailButtons = document.querySelectorAll('.details-btn');

                    detailButtons.forEach(button => {
                        button.addEventListener('click', function() {
                            console.log('button was clicked');
                            const studentCard = button.closest('.student-name');

                            if (studentCard) {
                                loadModal(studentCard);
                            }
                        })
                    })

                    const selectBtn = '<button id="select-student-button">Select Student</button>';
                    element.insertAdjacentHTML('beforeend', selectBtn);

                    const modal = `<div id="modal">
                        <div class="modal-content">
                            <span class="close" id="closeModalBtn">&times;</span>
                            <img class="modalimage" alt="Student Profile Picture">
                            <div class="name-container">
                                <span class="modalfname">[First Name Not Found]</span>
                                <span class="modallname">[Last Name Not Found]</span>
                            </div>
                        </div>
                    </div>`;
                    element.insertAdjacentHTML('beforeend', modal);
                    const closeModalBtn = document.getElementById('closeModalBtn');
                    closeModalBtn.addEventListener('click', closeModal);

                    // reference button from html
                    const selectStudentButton = document.getElementById('select-student-button');
  
                    // click button
                    selectStudentButton.addEventListener('click', onButtonClick);
                } else {
                    console.log('Class not found');
                    hideLoadingIndicator();
                }
            })
            .catch(function (err) {
                console.log('error: ' + err);
                hideLoadingIndicator();
            });
    } else {
        clearData();
        hideLoadingIndicator();
    }
}

function clearData() {
    var myDataContainer = document.getElementById('myData');
    myDataContainer.innerHTML = '';
}


async function renderStudentCards(classData) {

    let data = classData;
    let students = data.students;

    let studentCards = new Array();
    let i = 0;

    students.forEach(element => {
        studentCards[i] = new Student(element.fname, element.lname, element.profilepic);
        i++;
    })

    hideLoadingIndicator();
    return students;
}

// Function to show the loading indicator
function showLoadingIndicator() {
    const container = document.getElementById('student-list');
    container.insertAdjacentHTML('afterbegin', '<div id="loading-spinner"></div>');
    var loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block';
}

// Function to hide the loading indicator
function hideLoadingIndicator() {
    var loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'none';
}

// function to adjust how quickly the delay changes
function cubicEase(t) {
    return t < 0.5 ? 4 * t * t : (t - 1)  * (2 * t - 2) + 1;
}

// function to loop randomStudent selection
// function onButtonClick() {
//     // loop the function 20 times
//     for (let i = 0; i < 20; i++) {
//         // change i to a number between 0 and 1
//         let t = i / 19;
//         // scale t however much is desired
//         let scaledT = t * 5;
//         const delay = cubicEase(scaledT);
//         // delay the function call by "delay" every iteration
//         setTimeout(function() {
//             randomStudent();
//         }, delay);
//     }
//     loadModal();
// }
async function onButtonClick() {
    for (let i = 0; i < 20; i++) {
        let t = i / 19;
        let scaledT = t * 25;
        const delay = cubicEase(scaledT);
 
        await new Promise(resolve => {
            setTimeout(() => {
                randomStudent();
                resolve();
            }, delay);
        });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadModal();
}

let previousRandomIndex = -1;

// randomly select a student after clicking the button
// highlight selected name
function randomStudent() {
    const students = document.querySelectorAll('.student-name');

    // remove previous highlights if any
    students.forEach(div => div.classList.remove('highlighted'));

    // random index and student
    let randomIndex;

    // keep selecting random indexes until it doesn't match the previous index
    if (students.length > 1) {
        do {
            randomIndex = Math.floor(Math.random() * students.length)
        } while (randomIndex === previousRandomIndex);
    } else {
        randomIndex = 0
    }

    // record the previous index
    previousRandomIndex = randomIndex;
    
    const randomStudent = students[randomIndex];

    // highlight random student chosen
    randomStudent.classList.add('highlighted');

}

function loadModal(student = document.querySelector('.highlighted')) {
    var modal = document.getElementById('modal');
    var fnameSpan = modal.querySelector('.modalfname');
    var lnameSpan = modal.querySelector('.modallname');
    var image = modal.querySelector('.modalimage');

    // var highlightedStudent = document.querySelector('.highlighted');

    if (student) {
        const base64String = student.dataset.profilepic;
        var fname = student.querySelector('.first-name').textContent;
        var lname = student.querySelector('.last-name').textContent;

        image.src = base64String;
        fnameSpan.textContent = fname;
        lnameSpan.textContent = lname;
    }

    modal.style.display = 'block';
}

function closeModal() {
    var modal = document.getElementById('modal');

    modal.style.display = 'none';
}

window.onclick = function(event) {
    var modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}