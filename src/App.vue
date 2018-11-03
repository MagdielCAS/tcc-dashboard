<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list dense>
        <v-list-tile href="#/" >
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="#/settings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Plataforma IoT/PM</v-toolbar-title>
    </v-toolbar>
    <router-view />
    <v-footer app fixed>
      <span style="margin: 0 auto;">Magdiel Campelo &copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
</style>

<script>
export default {
  created() {},
  data: () => ({
    drawer: false
  }),
  props: {
    source: String
  }
};
</script>
