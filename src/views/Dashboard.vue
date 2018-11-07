<template>
  <v-content class="home">
    <v-container>
      <span> <h1>Dashboard</h1></span>
      <v-select
        v-model="motor"
        :items="motors"
        item-text="label"
        item-value="id"
        v-on:change="motorSelected"
        return-object
        label="Selecione o Motor"
      ></v-select> 
      <div v-if="!!motor">
        <span > <h2 >Sensores</h2></span>
        <v-layout v-for="sensor in sensors" :key="sensor.id">
          <h3> <span class="orange--text">{{`${sensor.label}: `}}</span> <span class="blue--text"> {{`${sensor.id}`}}</span> </h3> <br>
          <div class="container mx-auto px-16 ">
            <g-chart type="AreaChart" :data="sensor.readings" />
          </div>
        </v-layout>
      </div>
    </v-container>
  </v-content>
</template>

<script>
import { GChart } from 'vue-google-charts';
import MotorService from '@/services/Motor/MotorService';
import SensorService from '@/services/Sensor/SensorService';
import ReadingService from '@/services/Reading/ReadingService';
import moment from 'moment';

export default {
  name: 'home',
  components: {
    GChart
  },
  created() {
    this.motorService = new MotorService(this.$resource);
    this.sensorService = new SensorService(this.$resource);
    this.readingService = new ReadingService(this.$resource);

    this.motorService
      .listAll()
      .then(res => {
        this.motors = res.rows;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    motorSelected() {
      this.sensorService
        .listAll({ motor: this.motor.id })
        .then(res => {
          this.sensors = [];
          res.rows.forEach(sensor => {
            this.readingService
              .listAll({ sensor: sensor.id })
              .then(response => {
                var temp = [['Hours', 'Value']].concat(
                  response.rows.map((reading, index) => {
                    return [
                      reading.date, // convert the timestamp to hours passed
                      parseFloat(reading.value)
                    ];
                  })
                );
                this.sensors.push({ ...sensor, readings: temp });
              })
              .catch(err => {});
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  data: () => ({
    client: undefined,
    chartData: [],
    motor: undefined,
    motors: [],
    sensors: []
  })
};
</script>
