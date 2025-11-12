import React from 'react'

type Props = {
  label: string
  name: string
  type: 'text' | 'password' | 'email'
  placeholder?: string
  required?: boolean
  defaultValue?: string
}

export const Input = (props: Props) => {
  return (
    <div className="space-y-1">
      <label htmlFor={props.name} className="block text-sm font-medium text-emerald-950">
        {props.label}
      </label>
      <input
        defaultValue={props.defaultValue}
        required={props.required ?? true}
        className="block w-full rounded-md border border-emerald-950/20 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brands-500 focus:border-transparent text-emerald-950 placeholder-emerald-950/40"
        id={props.name}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder ?? `Enter your ${props.label.toLowerCase()}`}
      />
    </div>
  )
}
