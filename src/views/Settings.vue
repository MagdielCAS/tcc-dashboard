<template>
  <v-content class="settings">
    <v-container fluid>
    <span> <h1>Configurações</h1></span>
    <v-select
      v-model="sensor"
      :items="sensors"
      item-text="label"
      item-value="id"
      return-object
      label="Selecione o Sensor"
    ></v-select> 
    <v-layout v-if="sensor!==undefined">
      <v-container fluid>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="period"
            :rules="rules"
            mask="##"
            label="Periodicidade, em horas"
            required
          ></v-text-field>
          <v-text-field
            v-model="size"
            :rules="rules"
            label="Tempo de gravação, em segundos"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="primary"
            @click="submit"
          >
            Enviar
          </v-btn>
          <v-btn @click="clear">Limpar</v-btn>
        </v-form>
      </v-container>
    </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import SensorService from '@/services/Sensor/SensorService';
import SensorConfigurationService from '@/services/SensorConfiguration/SensorConfigurationService';
export default {
  name: 'settings',
  created() {
    this.sensorService = new SensorService(this.$resource);
    this.configurationService = new SensorConfigurationService(this.$resource);

    this.sensorService
      .listAll()
      .then(res => {
        console.log(res);
        this.sensors = res.rows;
      })
      .catch(err => {
        console.log(err);
      });
  },
  data: () => ({
    sensors: [],
    sensor: undefined,
    valid: true,
    period: '',
    rules: [v => !!v || 'Campo necessário'],
    size: ''
  }),
  methods: {
    submit() {
      var configuration = {
        sensor: this.sensor.id,
        period: this.period,
        time: this.size
      };
      this.configurationService
        .config(configuration)
        .then(res => {
          alert('Sensor configurado com sucesso!');
          this.clear();
        })
        .catch(err => {
          alert('Algo deu errado, tente novamente!');
          console.log(err);
        });
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>

<style>
</style>
