import Modal from 'react-modal'

const modalStyles: Modal.Styles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      zIndex: '9999',
      justifyContent: 'center',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
    },
    // transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    // transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    // transition-duration: 150ms;
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // background: 'linear-gradient(180deg, rgba(163, 230, 53, 1), rgba(168, 85, 247, 0.7))',
      background: 'linear-gradient(120deg, rgba(71, 85, 105, 1), rgba(177,177,177, 1))',
      // backgroundColor: 'rgba(71, 85, 105, 1)',
      zIndex: '99999',
      color: 'white',
      border: '3px solid #000',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      transitionDuration: '150ms',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  };

export default modalStyles;