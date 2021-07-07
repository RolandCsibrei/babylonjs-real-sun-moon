declare module 'babylonjs-real-sun-moon' {
  import {
    DirectionalLight,
    Scene,
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
    northDirection: {
      x: number;
      y: number;
      z: number;
    };
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
    position: {
      x: number;
      y: number;
      z: number;
    };
    angles: RealSunAngles;
    lat: number;
    lng: number;
    northDirection: {
      x: number;
      y: number;
      z: number;
    };
  }
  export class RealSun {
    private _transform;
    private _radius;
    private _lat;
    private _lng;
    private _northDirection;
    private _options;
    private _scene;
    private _sunLight?;
    private _sunName;
    private _beforeRenderObservable;
    private _times;
    private _dayStart;
    private _sunrise;
    private _sunriseEnd;
    private _sunset;
    private _sunsetEnd;
    private _isDay;
    private _isNight;
    private _isSunrise;
    private _isSunset;
    private _intensity;
    private _dayTime;
    private _position;
    private _angles;
    private _transformParent;
    private _axesParent;
    private _sunMesh;
    private _sunMaterial;
    private _now;
    constructor(
      _transform: TransformNode,
      _radius: number,
      _lat: number,
      _lng: number,
      _northDirection: Vector3,
      _options: RealSunOptions,
      _scene: Scene,
      _sunLight?: DirectionalLight | undefined
    );
    setDateTimeInMillis(date: number, recalc?: boolean): void;
    setParameters(params: RealSunParamaters): void;
    calcSunPosition(): void;
    calcSunAngles(): void;
    getInfo(): RealSunInfo;
    getNow(): number;
    setSun(sun: DirectionalLight): void;
    moveSun(): void;
    showGadgets(): void;
    hideGadgets(): void;
    createDefaultSunLight(): DirectionalLight;
    private getPositionOffset;
    stopTimeSync(): void;
    startTimeSync(): void;
    static getCurrentDate(): number;
    static getCurrentDateShifted(shiftByMillis: number): Date;
    createDefaultSunMesh(addGlowLayer?: boolean): void;
    private makeTextPlane;
    hideAxes(): void;
    showAxes(size?: number): void;
  }
  //# sourceMappingURL=RealSun.d.ts.map
}
