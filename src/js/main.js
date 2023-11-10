import { loadHeaderNavFooter } from './utils.mjs';
import Student from './Student.js';

loadHeaderNavFooter();

async function fetchData() {
    let response = await fetch('../json/names.json');
    // let response = await fetch("http://localhost:3000/classes/654935df81859ae8211f6340");
    let data = await response.json();
    console.log(data);
    let students = data.students;

    let studentCards = new Array();
    let i = 0;

    students.forEach(element => {
        studentCards[i] = new Student(element.fname, element.lname, element.profilepic);
        i++;
    })

    return students;
}


const targetNode = document.querySelector('nav');

const config = { attributes: true, childList: true, subtee: true };

const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been mutated.');
            darkMode();
            observer.disconnect();
        } else if (mutation.type === 'attributes') {
            console.log(`The ${mutation.attributeName} attribute was mutated.`);
        }
    }
};

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

if (window.localStorage.getItem('darkmode') == 'TRUE') {
    let element = document.querySelector('body');

    element.classList.remove('light');
    element.classList.remove('dark');
    element.classList.add('dark');
}

async function darkMode() {
    let element = document.querySelector('body');

    const themeBtn = document.getElementById('theme-btn');
    if (window.localStorage.getItem('darkmode') == 'TRUE') {
        element.classList.remove('light');
        element.classList.add('dark');
        themeBtn.innerHTML = 'light_mode';
    }
    themeBtn.onclick = () => {
        if (themeBtn.innerHTML === 'dark_mode') {
            element.classList.remove('light');
            element.classList.add('dark');
            themeBtn.innerHTML = 'light_mode';
            window.localStorage.setItem('darkmode', 'TRUE')
        } else {
            element.classList.remove('dark');
            element.classList.add('light');
            themeBtn.innerHTML = 'dark_mode';
            window.localStorage.setItem('darkmode', 'FALSE');
        }
    }
}

fetchData();

function onButtonClick() {
    let loops = Math.floor(Math.random() * 10) + 10;
    for (let i = 0; i < loops; i++) {
        // randomStudent()
        setTimeout(
            function() {
                randomStudent();
            },
            i * 200
        );
    }
}

// reference button from html
const selectStudentButton = document.getElementById('select-student-button');

// randomly select a student after clicking the button
// highlight selected name
function randomStudent() {
    const students = document.querySelectorAll('.student-name');

    // remove previous highlights if any
    students.forEach(div => div.classList.remove('highlighted'));

    // random index and student
    const randomIndex = Math.floor(Math.random() * students.length)
    const randomStudent = students[randomIndex];

    // highlight random student chosen
    randomStudent.classList.add('highlighted');

}
  
// click button
selectStudentButton.addEventListener('click', onButtonClick);

