/// <reference path="../../node_modules/tns-platform-declarations/ios.d.ts" /> Needed for autocompletion and
// compilation.

import {AccelerometerData, GyroscopeData, LightData, PressureData, SensorOptions, StepData} from "./messages";

let main_queue = dispatch_get_current_queue();

function getNativeDelay(options?: SensorOptions): number {
    if (!options || !options.sensorDelay) {
        return 0.2;
    }

    switch (options.sensorDelay) {
        case "normal":
            return 0.2;
        case "ui":
            return 0.06;
        case "game":
            return 0.02;
        case "fastest":
            return 0.001;
    }
}

let accManager;
let accListening = false;
export function startAccelerometerUpdates(callback: (data: AccelerometerData) => void, options?: SensorOptions) {
    if (accListening) {
        stopAccelerometerUpdates();
    }

    const wrappedCallback = zonedCallback(callback);

    if (!accManager) {
        accManager = CMMotionManager.alloc().init();
    }

    accManager.accelerometerUpdateInterval = getNativeDelay(options);

    if (accManager.accelerometerAvailable) {
        var queue = NSOperationQueue.alloc().init();
        accManager.startAccelerometerUpdatesToQueueWithHandler(queue, (data, error) => {
            dispatch_async(main_queue, () => {
                wrappedCallback({
                    x: data.acceleration.x,
                    y: data.acceleration.y,
                    z: data.acceleration.z
                })
            })
        });

        accListening = true;
    } else {
        throw new Error("Accelerometer not available.")
    }
}

export function stopAccelerometerUpdates() {
    if (accListening) {
        accManager.stopAccelerometerUpdates();
        accListening = false;
    }
}

let baroManager;
let baroListening = false;
export function startBarometerUpdates(callback: (data: PressureData) => void, options?: SensorOptions) {
    if (baroListening) {
        stopBarometerUpdates();
    }

    const wrappedCallback = zonedCallback(callback);

    if (!baroManager) {
        baroManager = CMMotionManager.alloc().init();
    }

    baroManager.barometerUpdateInterval = getNativeDelay(options);

    if (baroManager.barometerAvailable) {
        var queue = NSOperationQueue.alloc().init();
        baroManager.startRelativeAltitudeUpdatesToQueueWithHandler(queue, (data, error) => {
            dispatch_async(main_queue, () => {
                wrappedCallback({
                    mbar: data.pressure
                })
            })
        });

        baroListening = true;
    } else {
        throw new Error("Barometer not available.")
    }
}

export function stopBarometerUpdates() {
    if (baroListening) {
        baroManager.stopRelativeAltitudeUpdates();
        baroListening = false;
    }
}

let gyroManager;
let gyroListening = false;
export function startGyroscopeUpdates(callback: (data: GyroscopeData) => void, options?: SensorOptions) {
    if (gyroListening) {
        stopGyroscopeUpdates();
    }

    const wrappedCallback = zonedCallback(callback);

    if (!gyroManager) {
        gyroManager = CMMotionManager.alloc().init();
    }

    gyroManager.gyroscopeUpdateInterval = getNativeDelay(options);

    if (gyroManager.gyroscopeAvailable) {
        var queue = NSOperationQueue.alloc().init();
        gyroManager.startGyroUpdatesToQueueWithHandler(queue, (data, error) => {
            dispatch_async(main_queue, () => {
                wrappedCallback({
                    x: data.rotationRate.x,
                    y: data.rotationRate.y,
                    z: data.rotationRate.z
                })
            })
        });

        gyroListening = true;
    } else {
        throw new Error("Gyroscope not available.")
    }
}

export function stopGyroscopeUpdates() {
    if (gyroListening) {
        gyroManager.stopGyroUpdates();
        gyroListening = false;
    }
}

export function startLightUpdates(callback: (data: LightData) => void, options?: SensorOptions) {
        throw new Error("Light not available on iOS")
}

export function stopLightUpdates() {
}

let stepManager;
let stepListening = false;
export function startStepUpdates(callback: (data: StepData) => void, options?: SensorOptions) {
    if (stepListening) {
        stopStepUpdates();
    }

    const wrappedCallback = zonedCallback(callback);

    if (!stepManager) {
        stepManager = CMMotionManager.alloc().init();
    }

    stepManager.stepUpdateInterval = getNativeDelay(options);

    if (stepManager.stepAvailable) {
        var queue = NSOperationQueue.alloc().init();
        stepManager.startPedometerEventUpdatesWithHandler((data, error) => {
            dispatch_async(main_queue, () => {
                wrappedCallback({
                    counter: data.numberOfSteps
                })
            })
        });

        stepListening = true;
    } else {
        throw new Error("Step not available.")
    }
}

export function stopStepUpdates() {
    if (stepListening) {
        stepManager.stopStepUpdates();
        stepListening = false;
    }
}
