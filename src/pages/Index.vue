<template>
  <canvas class="bjs-canvas" />
</template>

<script lang="ts">
import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  PointLight,
  Scene,
  SceneLoader,
  ShadowGenerator,
  TransformNode,
  Vector3,
} from '@babylonjs/core';

import '@babylonjs/core/Meshes/meshBuilder';

import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';

import { defineComponent, onMounted, PropType } from 'vue';
import { RealSun, RealSunParamaters } from 'src/RealSun';

let realSun: RealSun | null = null;
export default defineComponent({
  name: 'RealSunSample',
  props: {
    isGadgetsVisible: {
      type: Boolean,
      default: true,
    },
    isAxesVisible: {
      type: Boolean,
      default: true,
    },
    isPlaying: {
      type: Boolean,
      default: true,
    },
    realSunParameters: {
      type: Object as unknown as PropType<RealSunParamaters>,
      required: false,
    },
  },
  watch: {
    isGadgetsVisible(val) {
      if (val === true) {
        realSun?.showGadgets();
      } else {
        realSun?.hideGadgets();
      }
    },

    isAxesVisible(val) {
      if (val === true) {
        realSun?.showAxes();
      } else {
        realSun?.hideAxes();
      }
    },
    isPlaying(val) {
      if (val === true) {
      } else {
      }
    },

    realSunParameters(val) {
      realSun?.setParameters(val);
    },
  },

  setup(props, { emit }) {
    onMounted(async () => {
      const canvas = document.getElementsByClassName(
        'bjs-canvas'
      )[0] as HTMLCanvasElement;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const engine = new Engine(canvas);
      var scene = new Scene(engine);

      // load model
      const base =
        location.hostname === 'localhost' || location.hostname === '127.0.0.1'
          ? '/models/'
          : 'https://babylonjs.nascor.tech/real-sun/models/';
      const loaded = await SceneLoader.AppendAsync(
        base,
        'real-sun-building-trees.glb',
        scene
      );
      const root = loaded.meshes[0];
      root.rotation = Vector3.Zero();
      //

      const ground = scene.getMeshByName('Plane_Baked');
      if (ground) {
        ground.receiveShadows = true;
      }
      const building = scene.getMeshByName('BuildingA_Baked');
      const sunTransform = new TransformNode('sunTransform', scene);

      const lat = 47.53217606106968;
      const lng = 19.06586400848718;
      const radius = 40;
      const northDirection = new Vector3(0.2, 0, -1);
      realSun = new RealSun(
        sunTransform,
        radius,
        lat,
        lng,
        northDirection,
        {},
        scene
      );

      const sun = realSun.createDefaultSunLight();
      realSun.showAxes();
      realSun.createDefaultSunMesh(true);
      realSun.showGadgets();

      // realSun.startTimeSync();

      // setup shadow generator with our sun
      var shadowGenerator = new ShadowGenerator(1024, sun);
      if (building) {
        shadowGenerator.addShadowCaster(building);
      }
      const trees = scene.meshes.filter(
        (m) => m.name.startsWith('leaves') || m.name.startsWith('Regular')
      );
      trees.forEach((t) => {
        shadowGenerator.addShadowCaster(t);
      });
      shadowGenerator.useExponentialShadowMap = true;
      shadowGenerator.setDarkness(0);

      // setup camera
      var camera = new ArcRotateCamera(
        'camera1',
        -0.7,
        1,
        110,
        new Vector3(0, 0, 0),
        scene
      );
      camera.setTarget(Vector3.Zero());
      camera.attachControl(canvas, true);
      camera.useAutoRotationBehavior = true;

      // ambient light
      const ambientLight = new HemisphericLight(
        'ambientLight',
        new Vector3(0, 1, 0),
        scene
      );
      ambientLight.intensity = 0.7;

      // night light
      const nightLight = new PointLight(
        'nightLight',
        new Vector3(1.8, 19, 0),
        scene
      );
      nightLight.diffuse = new Color3(1, 0, 0);
      nightLight.specular = new Color3(0, 1, 0);
      nightLight.intensity = 0.1;

      let nowOffset = 0;
      let add = 100000;
      scene.onBeforeRenderObservable.add(() => {
        nowOffset += add;

        if (realSun && props.isPlaying === true) {
          realSun.setDateTimeInMillis(Date.now() + nowOffset, false);
          realSun.calc();
          realSun.calcSunPosition();
          realSun.moveSun();
          // slow down the motion while in sunset or sunrise
          const info = realSun.getInfo();
          emit('realSunInfoReceived', info);
          if (info.isSunset === true || info.isSunrise === true) {
            add = 400;
          } else {
            add = 50000;
          }

          scene.clearColor = new Color4(0.2, 0.4, 0.7, 1).multiply(
            new Color4(info.intensity, info.intensity, info.intensity, 1)
          );
          nightLight.intensity = 100 - info.intensity * 100;
          ambientLight.intensity = info.intensity > 0.7 ? 0.7 : info.intensity;
        }
      });

      // void scene.debugLayer.show({ overlay: true });

      const onWindowResize = () => {
        engine.resize();
      };

      window.addEventListener('resize', onWindowResize);
      engine.runRenderLoop(() => {
        scene.render();
      });
    });

    return {};
  },
});
</script>
