import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ checked, onChange }) => {
  return (
    <StyledWrapper>
      <div className="container">
        <input
          style={{ display: "none" }}
          id="mute"
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />

        <label className="check" htmlFor="mute">
          <svg viewBox="0 0 18 18" height="22px" width="22px">
            <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .check {
    cursor: pointer;
    position: relative;
    margin: auto;
    width: 10px;
    height: 10px;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0, 0, 0);
  }

  .check:before {
    content: "";
    position: absolute;
    top: -15px;
    left: -15px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgb(33 33 33 / 0%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .check svg {
    position: relative;
    z-index: 1;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #c8ccd4;
    stroke-width: 1.5;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
  }

  .check svg path {
    stroke-dasharray: 60;
    stroke-dashoffset: 0;
  }

  .check svg polyline {
    stroke-dasharray: 22;
    stroke-dashoffset: 66;
  }

  .check:hover:before {
    opacity: 1;
  }

  .check:hover svg {
    stroke: #4285f4;
  }

  #mute:checked + .check svg {
    stroke: #4285f4;
  }

  #mute:checked + .check svg path {
    stroke-dashoffset: 60;
    transition: all 0.3s linear;
  }

  #mute:checked + .check svg polyline {
    content: "done";
    stroke-dashoffset: 42;
    transition: all 0.2s linear;
    transition-delay: 0.15s;
    border-color: transparent;
    stroke: #4285f4;
    animation: mute 0.6s ease;
  }

  @keyframes mute {
    from {
      transform: scale(1, 1);
    }

    30% {
      transform: scale(1.25, 0.75);
    }

    40% {
      transform: scale(0.75, 1.25);
    }

    50% {
      transform: scale(1.15, 0.85);
    }

    65% {
      transform: scale(0.95, 1.05);
    }

    75% {
      transform: scale(1.05, 0.95);
    }

    to {
      transform: scale(1, 1);
    }
  }`;

export default Checkbox;
