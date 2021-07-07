export default SunCalc;
declare namespace SunCalc {
    function getPosition(date: any, lat: any, lng: any): {
        azimuth: number;
        altitude: number;
    };
    const times: (string | number)[][];
    function addTime(angle: any, riseName: any, setName: any): void;
    function getTimes(date: any, lat: any, lng: any, height: any): {
        solarNoon: Date;
        nadir: Date;
    };
    function getMoonPosition(date: any, lat: any, lng: any): {
        azimuth: number;
        altitude: number;
        distance: number;
        parallacticAngle: number;
    };
    function getMoonIllumination(date: any): {
        fraction: number;
        phase: number;
        angle: number;
    };
    function getMoonTimes(date: any, lat: any, lng: any, inUTC: any): {
        rise: Date;
        set: Date;
    };
}
//# sourceMappingURL=suncalc.d.ts.map