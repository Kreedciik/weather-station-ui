'use strict'

const dateElement = document.querySelector('.date');
const sensorDataWrap = document.querySelector('.sensor-data-wrap');
const ctx = document.getElementById('myChart');

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

    checkData(value, isDisabled){
        if(isDisabled){
            this.removeAlert();
            return;
        }
        if(this.name === 'temperature'){
            if(value >= 35){
                this.showAlert();
            } else {
                this.removeAlert();
            }
        } else {
            if((value <= 30 || value >= 70)){
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

class DrawChart {

    data = {
        labels: [0],
        datasets: [
        {
          label: 'Temperature °C',
          data: [0],
          borderWidth: 1,
          lineTension: 0.5,
          pointStyle: false
        },
        {
          label: 'Humidity %',
          data: [0],
          borderWidth: 1,
          lineTension: 0.5,
          pointStyle: false
        },
    ]
      };
    initialize(){
        this.liveChart = new Chart(ctx, {
            type: 'line',
            data: this.data,
            options: {
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }
          });
    }

    updateChartData(temp, humidity){
        let now = new Date();
        now = now.getHours() + ':' + now.getMinutes();
        if(this.data.datasets[0].data.length > 5){
            const labels = this.data.labels;
            const tempData = this.data.datasets[0].data;
            const humData = this.data.datasets[1].data;
            this.data.labels = [labels[0], ...labels.slice(2)];
            this.data.datasets[0].data = [tempData[0], ...tempData.slice(2)];
            this.data.datasets[1].data = [humData[0], ...humData.slice(2)];
        }
        this.data.labels.push(now);
        this.data.datasets[0].data.push(temp);
        this.data.datasets[1].data.push(humidity);
        this.liveChart.update();
    }
}

const tempSquare = new Square('temperature');
const humiditySquare = new Square('humidity');
const chart = new DrawChart();

tempSquare.drawSquare();
humiditySquare.drawSquare();
chart.initialize();

function showToday(){
    const today = new Date();
    dateElement.innerHTML = `${today.toDateString()}`
}

function showData(temp, humidity, isDisabled){
    tempSquare.updateData(temp + '°C');
    tempSquare.checkData(temp);
    humiditySquare.updateData(humidity + '%');
    humiditySquare.checkData(humidity, isDisabled);
    if(temp && humidity){
        chart.updateChartData(temp, humidity);
    }
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
        showData(0, 0, true)
    }
}

setInterval(getData, 1000);