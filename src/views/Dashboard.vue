<template>
  <v-content class="home">
    <v-container>
    <span> <h1>Dashboard</h1></span>
    <g-chart type="AreaChart" :data="chartData" />
    </v-container>
  </v-content>
</template>

<script>
import { GChart } from 'vue-google-charts';
import TemperatureService from '@/services/Temperature/TemperatureService';

export default {
  name: 'home',
  components: {
    GChart
  },
  created() {
    this.temperatureService = new TemperatureService(this.$resource);

    this.temperatureService.listAll().then(
      res => {
        this.chartData = [['Date', 'Temperatures']].concat(
          res.rows.map((el, index) => {
            return [el.date, parseFloat(el.value)];
          })
        );
      },
      err => {
        console.log(err);
      }
    );
  },
  data: () => ({
    chartData: [
      ['Year', 'Sales'],
      ['2014', 1000],
      ['2015', 1170],
      ['2016', 660],
      ['2017', 1030]
    ]
  })
};
</script>
