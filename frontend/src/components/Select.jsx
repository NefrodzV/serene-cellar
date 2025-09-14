import React, { useRef, useState } from 'react'
// Continue this custom select
export function Select({ id, options, onChange, value, text, disabled }) {
  const [isFocus, setIsFocus] = useState(false)

  function onClickHandler(e) {
    const value = e.target.dataset.value
    onChange(value)
    setIsFocus(!isFocus)
  }

  function onChangeHandler(e) {
    onChange(e.target.value)
  }

  function onFocusHandler(e) {
    setIsFocus(!isFocus)
  }

  return (
    <div className="select">
      <div className="overlay" data-open={isFocus} onClick={onFocusHandler} />
      <button
        onClick={onFocusHandler}
        className="select-selected button"
        data-open={isFocus}
        disabled={disabled}
      >
        {text || value}
        {isFocus ? (
          <i className="fa-solid fa-caret-up"></i>
        ) : (
          <i className="fa-solid fa-caret-down"></i>
        )}
      </button>

      <div className="select-items" data-open={isFocus} aria-hidden={true}>
        {options.map((option) => (
          <div
            className={
              option.disabled
                ? 'disabled'
                : value === option.value
                  ? 'selected'
                  : ''
            }
            onFocus={onFocusHandler}
            key={option.key}
            onClick={option.disabled ? undefined : onClickHandler}
            data-value={option.value}
          >
            {option.text || option.value}
          </div>
        ))}
      </div>
      <select
        onChange={onChangeHandler}
        name={id}
        id={id}
        onFocus={onFocusHandler}
        value={value}
      >
        {options?.map((option) => (
          <option key={option.key} value={option.value}>
            {option.text || option.value}
          </option>
        ))}
      </select>
    </div>
  )
}
