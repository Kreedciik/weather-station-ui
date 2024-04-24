'use strict'

const tempElement = document.querySelector('.temp');
const humidityElement = document.querySelector('.humidity');
const dateElement = document.querySelector('.date');
const sensorDataWrap = document.querySelector('.sensor-data-wrap');

class Square {
    constructor(name){
        this.name = name;
    }

    drawSquare(){
        const element = document.createElement('div');
        element.setAttribute('id', `${this.name}`);
        element.classList.add('square');
        element.innerHTML = `
            <div class="box-title">${this.name}</div>
            <div class=${this.name}></div>
        `;
        sensorDataWrap.append(element);
        this.parentSelector = document.getElementById(this.name);
        this.valueSelector = document.querySelector(`.${this.name}`);
}

    checkData(value){
        if(this.name === 'temperature'){
            if(value >= 35){
                this.showAlert();
            } else {
                this.removeAlert();
            }
        } else {
            if(value >= 70){
                this.showAlert();
            } else {
                this.removeAlert();
            }
        }
    }

    updateData(value){
        if(this.valueSelector){
            this.valueSelector.textContent = value;
        }
    }

    showAlert(){
        this.parentSelector.classList.add('alert');
    }
    removeAlert(){
        this.parentSelector.classList.remove('alert');
    }
}

const tempSquare = new Square('temperature');
const humiditySquare = new Square('humidity');

tempSquare.drawSquare();
humiditySquare.drawSquare();
function showToday(){
    const today = new Date();
    dateElement.innerHTML = `${today.toDateString()}`
}

function showData(temp, humidity){
    tempSquare.updateData(temp + '°C');
    tempSquare.checkData(temp);
    humiditySquare.updateData(humidity + '%');
    humiditySquare.checkData(humidity);
}

async function getData(){
    const endpoint = 'https://temperature-humidity.up.railway.app/api/weather-service/live';
    try {
        const response = await fetch(endpoint, {headers: 
            {
                'Authorization': true,
            }
        });
        const data = await response.json();
        const {data: {temperature = '', humidity = ''}} = data;
        showData(temperature, humidity);
    } catch(e){
        showData(0, 0)
    }
}

setInterval(getData, 500);