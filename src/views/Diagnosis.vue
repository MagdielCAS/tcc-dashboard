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
import {
  LsArxCalculationService,
  LsCalculationService,
  RnnCalculationService
} from '@/services/Calculation';
import Tensorflow from '@/services/Tensorflow';

export default {
  name: 'diagnosis',
  data: () => ({
    chartData: [],
    rmsData: [],
    predModel: undefined,
    google: undefined,
    preds: [
      {
        label: 'Aproximação por Minimos Quadrados Polinomial',
        value: 1
      },
      {
        label: 'Minimos Quadrados Auto-regressivo',
        value: 2
      },
      {
        label: 'Rede Neural Recorrente',
        value: 3
      }
    ]
  }),
  computed: {
    ...mapState(['sensor'])
  },
  created() {
    this.readingService = new ReadingService(this.$resource);
    this.lscalculationService = new LsCalculationService(this.$resource);
    this.lsarxcalculationService = new LsArxCalculationService(this.$resource);
    this.rnncalculationService = new RnnCalculationService(this.$resource);

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
      this.chartData = [];
      var temp = ['Horas', 'Valor Estimado', 'Valor Real'];
      console.log(data);
      data = data.map((el, index) => {
        if (index < this.rmsData.length) {
          return [...el, parseFloat(this.rmsData[index].value)];
        } else {
          return [...el, undefined];
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
          this.predictLSARX();
          break;
        case 3:
          this.predictRNN();
          break;
        default:
          break;
      }
    },
    predictLSP() {
      this.lscalculationService
        .calculate({ sensor: this.sensor, predict: 250 })
        .then(res => {
          this.prepareDataToChart(res.body.result);
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    predictLSARX() {
      this.lsarxcalculationService
        .calculate({ sensor: this.sensor, predict: 250 })
        .then(res => {
          this.prepareDataToChart(res.body.result);
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    predictRNN() {
      this.rnncalculationService
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
