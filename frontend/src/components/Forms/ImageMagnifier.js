import React, {useState} from "react";

export default React.forwardRef(function ImageMagnifier({
                                         src,
                                         magnifierHeight = 150,
                                         magnifierWidth = 150,
                                         zoomLevel = 1.5,
                                         style,
                                         alt,
                                         onLoad,
                                         className
                                       }, ref
) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <img
        src={src}
        style={style}
        onMouseEnter={(e) => {
          // update image size and turn-on magnifier
          const elem = e.currentTarget;
          const {width, height} = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          // update cursor position
          const elem = e.currentTarget;
          const {top, left} = elem.getBoundingClientRect();

          // calculate cursor position on the image
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          // close magnifier
          setShowMagnifier(false);
        }}
        alt={alt}
        onLoad={onLoad}
        className={className}
        ref={ref}
      />

      <div
        style={{
          display: showMagnifier ? "" : "none",
          position: "absolute",

          // prevent magnifier blocks the mousemove event of img
          pointerEvents: "none",
          // set size of magnifier
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          // move element center to cursor pos
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifierWidth / 2}px`,
          opacity: "1", // reduce opacity so you can verify position
          border: "1px solid lightgray",
          overflow: 'hidden'
        }}
      >
        <img
          src={src}
          style={{
            position: 'absolute',
            ...(style || {}),
            left: `${-x * zoomLevel + magnifierWidth / 2}px`,
            top: `${-y * zoomLevel + magnifierHeight / 2}px`,
            width: `${imgWidth * zoomLevel}px`,
            height: `${imgHeight * zoomLevel}px`
          }}
          alt="zoom"
        />
      </div>
    </div>
  );
})