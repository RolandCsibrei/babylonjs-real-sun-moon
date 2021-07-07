import SunCalc from '../src/suncalc';
import { getRandomStarName } from '../src/stars';
import { get } from 'src/get';

import {
  Color3,
  DirectionalLight,
  DynamicTexture,
  GlowLayer,
  Mesh,
  MeshBuilder,
  Observer,
  PBRMaterial,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core';

export interface RealSunOptions {
  sunMaxIntensity?: number;
}

export interface RealSunAngles {
  azimuth: number;
  altitude: number;
}

export interface RealSunParamaters {
  lat: number;
  lng: number;
  northDirection: { x: number; y: number; z: number };
  radius: number;
  time: number;
}

export interface RealSunInfo {
  name: string;
  radius: number;
  now: number;
  sunrise: number;
  sunriseEnd: number;
  sunset: number;
  sunsetEnd: number;
  dayStart: number;
  isDay: boolean;
  isSunrise: boolean;
  isSunset: boolean;
  isNight: boolean;
  intensity: number;
  dayTime: number;
  position: { x: number; y: number; z: number };
  angles: RealSunAngles;
  lat: number;
  lng: number;
  northDirection: { x: number; y: number; z: number };
}

export class RealSun {
  // private _sunRotationCenter: TransformNode | null = null;
  private _sunName = '';
  private _beforeRenderObservable: Observer<Scene> | null = null;

  private _times!: unknown;
  private _dayStart!: number;
  private _sunrise!: number;
  private _sunriseEnd!: number;
  private _sunset!: number;
  private _sunsetEnd!: number;
  private _isDay!: boolean;
  private _isNight!: boolean;
  private _isSunrise!: boolean;
  private _isSunset!: boolean;
  private _intensity!: number;
  private _dayTime!: number;
  private _position!: { x: number; y: number; z: number };
  private _angles!: RealSunAngles;

  private _transformParent: TransformNode;

  private _now!: number;

  constructor(
    private _transform: TransformNode,
    private _radius: number,
    private _lat: number,
    private _lng: number,
    private _northDirection: Vector3,
    private _options: RealSunOptions,
    private _scene: Scene,
    private _sunLight?: DirectionalLight
  ) {
    this._sunName = getRandomStarName();

    this._transformParent = new TransformNode(
      'RealSun-ParentTransform',
      this._scene
    );
    this._transform.setParent(this._transformParent);

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    this._now = date.getTime();

    this.calc();
    this.calcSunPosition();

    if (this._sunLight) {
      this._sunLight.position = this.getPositionOffset();
    }
  }

  public setDateTimeInMillis(date: number, recalc = true) {
    this._now = date;
    if (recalc) {
      this.calc();
      this.calcSunPosition();
      this.moveSun();
    }
  }

  public setParameters(params: RealSunParamaters) {
    this._sunName = getRandomStarName();
    this._radius = params.radius;
    this._lat = params.lat;
    this._lng = params.lng;
    this._northDirection = new Vector3(
      params.northDirection.x,
      params.northDirection.y,
      params.northDirection.z
    );
    this.setDateTimeInMillis(params.time, false);
    this.hideAxes();
    this.showAxes();
    if (this._sunLight) {
      this._sunLight.position = this.getPositionOffset();
    }

    if (this._sunMesh) {
      this._sunMesh.position = this.getPositionOffset();
    }
    this.calc();
    this.calcSunPosition();
    this.moveSun();
  }

  public calcSunPosition() {
    // altitude?: number) {
    const positions = SunCalc.getPosition(this._now, this._lat, this._lng);
    this._angles = positions;
    this._transformParent.rotation.x = positions.altitude;
    this._transformParent.rotation.y = -positions.azimuth;
    if (this._sunLight) {
      this._position = this._sunLight.getAbsolutePosition();
    }
  }

  public calc() {
    this._times = SunCalc.getTimes(this._now, this._lat, this._lng, 0);
    this._sunrise = get<Date>(this._times, 'sunrise').getTime();
    this._sunriseEnd = get<Date>(this._times, 'sunriseEnd').getTime();
    this._sunset = get<Date>(this._times, 'sunsetStart').getTime();
    this._sunsetEnd = get<Date>(this._times, 'sunset').getTime();

    if (this._now > this._sunrise && this._now < this._sunriseEnd) {
      this._isSunrise = true;
      const period = this._sunriseEnd - this._sunrise;
      const offset = this._now - this._sunrise;
      const intensityStep = 1 / period;
      this._intensity = intensityStep * offset;
    } else {
      this._isSunrise = false;
    }

    if (this._now > this._sunriseEnd && this._now < this._sunset) {
      // day
      this._isDay = true;
      this._intensity = 1;
    } else {
      this._isDay = false;
    }
    if (this._now > this._sunset && this._now < this._sunsetEnd) {
      // sun going down
      this._sunName = getRandomStarName();
      this._isSunset = true;
      const period = this._sunsetEnd - this._sunset;
      const offset = this._sunsetEnd - this._now;
      const intensityStep = 1 / period;
      this._intensity = intensityStep * offset;
    } else {
      this._isSunset = false;
    }

    if (this._now > this._sunsetEnd) {
      // night
      if (this._isNight === false) {
      }
      this._isNight = true;
      this._intensity = 0;
    } else {
      this._isNight = false;
    }
  }

  //

  getInfo() {
    const info: RealSunInfo = {
      name: this._sunName,
      radius: this._radius,
      sunrise: this._sunrise,
      sunriseEnd: this._sunriseEnd,
      sunset: this._sunset,
      sunsetEnd: this._sunsetEnd,
      isDay: this._isDay,
      isNight: this._isNight,
      intensity: this._intensity,
      isSunrise: this._isSunrise,
      isSunset: this._isSunset,
      dayStart: this._dayStart,
      now: this._now,
      dayTime: this._dayTime,
      position: {
        x: this._position.x,
        y: this._position.y,
        z: this._position.z,
      },
      angles: this._angles,
      lat: this._lat,
      lng: this._lng,
      northDirection: {
        x: this._northDirection.x,
        y: this._northDirection.y,
        z: this._northDirection.z,
      },
    };
    return info;
  }

  getNow() {
    return this._now;
  }

  setSun(sun: DirectionalLight) {
    this._sunLight = sun;
  }

  public moveSun() {
    if (!this._sunLight) return;

    this._sunLight.setDirectionToTarget(Vector3.Zero());
    if (this._sunMesh) {
    }
    const maxIntensitySun = this._options.sunMaxIntensity ?? 1;
    this._sunLight.intensity = this._intensity * maxIntensitySun;
  }

  showGadgets() {
    this.createDefaultSunMesh();
  }

  hideGadgets() {
    if (this._sunMesh) {
      this._sunMesh.dispose();
      this._sunMesh = null;
    }
  }

  createDefaultSunLight(): DirectionalLight {
    const sunDirection = Vector3.Zero();

    const sun = new DirectionalLight(
      `RealSun-${this._sunName}`,
      sunDirection,
      this._scene
    );
    this._sunLight = sun;

    sun.position = this.getPositionOffset();
    sun.range = this._radius;
    sun.intensity = this._options.sunMaxIntensity ?? 1;
    this.calc();

    sun.parent = this._transform;

    return sun;
  }

  getPositionOffset() {
    const radius = this._radius;
    return this._northDirection
      .normalize()
      .multiplyByFloats(radius, radius, radius);
  }

  //

  stopTimeSync(): void {
    if (this._beforeRenderObservable) {
      this._scene.onBeforeRenderObservable.remove(this._beforeRenderObservable);
    }
  }

  startTimeSync(): void {
    if (!this._sunLight) {
      console.error(
        'No sun. Call createDefaultSun() to create one or provide one in the constructor.'
      );
      return;
    }

    this.calc();

    this._beforeRenderObservable = this._scene.onBeforeRenderObservable.add(
      () => this.moveSun()
    );
  }

  //

  public static getCurrentTimeInMillis() {
    return Date.now().valueOf();
  }
  public static getCurrentDate() {
    return Date.now();
  }
  public static getCurrentDateShifted(shiftByMillis: number) {
    const shifted = this.getCurrentTimeInMillis() + shiftByMillis * 10000;
    return new Date(shifted);
  }

  //

  private _sunMesh: Mesh | null = null;
  private _sunMaterial: PBRMaterial | null = null;

  createDefaultSunMesh(addGlowLayer = false) {
    if (this._sunMesh) return;

    const name = `RealSun-Mesh-${this._sunName}`;
    const sunMesh = MeshBuilder.CreateSphere(
      name,
      { diameter: 6 },
      this._scene
    );
    this._sunMesh = sunMesh;
    sunMesh.parent = this._transform;
    sunMesh.position = this.getPositionOffset();

    const sunMat =
      this._sunMaterial ??
      new PBRMaterial(`RealSun-Material-${this._sunName}`, this._scene);
    this._sunMaterial = sunMat;
    sunMat.emissiveColor = new Color3(1, 1, 0);
    sunMesh.material = sunMat;

    if (addGlowLayer) {
      new GlowLayer('glow', this._scene, {
        mainTextureFixedSize: 256,
        blurKernelSize: 64,
      });
    }
  }

  private makeTextPlane(
    text: string,
    color: string,
    size: number,
    parent: TransformNode
  ) {
    const dynamicTexture = new DynamicTexture(
      'RealSun-TextTexture',
      50,
      this._scene,
      true
    );
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
      text,
      5,
      40,
      'bold 36px Arial',
      color,
      'transparent',
      true
    );
    const plane = Mesh.CreatePlane('TextPlane', size, this._scene, true);
    const material = new StandardMaterial('TextPlaneMaterial', this._scene);
    material.backFaceCulling = false;
    material.specularColor = new Color3(0, 0, 0);
    material.diffuseTexture = dynamicTexture;
    plane.material = material;
    plane.parent = parent;
    return plane;
  }

  private _axesParent: TransformNode | null = null;

  public hideAxes() {
    if (!this._axesParent) return;
    this._axesParent.getChildren().forEach((n) => n.dispose());
    this._axesParent?.dispose();
    this._axesParent = null;
  }

  public showAxes(size?: number) {
    if (this._axesParent) return;

    this._axesParent = new TransformNode(
      'RealSun-AxesParentTransform',
      this._scene
    );
    size = size ?? this._radius;
    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0),
        new Vector3(size * 0.95, -0.05 * size, 0),
      ],
      this._scene
    );
    axisX.color = new Color3(1, 0, 0);
    const xChar = this.makeTextPlane('X', 'red', size / 10, this._axesParent);
    xChar.position = new Vector3(0.9 * size, 0.05 * size, 0);
    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(),
        new Vector3(0, size, 0),
        new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0),
        new Vector3(0.05 * size, size * 0.95, 0),
      ],
      this._scene
    );
    axisY.color = new Color3(0, 1, 0);
    const yChar = this.makeTextPlane('Y', 'green', size / 10, this._axesParent);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(),
        new Vector3(0, 0, size),
        new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size),
        new Vector3(0, 0.05 * size, size * 0.95),
      ],
      this._scene
    );
    axisZ.color = new Color3(0, 0, 1);
    const zChar = this.makeTextPlane('Z', 'blue', size / 10, this._axesParent);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);

    const centerOfRotation = Vector3.ZeroReadOnly;
    const axisN = MeshBuilder.CreateLines(
      'axisLine',
      {
        points: [
          Vector3.ZeroReadOnly,
          centerOfRotation.add(this._northDirection.scale(50)),
        ],
      },
      this._scene
    );
    axisN.color = new Color3(1, 1, 0);

    axisX.parent = this._axesParent;
    axisY.parent = this._axesParent;
    axisZ.parent = this._axesParent;
    axisN.parent = this._axesParent;
  }
}
