<template>
  <q-layout view="hHh lpR lfr">
    <q-header bordered>
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          :class="
            $q.platform.is.mobile
              ? 'animated heartBeat infinite drawerButton'
              : ''
          "
          @click="isDrawerOpened = !isDrawerOpened"
        />

        <q-toolbar-title>
          <q-avatar>
            <img src="icons/babylon-logo.png" />
          </q-avatar>
          BabylonJS RealSun
        </q-toolbar-title>
        <q-btn
          :label="$q.platform.is.mobile ? '' : 'Play'"
          @click="isDemoPlaying = true"
          color="green"
          icon="play_arrow"
          :dense="true"
          :disable="isDemoPlaying"
        />
        <q-btn
          :label="$q.platform.is.mobile ? '' : 'Pause'"
          @click="isDemoPlaying = false"
          color="grey"
          icon="pause"
          :dense="true"
          class="on-right"
          :disable="!isDemoPlaying"
        />
        <q-space />
        <q-btn
          :label="$q.platform.is.mobile ? '' : 'Toggle sun'"
          @click="isGadgetsVisible = !isGadgetsVisible"
          color="blue"
          icon="wb_sunny"
          :dense="true"
        />
        <q-btn
          :label="$q.platform.is.mobile ? '' : 'Toggle axes'"
          @click="isAxesVisible = !isAxesVisible"
          color="light-blue"
          :dense="true"
          icon="perm_data_setting"
          class="on-right"
        />
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="isRightDrawerOpened = !isRightDrawerOpened"
          :class="
            $q.platform.is.mobile
              ? 'animated heartBeat infinite drawerButton'
              : ''
          "
          class="on-right"
        />
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
        <q-input
          label="Time"
          :disable="true"
          v-model="timeText"
          class="text-h4"
        >
          <template v-slot:append>
            <span>{{
              isDay
                ? 'Day'
                : isSunrise
                ? 'Sunrise'
                : isSunset
                ? 'Sunset'
                : isNight
                ? 'Night'
                : 'Night'
            }}</span>
          </template>
        </q-input>

        <q-input
          label="Intensity"
          :disable="true"
          v-model="intensity"
          class="text-h5"
        />
        <q-input label="Now" :disable="true" v-model="realSunInfo.now" />
        <q-input label="Date" :disable="true" v-model="dateText" />
        <q-input label="Azimuth" :disable="true" v-model="angleAzimuth" />
        <q-input label="Altitude" :disable="true" v-model="angleAltitude" />
        <q-input label="X" :disable="true" v-model="x" />
        <q-input label="Y" :disable="true" v-model="y" />
        <q-input label="Z" :disable="true" v-model="z" />

        <q-list separator>
          <q-item>
            <q-item-section avatar> Sunrise </q-item-section>
            <q-item-section>
              {{ toTimeString(realSunInfo.sunrise) }} -
              {{ toTimeString(realSunInfo.sunriseEnd) }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar> Sunset </q-item-section>
            <q-item-section>
              {{ toTimeString(realSunInfo.sunset) }} -
              {{ toTimeString(realSunInfo.sunsetEnd) }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view
        @realSunInfoReceived="realSunInfoReceived"
        :isGadgetsVisible="isGadgetsVisible"
        :isAxesVisible="isAxesVisible"
        :realSunParameters="realSunParameters"
        :isPlaying="isDemoPlaying"
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
        <q-input label="Star name" class="text-h6" v-model="realSunInfo.name">
          <template v-slot:append>
            <q-btn round dense flat icon="refresh" @click="setParameters" />
          </template>
        </q-input>
        <div class="q-ma-md" />
        <q-time :disable="!isEdit" v-model="time" flat />

        <q-input label="Lat" v-model="lat" />
        <q-input label="Lng" v-model="lng" />
        <q-input label="North X" v-model="northDirectionX" />
        <q-input label="North Y" v-model="northDirectionY" />
        <q-input label="North Z" v-model="northDirectionZ" />
        <q-input label="Radius" v-model="radius" />
        <q-btn
          :disable="isEdit"
          label="Edit"
          color="orange"
          class="q-mt-sm"
          icon="edit"
          @click="edit"
        />
        <q-btn
          :disable="!isEdit"
          label="Save"
          color="green"
          icon="save"
          class="q-mt-sm on-right"
          @click="setParameters"
        />
      </div>
    </q-drawer>
  </q-layout>
</template>

<script lang="ts">
import { RealSunInfo, RealSunParamaters } from 'library/src/RealSun';
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'MainLayout',
  setup() {
    const $q = useQuasar();
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
    const time = ref('');

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
      let localeTimeString = sunNow.toLocaleTimeString();
      const localeTimeStringSplitted = localeTimeString.split(':');
      localeTimeString =
        parseInt(localeTimeStringSplitted[0]) < 10
          ? `0${localeTimeString}`
          : localeTimeString;
      timeText.value = localeTimeString;
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
      time.value = localeTimeString;
    };

    const setParameters = () => {
      const timeSplitted = time.value.split(':');
      const timeInMillis =
        Date.now() +
        parseInt(timeSplitted[0]) * 60 * 60 * 1000 +
        parseInt(timeSplitted[1]) * 60 * 1000;
      realSunParameters.value = {
        lat: parseFloat(lat.value),
        lng: parseFloat(lng.value),
        northDirection: {
          x: parseFloat(northDirectionX.value),
          y: parseFloat(northDirectionY.value),
          z: parseFloat(northDirectionZ.value),
        },
        radius: parseFloat(radius.value),
        time: timeInMillis,
      };
      isEdit.value = false;
    };

    const edit = () => {
      isDemoPlaying.value = false;
      isEdit.value = true;
    };

    const toTimeString = (millis: number) => {
      return new Date(millis).toLocaleTimeString();
    };

    const isDrawerOpened = ref(!$q.platform.is.mobile);
    const isRightDrawerOpened = ref(!$q.platform.is.mobile);
    const isGadgetsVisible = ref(true);
    const isAxesVisible = ref(true);
    const isDemoPlaying = ref(true);
    const isEdit = ref(false);

    return {
      realSunInfoReceived,
      isDrawerOpened,
      isRightDrawerOpened,
      isGadgetsVisible,
      isAxesVisible,
      isDemoPlaying,
      isEdit,
      setParameters,
      edit,
      toTimeString,
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
      time,
    };
  },
});
</script>

<style>
div.q-time__clock-circle {
  overflow: visible;
}
.drawerButton {
  --animate-duration: 2s;
}
</style>
