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
import moment from 'moment';

export default {
  name: 'home',
  components: {
    GChart
  },
  created() {
    this.temperatureService = new TemperatureService(this.$resource);

    moment.locale('pt-br');

    this.temperatureService.listAll().then(
      res => {
        console.log(res);
        var last = moment(res.rows[res.count - 1].date).valueOf();
        var test = [['Hours', 'Value']];

        test = test.concat(
          res.rows
            .map((el, index) => {
              return [
                `${(moment(el.date).valueOf() - last) / 3600000}`,
                parseFloat(el.value)
              ];
            })
            .reverse()
        );

        this.chartData = test;
        console.log(test);
      },
      err => {
        console.log(err);
      }
    );
  },
  methods: {},
  data: () => ({
    client: undefined,
    chartData: []
  })
};
</script>
