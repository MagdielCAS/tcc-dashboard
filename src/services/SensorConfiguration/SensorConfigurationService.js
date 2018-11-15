export default class SensorConfigurationService {
  constructor(resource) {
    this._resource = resource('SensorConfigurations{/id}{?q,p}');
  }

  config(body) {
    return this._resource.save(body);
  }
}
