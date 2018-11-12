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
      <v-container grid-list-xl fluid  v-if="!!motor">
        <span > <h2 >Sensores</h2></span>
        <v-layout column wrap>
        <v-flex v-for="sensor in sensors" :key="sensor.id" xs10 >
          <v-card>
            <v-card-title primary-title>
              <h3> <span class="orange--text">{{`${sensor.label}: `}}</span> <span class="blue--text"> {{`${sensor.id}`}}</span> </h3> <br>
              <v-spacer />
              
                <v-btn
                    dark
                    small
                    fab
                    absolute
                    top
                    right
                    color="blue"
                    @click="diagnosis(sensor)"
                  >
                    <v-icon>show_chart</v-icon>
                  </v-btn>
                <br>

              <div id="chart" class="container mx-auto px-16 ">
                <g-chart type="AreaChart" :data="sensor.readings" />
              </div>
            </v-card-title>
            <!-- <v-card-text>
            </v-card-text> -->
          </v-card>
        </v-flex>
        </v-layout>
      </v-container>
      <div>
        
      </div>
    </v-container>
  </v-content>
</template>

<script>
import moment from 'moment';
import { mapMutations } from 'vuex';
import MotorService from '@/services/Motor/MotorService';
import SensorService from '@/services/Sensor/SensorService';
import ReadingService from '@/services/Reading/ReadingService';

export default {
  name: 'dashboard',
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
    ...mapMutations(['updateSensor']),
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
    },
    diagnosis(sensor) {
      this.updateSensor(sensor.id);
      this.$router.push('diagnosis');
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
