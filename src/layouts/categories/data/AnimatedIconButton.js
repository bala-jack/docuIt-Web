import React, { memo } from 'react';
import { useSpring, animated } from 'react-spring';
import PropTypes from "prop-types";

export const AnimatedIconButton = memo(({ children }) => {

  const animation = useSpring({
    from: {
      opacity: 0,
      transform: 'scale(0.5)'
    },
    to: {
      opacity: 1,
      transform: 'scale(1)'
    },
    reset: false,
    reverse: false
  })

  return (
    <animated.div style={animation}>
      {children}
    </animated.div>
  );
});


export const AnimatedIconEditButton = memo(({ children }) => {

  const animationEdit = useSpring({
    from: {
      opacity: 0,
      transform: 'scale(0.5)'
    },
    to: {
      opacity: 1,
      transform: 'scale(1)'
    },
    reset: false,
    reverse: false
  })

  return (
    <animated.div style={animationEdit}>
      {children}
    </animated.div>
  );
})


AnimatedIconButton.propTypes = {
  children: PropTypes.node.isRequired,
};


AnimatedIconEditButton.propTypes = {
  children: PropTypes.node.isRequired,
};