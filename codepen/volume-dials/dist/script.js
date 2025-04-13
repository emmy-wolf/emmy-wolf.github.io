import React, { StrictMode, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import gsap from "https://esm.sh/gsap";
import { useGSAP } from "https://esm.sh/@gsap/react";
import { Draggable } from "https://esm.sh/gsap/Draggable";
gsap.registerPlugin(useGSAP, Draggable);
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement("main", null,
        React.createElement(VolumeDial, { ticks: 31, color: "blue" }),
        React.createElement(VolumeDial, { volume: 0.5, ticks: 16, color: "green" }),
        React.createElement(VolumeDial, { volume: 0.2, ticks: 10, color: "red" }))));
function VolumeDial({ color, ticks, volume = 0, label = "Volume", children }) {
    const [isKeyDown, setIsKeydown] = useState(false);
    const dialRef = useRef(null);
    const rootClass = `volume${color ? ` volume--${color}` : ''}`;
    // volume
    const [vol, setVol] = useState(volume);
    const maxTick = Math.max(1, ticks) || 1;
    const tick = Math.max(0, vol * maxTick);
    const percent = `${Math.round(vol * 100)}%`;
    // dial angle
    const minAngle = -135;
    const maxAngle = 135;
    const angleSpan = maxAngle - minAngle;
    const startAngle = minAngle + vol * angleSpan;
    const [angle, setAngle] = useState(startAngle);
    // dots
    const dotSectorAngle = angleSpan / maxTick;
    const dotSectorAngleOffset = -angleSpan / 2 + dotSectorAngle / 2;
    const dotTickOffset = 0.5;
    const dotFillArray = [];
    for (let t = 0; t < ticks; ++t) {
        // add dots for valid tick counts only
        dotFillArray.push(t < tick - dotTickOffset);
    }
    // set the volume
    useEffect(() => {
        setVol((angle - minAngle) / angleSpan);
    }, [angle]);
    // initiate the draggable
    useEffect(() => {
        Draggable.create(dialRef.current, {
            type: "rotation",
            bounds: {
                minRotation: minAngle,
                maxRotation: maxAngle
            },
            onDrag: function () {
                setAngle(this.rotation);
            }
        });
    }, []);
    // run a transition when adjusting using arrow keys
    useGSAP(() => {
        if (isKeyDown) {
            gsap.to(dialRef.current, {
                rotation: angle,
                duration: 0.15
            });
        }
    }, [angle]);
    // starting angle
    useGSAP(() => {
        gsap.to(dialRef.current, {
            rotation: startAngle,
            duration: 0
        });
    }, []);
    /**
     * Perform a keyboard action on this dial.
     * @param e Keyboard event
     */
    function keyboardAction(e) {
        const up = e.code === "ArrowUp" || e.code === "ArrowRight";
        const down = e.code === "ArrowDown" || e.code === "ArrowLeft";
        if (up || down) {
            e.preventDefault();
            setIsKeydown(true);
        }
        if (up) {
            setAngle(minAngle + Math.min(tick + 1, maxTick) / maxTick * angleSpan);
        }
        else if (down) {
            setAngle(minAngle + Math.max(0, tick - 1) / maxTick * angleSpan);
        }
    }
    return (React.createElement("div", { className: rootClass },
        React.createElement("div", { className: "volume__control" },
            dotFillArray.map((l, i) => {
                const angle = dotSectorAngle * i + dotSectorAngleOffset;
                return (React.createElement(VolumeDialDot, { key: i, angle: angle, filled: l }));
            }),
            React.createElement("div", { className: "volume__dial-wrap" },
                React.createElement("button", { className: "volume__dial", type: "button", ref: dialRef, onKeyDown: keyboardAction, onKeyUp: () => setIsKeydown(false), "aria-description": percent },
                    React.createElement("span", { className: "volume__dial-label" }, label)))),
        React.createElement("div", { className: "volume__content" }, children)));
}
function VolumeDialDot({ angle = 0, filled = false }) {
    const filledClass = filled === true ? " volume__dot--filled" : "";
    const dotClass = `volume__dot${filledClass}`;
    const dotStyle = {
        transform: `rotate(${angle}deg)`
    };
    return (React.createElement("div", { className: dotClass, style: dotStyle }));
}