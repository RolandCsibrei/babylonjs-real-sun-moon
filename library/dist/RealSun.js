"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealSun = void 0;
var suncalc_1 = __importDefault(require("./suncalc"));
var stars_1 = require("./stars");
var get_1 = require("./get");
var core_1 = require("@babylonjs/core");
var RealSun = /** @class */ (function () {
    function RealSun(_transform, _radius, _lat, _lng, _northDirection, _options, _scene, _sunLight) {
        this._transform = _transform;
        this._radius = _radius;
        this._lat = _lat;
        this._lng = _lng;
        this._northDirection = _northDirection;
        this._options = _options;
        this._scene = _scene;
        this._sunLight = _sunLight;
        // private _sunRotationCenter: TransformNode | null = null;
        this._sunName = '';
        this._beforeRenderObservable = null;
        this._axesParent = null;
        this._sunMesh = null;
        this._sunMaterial = null;
        this._sunName = stars_1.getRandomStarName();
        this._transformParent = new core_1.TransformNode('RealSun-ParentTransform', this._scene);
        this._transform.setParent(this._transformParent);
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this._now = date.getTime();
        this.calcSunAngles();
        this.calcSunPosition();
        if (this._sunLight) {
            this._sunLight.position = this.getPositionOffset();
        }
    }
    RealSun.prototype.setDateTimeInMillis = function (date, recalc) {
        if (recalc === void 0) { recalc = true; }
        this._now = date;
        if (recalc) {
            this.calcSunAngles();
            this.calcSunPosition();
            this.moveSun();
        }
    };
    RealSun.prototype.setParameters = function (params) {
        this._sunName = stars_1.getRandomStarName();
        this._radius = params.radius;
        this._lat = params.lat;
        this._lng = params.lng;
        this._northDirection = new core_1.Vector3(params.northDirection.x, params.northDirection.y, params.northDirection.z);
        this.setDateTimeInMillis(params.time, false);
        this.hideAxes();
        this.showAxes();
        if (this._sunLight) {
            this._sunLight.position = this.getPositionOffset();
        }
        if (this._sunMesh) {
            this._sunMesh.position = this.getPositionOffset();
        }
        this.calcSunAngles();
        this.calcSunPosition();
        this.moveSun();
    };
    RealSun.prototype.calcSunPosition = function () {
        var positions = suncalc_1.default.getPosition(this._now, this._lat, this._lng);
        this._angles = positions;
        this._transformParent.rotation.x = positions.altitude;
        this._transformParent.rotation.y = -positions.azimuth;
        if (this._sunLight) {
            this._position = this._sunLight.getAbsolutePosition();
        }
    };
    RealSun.prototype.calcSunAngles = function () {
        this._times = suncalc_1.default.getTimes(this._now, this._lat, this._lng, 0);
        this._sunrise = get_1.get(this._times, 'sunrise').getTime();
        this._sunriseEnd = get_1.get(this._times, 'sunriseEnd').getTime();
        this._sunset = get_1.get(this._times, 'sunsetStart').getTime();
        this._sunsetEnd = get_1.get(this._times, 'sunset').getTime();
        if (this._now > this._sunrise && this._now < this._sunriseEnd) {
            this._isSunrise = true;
            var period = this._sunriseEnd - this._sunrise;
            var offset = this._now - this._sunrise;
            var intensityStep = 1 / period;
            this._intensity = intensityStep * offset;
        }
        else {
            this._isSunrise = false;
        }
        if (this._now > this._sunriseEnd && this._now < this._sunset) {
            // day
            this._isDay = true;
            this._intensity = 1;
        }
        else {
            this._isDay = false;
        }
        if (this._now > this._sunset && this._now < this._sunsetEnd) {
            // sun going down
            // remove this to stop shuffling
            this._sunName = stars_1.getRandomStarName();
            this._isSunset = true;
            var period = this._sunsetEnd - this._sunset;
            var offset = this._sunsetEnd - this._now;
            var intensityStep = 1 / period;
            this._intensity = intensityStep * offset;
        }
        else {
            this._isSunset = false;
        }
        if (this._now > this._sunsetEnd) {
            // night
            this._isNight = true;
            this._intensity = 0;
        }
        else {
            this._isNight = false;
        }
    };
    //
    RealSun.prototype.getInfo = function () {
        var info = {
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
    };
    RealSun.prototype.getNow = function () {
        return this._now;
    };
    RealSun.prototype.setSun = function (sun) {
        this._sunLight = sun;
    };
    RealSun.prototype.moveSun = function () {
        var _a;
        if (!this._sunLight)
            return;
        this._sunLight.setDirectionToTarget(core_1.Vector3.Zero());
        if (this._sunMesh) {
        }
        var maxIntensitySun = (_a = this._options.sunMaxIntensity) !== null && _a !== void 0 ? _a : 1;
        this._sunLight.intensity = this._intensity * maxIntensitySun;
    };
    RealSun.prototype.showGadgets = function () {
        this.createDefaultSunMesh();
    };
    RealSun.prototype.hideGadgets = function () {
        if (this._sunMesh) {
            this._sunMesh.dispose();
            this._sunMesh = null;
        }
    };
    RealSun.prototype.createDefaultSunLight = function () {
        var _a;
        var sunDirection = core_1.Vector3.Zero();
        var sun = new core_1.DirectionalLight("RealSun-" + this._sunName, sunDirection, this._scene);
        this._sunLight = sun;
        sun.position = this.getPositionOffset();
        sun.range = this._radius;
        sun.intensity = (_a = this._options.sunMaxIntensity) !== null && _a !== void 0 ? _a : 1;
        this.calcSunAngles();
        this.calcSunPosition();
        sun.parent = this._transform;
        return sun;
    };
    RealSun.prototype.getPositionOffset = function () {
        var radius = this._radius;
        return this._northDirection
            .normalize()
            .multiplyByFloats(radius, radius, radius);
    };
    //
    RealSun.prototype.stopTimeSync = function () {
        if (this._beforeRenderObservable) {
            this._scene.onBeforeRenderObservable.remove(this._beforeRenderObservable);
        }
    };
    RealSun.prototype.startTimeSync = function () {
        var _this = this;
        if (!this._sunLight) {
            console.error('No sun. Call createDefaultSun() to create one or provide one in the constructor.');
            return;
        }
        this._beforeRenderObservable = this._scene.onBeforeRenderObservable.add(function () {
            _this.setDateTimeInMillis(Date.now());
            _this.calcSunAngles();
            _this.calcSunPosition();
            _this.moveSun();
        });
    };
    //
    RealSun.getCurrentDate = function () {
        return Date.now();
    };
    RealSun.getCurrentDateShifted = function (shiftByMillis) {
        var shifted = this.getCurrentDate() + shiftByMillis * 10000;
        return new Date(shifted);
    };
    //
    RealSun.prototype.createDefaultSunMesh = function (addGlowLayer) {
        var _a;
        if (addGlowLayer === void 0) { addGlowLayer = false; }
        if (this._sunMesh)
            return;
        var name = "RealSun-Mesh-" + this._sunName;
        var sunMesh = core_1.MeshBuilder.CreateSphere(name, { diameter: 6 }, this._scene);
        this._sunMesh = sunMesh;
        sunMesh.parent = this._transform;
        sunMesh.position = this.getPositionOffset();
        var sunMat = (_a = this._sunMaterial) !== null && _a !== void 0 ? _a : new core_1.PBRMaterial("RealSun-Material-" + this._sunName, this._scene);
        this._sunMaterial = sunMat;
        sunMat.emissiveColor = new core_1.Color3(1, 1, 0);
        sunMesh.material = sunMat;
        if (addGlowLayer) {
            new core_1.GlowLayer('glow', this._scene, {
                mainTextureFixedSize: 256,
                blurKernelSize: 64,
            });
        }
    };
    RealSun.prototype.makeTextPlane = function (text, color, size, parent) {
        var dynamicTexture = new core_1.DynamicTexture('RealSun-TextTexture', 50, this._scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
        var plane = core_1.Mesh.CreatePlane('TextPlane', size, this._scene, true);
        var material = new core_1.StandardMaterial('TextPlaneMaterial', this._scene);
        material.backFaceCulling = false;
        material.specularColor = new core_1.Color3(0, 0, 0);
        material.diffuseTexture = dynamicTexture;
        plane.material = material;
        plane.parent = parent;
        return plane;
    };
    RealSun.prototype.hideAxes = function () {
        var _a;
        if (!this._axesParent)
            return;
        this._axesParent.getChildren().forEach(function (n) { return n.dispose(); });
        (_a = this._axesParent) === null || _a === void 0 ? void 0 : _a.dispose();
        this._axesParent = null;
    };
    RealSun.prototype.showAxes = function (size) {
        if (this._axesParent)
            return;
        this._axesParent = new core_1.TransformNode('RealSun-AxesParentTransform', this._scene);
        size = size !== null && size !== void 0 ? size : this._radius;
        var axisX = core_1.Mesh.CreateLines('axisX', [
            core_1.Vector3.Zero(),
            new core_1.Vector3(size, 0, 0),
            new core_1.Vector3(size * 0.95, 0.05 * size, 0),
            new core_1.Vector3(size, 0, 0),
            new core_1.Vector3(size * 0.95, -0.05 * size, 0),
        ], this._scene);
        axisX.color = new core_1.Color3(1, 0, 0);
        var xChar = this.makeTextPlane('X', 'red', size / 10, this._axesParent);
        xChar.position = new core_1.Vector3(0.9 * size, 0.05 * size, 0);
        var axisY = core_1.Mesh.CreateLines('axisY', [
            core_1.Vector3.Zero(),
            new core_1.Vector3(0, size, 0),
            new core_1.Vector3(-0.05 * size, size * 0.95, 0),
            new core_1.Vector3(0, size, 0),
            new core_1.Vector3(0.05 * size, size * 0.95, 0),
        ], this._scene);
        axisY.color = new core_1.Color3(0, 1, 0);
        var yChar = this.makeTextPlane('Y', 'green', size / 10, this._axesParent);
        yChar.position = new core_1.Vector3(0, 0.9 * size, -0.05 * size);
        var axisZ = core_1.Mesh.CreateLines('axisZ', [
            core_1.Vector3.Zero(),
            new core_1.Vector3(0, 0, size),
            new core_1.Vector3(0, -0.05 * size, size * 0.95),
            new core_1.Vector3(0, 0, size),
            new core_1.Vector3(0, 0.05 * size, size * 0.95),
        ], this._scene);
        axisZ.color = new core_1.Color3(0, 0, 1);
        var zChar = this.makeTextPlane('Z', 'blue', size / 10, this._axesParent);
        zChar.position = new core_1.Vector3(0, 0.05 * size, 0.9 * size);
        var centerOfRotation = core_1.Vector3.ZeroReadOnly;
        var axisN = core_1.MeshBuilder.CreateLines('axisLine', {
            points: [
                core_1.Vector3.ZeroReadOnly,
                centerOfRotation.add(this._northDirection.scale(50)),
            ],
        }, this._scene);
        axisN.color = new core_1.Color3(1, 1, 0);
        axisX.parent = this._axesParent;
        axisY.parent = this._axesParent;
        axisZ.parent = this._axesParent;
        axisN.parent = this._axesParent;
    };
    return RealSun;
}());
exports.RealSun = RealSun;
