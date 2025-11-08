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
 `;

export default Input;
