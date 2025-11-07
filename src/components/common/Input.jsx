import React from 'react';
import styled from 'styled-components';

const Input = ({ label, type, placeholder, registerObject }) => {
  return (
    <StyledWrapper className='w-100'>
      <div className="form__group field w-100">
        <input
          type={type}
          className="form__field w-100 mt-1"
          placeholder={placeholder}
          required
          {...registerObject}
        />
        <label htmlFor={label} className="form__label">
          {label}
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .form__group {
    position: relative;
    padding: 20px 0 0;
    width: 100%;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: none;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 17px;
    color: #212529;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
  }

  .form__field::placeholder {
    color: transparent;
  }

  .form__field:placeholder-shown ~ .form__label {
    font-size: 17px;
    cursor: text;
    top: 20px;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 17px;
    color: rgb(7, 103, 153);
    pointer-events: none;
  }

  .form__field:focus {
    padding-bottom: 6px;

    border-width: 3px;
    border-image: linear-gradient(to right, #6fc5ffff, rgb(7, 103, 153););
    border-image-slice: 1;
  }

  .form__field:focus ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 17px;
    color: rgb(7, 103, 153);
    font-weight: 700;
  }

  /* reset input */
  .form__field:required, .form__field:invalid {
    box-shadow: none;
  }`;

export default Input;
