<template>
  <v-content class="plant">
    <v-container fluid >
      <span>
        <h1>Motores</h1>
      </span>
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="blue"
        @click="dialog = true"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            Adicionar Motor
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="label"
                label="Nome"
                :rules="labelRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="power"
                label="Potência"
                :rules="powerRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="location"
                label="Localização"
                :rules="locationRules"
                required
              ></v-text-field> 
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
             <v-btn
                color="primary"
                :disabled="!valid"
                @click="submit"
              >
                Salvar
              </v-btn>
              <v-btn @click="clear">Limpar</v-btn>
            <v-btn color="primary" flat @click="dialog=false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title>
            {{`Adicionar novo sensor ao motor ${selectedMotor.label}`}}
          </v-card-title>
          <v-card-text>
            <v-form ref="form2" v-model="valid2" lazy-validation>
              <v-text-field
                v-model="labelSensor"
                label="Nome"
                :rules="labelRules"
                required
              ></v-text-field>
              <v-select
                v-model="sensorType"
                :items="sensorTypes"
                label="Tipo"
                required
              ></v-select> 
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
             <v-btn
                color="primary"
                :disabled="!valid2"
                @click="submitSensor"
              >
                Salvar
              </v-btn>
              <v-btn @click="clear2">Limpar</v-btn>
            <v-btn color="primary" flat @click="dialog2=false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container fluid grid-list-xl>
        <v-layout row wrap>
          <v-flex v-for="motor in motors" :key="motor.id" xs4 >
            <v-card>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{motor.label}}</h3> <br>
                  <span>{{`Localização: ${motor.location}`}}</span> <br>
                  <span>{{`Potência: ${motor.power}`}}</span> <br>
                </div>
                 <v-btn
                  absolute
                  dark
                  small
                  fab
                  top
                  right
                  color="red"
                  @click="deleteMotor(motor)"
                >
                  <v-icon>close</v-icon>
                </v-btn>
              </v-card-title>

              <v-card-actions>
                <v-spacer />
                <v-btn flat color="orange" @click="addSensor(motor)">Adicionar Sensor</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          
        </v-layout>
      </v-container>
    </v-container>
  </v-content>  
</template>

<script>
import MotorService from '@/services/Motor/MotorService';
import SensorService from '@/services/Sensor/SensorService';

export default {
  name: 'plant',
  data: () => ({
    selectedMotor: {},
    valid: false,
    dialog: false,
    dialog2: false,
    sensorTypes: ['Temperatura', 'Vibração (RMS)'],
    sensorType: '',
    labelSensor: '',
    valid2: true,
    motors: [],
    motorsCount: 0,
    valid: true,
    label: '',
    labelRules: [v => !!v || 'Nome é necessário'],
    power: '',
    powerRules: [v => !!v || 'Potência é necessária'],
    location: '',
    locationRules: [v => !!v || 'Localização é necessária']
  }),
  created() {
    this.motorService = new MotorService(this.$resource);
    this.sensorService = new SensorService(this.$resource);

    this.motorService
      .listAll()
      .then(res => {
        this.motors = res.rows;
        this.motorsCount = res.count;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.motorService
          .save({
            label: this.label,
            power: this.power,
            location: this.location
          })
          .then(result => {
            alert('Motor salvo com sucesso');
            this.$refs.form.reset();
            this.dialog = false;
            this.motors.push(result.body);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    submitSensor() {
      if (this.$refs.form2.validate()) {
        this.sensorService
          .save({
            label: this.labelSensor,
            motor: this.selectedMotor.id,
            type: this.sensorType
          })
          .then(result => {
            alert('Sensor salvo com sucesso');
            this.$refs.form2.reset();
            this.dialog2 = false;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    clear2() {
      this.$refs.form2.reset();
    },
    deleteMotor(motor) {
      if (confirm(`Você deseja apagar o motor: ${motor.label}?`)) {
        this.sensorService
          .listAll({ motor: motor.id })
          .then(res => {
            var count = 0;
            res.rows.forEach(element => {
              this.sensorService
                .delete(element.id)
                .then(result => {
                  count++;
                  if (count === res.count) {
                    this.motorService
                      .delete(motor.id)
                      .then(result => {
                        this.motors = this.motors.filter(
                          el => el.id !== motor.id
                        ); // remove motor from array
                      })
                      .catch(err => {
                        alert('Algo errado aconteceu, tente novamente.');
                        console.log(err);
                      });
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    addSensor(motor) {
      this.selectedMotor = motor;
      this.dialog2 = true;
    }
  }
};
</script>

<style>
.form {
  padding: 8px;
}
</style>
