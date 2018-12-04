<template>
  <v-content class="diagnosis">
    <v-progress-linear :active="showProgress" :indeterminate="true"></v-progress-linear>
    <v-container fluid>
      <h1>Diagnóstico</h1>
      <br>
      <v-select
        v-model="predModel"
        :items="preds"
        item-text="label"
        item-value="id"
        v-on:change="modeSelected"
        return-object
        label="Selecione o método de identificação do sistema."
      ></v-select>
      <v-layout row wrap>
        <v-flex v-if="!!rmse">
          <v-container fluid>
            <table>
              <tr>
                <th class="orange--text">RMSE:</th>
                <td>{{rmse}}</td>
              </tr>
              <tr>
                <th class="orange--text">MAE:</th>
                <td>{{mae}}</td>
              </tr>
              <tr>
                <th class="orange--text">MAPE:</th>
                <td>{{mape}}</td>
              </tr>
            </table>
          </v-container>
        </v-flex>

        <v-flex>
          <v-container fluid>
            <v-text-field label="Número de horas para prever" v-model="predict"></v-text-field>
          </v-container>
        </v-flex>

        <v-flex>
          <v-container fluid>
            <v-text-field label="Limite de valor RMS" v-model="limiar"></v-text-field>
          </v-container>
        </v-flex>
      </v-layout>

      <h2>Gráfico RMS da leitura de vibração</h2>
      <v-layout>
        <div class="container mx-auto px-16">
          <g-chart type="AreaChart" :data="chartData" @ready="onChartReady"/>
        </div>
      </v-layout>
      <h2>Gráfico delta RMS</h2>
      <v-layout>
        <div class="container mx-auto px-16">
          <g-chart type="AreaChart" :data="chartDelta"/>
        </div>
      </v-layout>
      <h1 v-if="!!previsao">{{`Previsão para próxima falha: ${previsao} horas`}}</h1>
    </v-container>
  </v-content>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import ReadingService from "@/services/Reading/ReadingService";
import {
  LsArxCalculationService,
  LsCalculationService,
  RnnCalculationService
} from "@/services/Calculation";
import Tensorflow from "@/services/Tensorflow";
import { rejects } from "assert";

export default {
  name: "diagnosis",
  data: () => ({
    rmse: undefined,
    mae: undefined,
    mape: undefined,
    predict: 250,
    limiar: 200,
    previsao: undefined,
    showProgress: false,
    chartData: [],
    chartDelta: [],
    rmsData: [],
    predModel: undefined,
    google: undefined,
    preds: [
      {
        label: "Aproximação por Minimos Quadrados Polinomial",
        value: 1
      },
      {
        label: "Minimos Quadrados Auto-regressivo",
        value: 2
      },
      {
        label: "Rede Neural Recorrente",
        value: 3
      }
    ]
  }),
  computed: {
    ...mapState(["sensor"])
  },
  created() {
    this.readingService = new ReadingService(this.$resource);
    this.lscalculationService = new LsCalculationService(this.$resource);
    this.lsarxcalculationService = new LsArxCalculationService(this.$resource);
    this.rnncalculationService = new RnnCalculationService(this.$resource);

    if (_.isEmpty(this.sensor)) {
      this.$router.push("dashboard");
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
      this.chartDelta = [];
      this.calculateErrors(data)
        .then(result => {
          console.log(result);
          this.rmse = result.rmse;
          this.mae = result.mae;
          this.mape = result.mape;
        })
        .catch(err => {
          console.log(err);
        });
      var temp = ["Horas", "Valor Estimado", "Valor Real"];
      console.log(data);
      var prevRMS = 0;
      data = data.map((el, index) => {
        if (
          el[1] >= parseFloat(this.limiar) &&
          prevRMS === 0 &&
          index >= this.rmsData.length
        ) {
          prevRMS = el[0];
        }
        if (index < this.rmsData.length) {
          return [...el, parseFloat(this.rmsData[index].value)];
        } else {
          return [...el, undefined];
        }
      });

      this.chartData.push(temp);
      this.chartData = this.chartData.concat(data);
      var delta = this.chartData.map((el, index) => {
        if (index >= 2) {
          return [
            el[0],
            Math.abs(el[1] - this.chartData[index - 1][1]),
            Math.abs(el[2] - this.chartData[index - 1][2])
          ];
        } else {
          return [0, 0, 0];
        }
      });
      this.previsao = prevRMS - this.chartData[this.rmsData.length - 1][0];
      this.previsao = this.previsao > 0 ? this.previsao : undefined;
      delta.shift();
      delta.shift();
      this.chartDelta.push(temp);
      this.chartDelta = this.chartDelta.concat(delta);
      this.showProgress = false;
    },
    modeSelected(mode) {
      this.showProgress = true;
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
        .calculate({ sensor: this.sensor, predict: parseInt(this.predict) })
        .then(res => {
          this.prepareDataToChart(res.body.result);
        })
        .catch(err => {
          console.log(err);
        });
    },
    predictLSARX() {
      this.lsarxcalculationService
        .calculate({ sensor: this.sensor, predict: parseInt(this.predict) })
        .then(res => {
          this.prepareDataToChart(res.body.result);
        })
        .catch(err => {
          console.log(err);
        });
    },
    predictRNN() {
      this.rnncalculationService
        .calculate({ sensor: this.sensor, predict: parseInt(this.predict) })
        .then(res => {
          this.prepareDataToChart(res.body.result);
        })
        .catch(err => {
          console.log(err);
        });
    },
    async calculateErrors(estimated) {
      return new Promise((resolve, reject) => {
        try {
          var rmse = 0;
          var mae = 0;
          var mape = 0;
          var N = this.rmsData.length;
          estimated.forEach((el, index) => {
            if (index < N) {
              var y = parseFloat(this.rmsData[index].value);
              var diff = y - el[1];
              rmse = rmse + Math.pow(diff, 2);
              mae = mae + Math.abs(diff);
              mape = mape + Math.abs(diff / y);
            }
          });
          rmse = Math.sqrt(rmse / N);
          mae = mae / N;
          mape = (mape / N) * 100;
          resolve({ rmse, mae, mape });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
</script>

<style>
</style>
