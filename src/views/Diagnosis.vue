<template>
  <v-content class="diagnosis">
    <v-container fluid>
      <h1>Diagnóstico</h1>
      <v-select
        v-model="predModel"
        :items="preds"
        item-text="label"
        item-value="id"
        v-on:change="modeSelected"
        return-object
        label="Selecione o método de identificação do sistema."
      ></v-select> 
      <v-layout>
      <div class="container mx-auto px-16" >
        <g-chart type="AreaChart" :data="chartData" @ready="onChartReady" />
      </div>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import ReadingService from '@/services/Reading/ReadingService';
import LsCalculationService from '@/services/LsCalculation/LsCalculationService';

export default {
  name: 'diagnosis',
  data: () => ({
    chartData: [],
    rmsData: [],
    predModel: undefined,
    google: undefined,
    preds: [
      {
        label:
          'Aproximação por Minimos Quadrados Polinomial y = x² + x + 1 + cos(x)',
        value: 1
      },
      {
        label: 'Rede Neural Recorrente',
        value: 2
      }
    ]
  }),
  computed: {
    ...mapState(['sensor'])
  },
  created() {
    this.readingService = new ReadingService(this.$resource);
    this.lscalculationService = new LsCalculationService(this.$resource);

    if (_.isEmpty(this.sensor)) {
      this.$router.push('dashboard');
    } else {
      this.readingService
        .listAll({ sensor: this.sensor })
        .then(res => {
          this.rmsData = res.rows;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  methods: {
    onChartReady(chart, google) {
      this.google = google;
    },
    prepareDataToChart(data) {
      var temp = ['Horas', 'Valor Estimado', 'Valor Real'];
      data = data.map((el, index) => {
        if (index < this.rmsData.length) {
          return [...el, parseFloat(this.rmsData[index].value)];
        } else {
          return [...el, 0];
        }
      });

      this.chartData.push(temp);
      this.chartData = this.chartData.concat(data);
      console.log(this.chartData);
    },
    modeSelected(mode) {
      switch (mode.value) {
        case 1:
          this.predictLSP();
          break;
        case 2:
          this.predictRNN();
          break;
        default:
          break;
      }
    },
    predictLSP() {
      console.log(this.google);
      this.lscalculationService
        .calculate({ sensor: this.sensor, predict: 250 })
        .then(res => {
          this.prepareDataToChart(res.body.result);
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>
