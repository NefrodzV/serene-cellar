import React, { Children, useState } from 'react'
// Continue this custom select
export function Select({ id, value, onChange, text, disabled, children }) {
  const [isFocus, setIsFocus] = useState(false)

  // Need to update here when
  function onClickHandler(value, disabled) {
    if (disabled) return
    onChange(value, id)
    setIsFocus(!isFocus)
  }

  function onChangeHandler(e) {
    console.log('change', e.target.dataset)
  }

  function onFocusHandler(e) {
    setIsFocus(!isFocus)
  }

  const items = Children.toArray(children)
    .filter((child) => child.type === Select.Option)
    .map((child) => ({
      value: child.props.value,
      disabled: child.props.disabled,
      label: child.props.label,
      content: child.props.children,
    }))

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
        {items.map((item) => (
          <div
            className={`item ${
              item.disabled
                ? 'disabled'
                : value === item.value
                  ? 'selected'
                  : ''
            }`}
            onFocus={onFocusHandler}
            key={item.value}
            onClick={() => onClickHandler(item.value, item.disabled)}
          >
            {item.content}
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
        {items?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}

Select.Option = function Option({ children }) {
  return <>{children}</>
}
