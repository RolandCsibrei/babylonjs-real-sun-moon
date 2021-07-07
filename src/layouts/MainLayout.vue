<template>
  <q-layout view="hHh lpR lfr">
    <q-header bordered class="bg-red-4 text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="isDrawerOpened = !isDrawerOpened"
        />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          BabylonJS RealSun
        </q-toolbar-title>
        <span class="q-mx-md q-pa-sm bg-white text-black">{{
          isDay
            ? 'Day'
            : isSunrise
            ? 'Sunrise'
            : isSunset
            ? 'Sunset'
            : isNight
            ? 'Night'
            : 'No clue'
        }}</span>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="isDrawerOpened"
      side="left"
      overlay
      behavior="desktop"
      bordered
      class="q-pa-sm"
    >
      <div v-if="realSunInfo">
        <q-input label="Now" :disable="true" v-model="realSunInfo.now" />
        <q-input label="Date" :disable="true" v-model="dateText" />
        <q-input label="Time" :disable="true" v-model="timeText" />
        <q-input label="Intensity" :disable="true" v-model="intensity" />
        <q-input label="Azimuth" :disable="true" v-model="angleAzimuth" />
        <q-input label="Altitude" :disable="true" v-model="angleAltitude" />
        <q-input label="X" :disable="true" v-model="x" />
        <q-input label="Y" :disable="true" v-model="y" />
        <q-input label="Z" :disable="true" v-model="z" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view
        @realSunInfoReceived="realSunInfoReceived"
        :isGadgetsVisible="isGadgetsVisible"
        :isAxesVisible="isAxesVisible"
        :realSunParameters="realSunParameters"
      />
    </q-page-container>

    <q-drawer
      v-model="isRightDrawerOpened"
      side="right"
      overlay
      behavior="desktop"
      bordered
      class="q-pa-sm"
    >
      <div v-if="realSunInfo">
        <q-input
          label="Sun name"
          :disable="true"
          class="text-h6"
          v-model="realSunInfo.name"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="refresh" @click="setParameters" />
          </template>
        </q-input>
        <div class="q-ma-md" />
        <q-input label="Lat" v-model="lat" />
        <q-input label="Lng" v-model="lng" />
        <q-input label="North X" v-model="northDirectionX" />
        <q-input label="North Y" v-model="northDirectionY" />
        <q-input label="North Z" v-model="northDirectionZ" />
        <q-input label="Radius" v-model="radius" />
        <q-btn
          label="GO"
          color="green"
          class="q-mt-sm"
          @click="setParameters"
        />
      </div>
    </q-drawer>
  </q-layout>
</template>

<script lang="ts">
import { RealSunInfo, RealSunParamaters } from 'src/RealSun';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'MainLayout',
  setup() {
    const dateText = ref('');
    const timeText = ref('');
    const angleAzimuth = ref('');
    const angleAltitude = ref('');
    const intensity = ref('');
    const x = ref('');
    const y = ref('');
    const z = ref('');
    const radius = ref('');
    const isDay = ref(false);
    const isNight = ref(false);
    const isSunrise = ref(false);
    const isSunset = ref(false);
    const realSunInfo = ref<RealSunInfo | null>(null);

    const lat = ref('');
    const lng = ref('');
    const northDirectionX = ref('');
    const northDirectionY = ref('');
    const northDirectionZ = ref('');
    const realSunParameters = ref<RealSunParamaters | null>(null);

    const realSunInfoReceived = (info: RealSunInfo) => {
      realSunInfo.value = { ...info };
      const sunNow = new Date(info.now ?? 0);
      dateText.value = sunNow.toLocaleDateString();
      timeText.value = sunNow.toLocaleTimeString();
      angleAzimuth.value = info.angles.azimuth.toFixed(4);
      angleAltitude.value = info.angles.altitude.toFixed(4);
      intensity.value = `${info.intensity}`;
      x.value = info.position.x.toFixed(3);
      y.value = info.position.y.toFixed(3);
      z.value = info.position.z.toFixed(3);
      radius.value = info.radius.toFixed(2);
      isDay.value = info.isDay;
      isNight.value = info.isNight;
      isSunrise.value = info.isSunrise;
      isSunset.value = info.isSunset;
      lat.value = info.lat.toString();
      lng.value = info.lng.toString();
      northDirectionX.value = `${info.northDirection.x}`;
      northDirectionY.value = `${info.northDirection.y}`;
      northDirectionZ.value = `${info.northDirection.z}`;
    };

    const setParameters = () => {
      realSunParameters.value = {
        lat: parseFloat(lat.value),
        lng: parseFloat(lng.value),
        northDirection: {
          x: parseFloat(x.value),
          y: parseFloat(x.value),
          z: parseFloat(x.value),
        },
        radius: parseFloat(radius.value),
      };
    };

    const isDrawerOpened = ref(true);
    const isRightDrawerOpened = ref(true);
    const isGadgetsVisible = ref(true);
    const isAxesVisible = ref(true);
    const isShowParameterDialog = ref(true);

    return {
      realSunInfoReceived,
      isDrawerOpened,
      isRightDrawerOpened,
      isGadgetsVisible,
      isAxesVisible,
      isShowParameterDialog,
      setParameters,
      realSunParameters,
      realSunInfo,
      dateText,
      timeText,
      angleAzimuth,
      angleAltitude,
      intensity,
      x,
      y,
      z,
      radius,
      isDay,
      isNight,
      isSunrise,
      isSunset,
      lat,
      lng,
      northDirectionX,
      northDirectionY,
      northDirectionZ,
    };
  },
});
</script>
